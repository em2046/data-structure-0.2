import { LinkedList } from "./linked-list";
import { Entry } from "./entry";
import { hash } from "./hasher";
import { equality } from "./equatable";

// Copied from
// https://github.com/openjdk/jdk/blob/1fb798d320c708dfcbc0bb157511a2937fafb9e6/src/java.base/share/classes/java/util/Hashtable.java

const MAX_ARRAY_SIZE = 2 ** 32 - 1;

export class HashMap<K, V> implements Iterable<[K, V]> {
  readonly #loadFactor: number;
  #threshold: number;
  #size = 0;
  #table: LinkedList<Entry<K, unknown>>[] = [];

  constructor(initialCapacity = 11, loadFactor = 0.75) {
    if (initialCapacity < 0) {
      throw new Error(`Illegal Capacity: ${initialCapacity}`);
    }

    if (loadFactor <= 0 || Number.isNaN(loadFactor)) {
      throw new Error(`Illegal Load: ${initialCapacity}`);
    }

    if (initialCapacity === 0) {
      initialCapacity = 1;
    }

    this.#loadFactor = loadFactor;
    this.#table = new Array(initialCapacity);
    this.#threshold = Math.floor(
      Math.min(initialCapacity * loadFactor, MAX_ARRAY_SIZE + 1)
    );
  }

  get size(): number {
    return this.#size;
  }

  static from<K, V>(iterable: Iterable<[K, V]> = []): HashMap<K, V> {
    const elements = [...iterable];
    const map = new HashMap<K, V>(Math.max(2 * elements.length, 11), 0.75);

    for (const [key, value] of elements) {
      map.set(key, value);
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
    const table = this.#table;
    const hashValue = hash(key);
    const index = (hashValue & 0x7fffffff) % table.length;
    const list = table[index];

    if (list !== undefined) {
      for (const entry of list) {
        if (equality(entry.key, key)) {
          entry.value = value;

          return this;
        }
      }
    }

    this.#addEntry(hashValue, key, value, index);

    return this;
  }

  get(key: K): V | undefined {
    const table = this.#table;
    const hashValue = hash(key);
    const index = (hashValue & 0x7fffffff) % table.length;
    const list = table[index];

    if (list !== undefined) {
      for (const entry of list) {
        if (equality(entry.key, key)) {
          return entry.value as V;
        }
      }
    }

    return undefined;
  }

  delete(key: K): boolean {
    const table = this.#table;
    const hashValue = hash(key);
    const index = (hashValue & 0x7fffffff) % table.length;
    const list = table[index];

    if (list !== undefined) {
      const succeed = list.delete(new Entry<K, unknown>(key, {}));

      if (succeed) {
        this.#size -= 1;

        return true;
      }
    }

    return false;
  }

  clear(): void {
    const table = this.#table;
    const size = table.length;

    for (let i = 0; i < size; i++) {
      if (table[i] !== undefined) {
        table[i].clear();
      }
    }

    this.#size = 0;
  }

  #addEntry(hashValue: number, key: K, value: V, index: number): void {
    let table = this.#table;

    if (this.#size >= this.#threshold) {
      this.#rehash();

      table = this.#table;
      hashValue = hash(key);
      index = index = (hashValue & 0x7fffffff) % table.length;
    }

    if (table[index] === undefined) {
      table[index] = new LinkedList<Entry<K, unknown>>();
    }

    table[index].add(new Entry(key, value));
    this.#size += 1;
  }

  #rehash(): void {
    const oldCapacity = this.#table.length;
    const oldMap = this.#table;
    let newCapacity = (oldCapacity << 1) + 1;

    if (newCapacity - MAX_ARRAY_SIZE > 0) {
      if (oldCapacity === MAX_ARRAY_SIZE) {
        return;
      }

      newCapacity = MAX_ARRAY_SIZE;
    }

    const newMap = new Array<LinkedList<Entry<K, unknown>>>(newCapacity);

    this.#threshold = Math.floor(
      Math.min(newCapacity * this.#loadFactor, MAX_ARRAY_SIZE + 1)
    );
    this.#table = newMap;

    for (let i = 0; i < oldCapacity; i++) {
      const old = oldMap[i];

      if (old !== undefined) {
        for (const entry of old) {
          const index = (hash(entry.key) & 0x7fffffff) % newCapacity;

          if (newMap[index] === undefined) {
            newMap[index] = new LinkedList<Entry<K, unknown>>();
          }

          newMap[index].add(entry);
        }
      }
    }
  }
}
