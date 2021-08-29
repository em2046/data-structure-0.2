// Copied from
// https://github.com/openjdk/jdk/blob/1fb798d320c708dfcbc0bb157511a2937fafb9e6/src/java.base/share/classes/java/util/HashMap.java

import { LinkedList } from "./linked-list";
import { Entry } from "./entry";
import { hash } from "./hasher";

const DEFAULT_INITIAL_CAPACITY = 1 << 4;
const DEFAULT_LOAD_FACTOR = 0.75;
const MAXIMUM_CAPACITY = 1 << 30;
const ARRAY_MAX_LENGTH = 2 ** 32 - 1;

export class HashMap<K, V> implements Iterable<[K, V]> {
  readonly #loadFactor: number;
  #threshold: number;
  #size = 0;
  #table: LinkedList<Entry<K, unknown>>[] = [];

  constructor(
    initialCapacity = DEFAULT_INITIAL_CAPACITY,
    loadFactor = DEFAULT_LOAD_FACTOR
  ) {
    if (initialCapacity > MAXIMUM_CAPACITY) {
      initialCapacity = MAXIMUM_CAPACITY;
    }

    if (loadFactor <= 0 || Number.isNaN(loadFactor)) {
      throw new Error(`Illegal load factor: ${loadFactor}`);
    }

    this.#loadFactor = loadFactor;
    this.#threshold = (loadFactor * initialCapacity) | 0;

    if (initialCapacity === MAXIMUM_CAPACITY) {
      this.#threshold = ARRAY_MAX_LENGTH;
    }

    this.#table = new Array(initialCapacity);
  }

  get size(): number {
    return this.#size;
  }

  get #capacity(): number {
    return this.#table.length;
  }

  static from<K, V>(
    iterable: Iterable<[K, V]> = [],
    initialCapacity: number | undefined = undefined,
    loadFactor = DEFAULT_LOAD_FACTOR
  ): HashMap<K, V> {
    let capacity = initialCapacity ?? DEFAULT_INITIAL_CAPACITY;

    if (initialCapacity === undefined) {
      const elements = [...iterable];

      capacity = elements.length;
    }

    const map = new HashMap<K, V>(capacity, loadFactor);

    for (const [key, value] of iterable) {
      map.#set(key, value);
      map.#size += 1;
    }

    return map;
  }

  [Symbol.iterator](): IterableIterator<[K, V]> {
    return this.entries();
  }

  entries(): IterableIterator<[K, V]> {
    const table = this.#table;
    let index = 0;
    let listIterator: IterableIterator<Entry<K, unknown>> | undefined =
      table[0]?.[Symbol.iterator]();

    return {
      [Symbol.iterator](): IterableIterator<[K, V]> {
        return this;
      },
      next(): IteratorResult<[K, V]> {
        let element: [K, V] | undefined;

        while (index < table.length) {
          if (listIterator === undefined) {
            index += 1;
            listIterator = table[index]?.[Symbol.iterator]();
            continue;
          }

          const next = listIterator.next();

          if (next?.done) {
            listIterator = undefined;
          } else {
            const { key, value } = next.value;

            element = [key, value as V];
            break;
          }
        }

        if (element === undefined) {
          return {
            done: true,
            value: undefined,
          };
        } else {
          return {
            done: false,
            value: element,
          };
        }
      },
    };
  }

  keys(): IterableIterator<K> {
    const iterator = this.entries();

    return {
      [Symbol.iterator](): IterableIterator<K> {
        return this;
      },
      next(): IteratorResult<K> {
        const next = iterator.next();

        if (next.done) {
          return {
            done: true,
            value: undefined,
          };
        }

        const [key] = next.value;

        return {
          done: false,
          value: key,
        };
      },
    };
  }

  values(): IterableIterator<V> {
    const iterator = this.entries();

    return {
      [Symbol.iterator](): IterableIterator<V> {
        return this;
      },
      next(): IteratorResult<V> {
        const next = iterator.next();

        if (next.done) {
          return {
            done: true,
            value: undefined,
          };
        }

        const [, value] = next.value;

        return {
          done: false,
          value: value,
        };
      },
    };
  }

  set(key: K, value: V): HashMap<K, V> {
    if (this.#capacity === 0) {
      this.#resize(DEFAULT_INITIAL_CAPACITY);
    }

    const raise = this.#set(key, value);

    this.#size += raise;

    if (raise !== 0 && this.#size > this.#threshold) {
      this.#resize(this.#capacity << 1);
    }

    return this;
  }

  get(key: K): V | undefined {
    const hashValue = hash(key);
    const index = hashValue % this.#capacity;
    const list = this.#table[index];

    if (list === undefined) {
      return undefined;
    }

    const element = list.get(new Entry(key, {}));

    if (element === undefined) {
      return undefined;
    }

    return element.value as V;
  }

  delete(key: K): boolean {
    const reduced = this.#delete(key);

    if (reduced) {
      this.#size -= 1;

      if (this.#size < this.#threshold >> 2) {
        this.#resize(this.#capacity >> 2);
      }
    }

    return reduced;
  }

  clear(): void {
    for (let i = 0; i < this.#capacity; i++) {
      this.#table[i]?.clear();
    }

    this.#size = 0;
    this.#resize(0);
  }

  #set(key: K, value: V): number {
    const hashValue = hash(key);
    const index = hashValue % this.#capacity;
    const table = this.#table;

    if (table[index] === undefined) {
      table[index] = new LinkedList<Entry<K, unknown>>();
    }

    const list = table[index];
    const size = list.size;

    list.add(new Entry(key, value));

    return list.size - size;
  }

  #delete(key: K): boolean {
    const hashValue = hash(key);
    const index = hashValue % this.#capacity;
    const list = this.#table[index];

    if (list === undefined) {
      return false;
    }

    return list.delete(new Entry(key, {}));
  }

  #resize(newCap: number): void {
    const clone = HashMap.from([...this], newCap, this.#loadFactor);

    this.#table = clone.#table;
    this.#size = clone.#size;
    this.#threshold = clone.#threshold;
  }
}
