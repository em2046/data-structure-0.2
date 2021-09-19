import { LinkedList } from "./linked-list";
import { Entry } from "./entry";
import { hash } from "./hasher";
import { equality } from "./equatable";
import { AbstractMap } from "./abstract-map";

// Copied from
// https://github.com/openjdk/jdk/blob/1fb798d320c708dfcbc0bb157511a2937fafb9e6/src/java.base/share/classes/java/util/Hashtable.java
// https://github.com/kevin-wayne/algs4/blob/2a3d7f7a36d76fbf5222c26b3d71fcca85d82fc1/src/main/java/edu/princeton/cs/algs4/SeparateChainingHashST.java

const MAX_ARRAY_SIZE = 2 ** 32 - 1;
const PRESENT = {};

/**
 * @public
 *
 * The hash map holds key-value pairs.
 * Any value (both objects and primitive values) may be used as either a key or
 * a value.
 */
export class HashMap<K, V> implements AbstractMap<K, V> {
  readonly #loadFactor: number;
  #threshold: number;
  #size = 0;
  #table: (LinkedList<Entry<K, unknown>> | undefined)[];

  /**
   * Creates a new hash map.
   *
   * @param initialCapacity - The initial capacity of the hash map.
   * @param loadFactor - The load factor of the hash map.
   */
  constructor(initialCapacity = 11, loadFactor = 0.75) {
    if (initialCapacity < 0) {
      throw new RangeError(`Illegal capacity: ${initialCapacity}`);
    }

    if (loadFactor <= 0 || Number.isNaN(loadFactor)) {
      throw new RangeError(`Illegal load: ${loadFactor}`);
    }

    if (initialCapacity === 0) {
      initialCapacity = 1;
    }

    if (initialCapacity - MAX_ARRAY_SIZE > 0) {
      initialCapacity = MAX_ARRAY_SIZE;
    }

    this.#loadFactor = loadFactor;
    this.#table = new Array(initialCapacity).fill(undefined);
    this.#threshold = Math.floor(
      Math.min(initialCapacity * loadFactor, MAX_ARRAY_SIZE + 1)
    );
  }

  /**
   * Returns the number of key/value pairs in the hash map.
   */
  get size(): number {
    return this.#size;
  }

  /**
   * Creates a new, shallow-copied hash map instance from an iterable object.
   *
   * @param iterable - An `Array` or other iterable object whose elements are
   * key-value pairs. (For example, arrays with two elements, such as
   * `[[ 1, 'one' ],[ 2, 'two' ]]`.) Each key-value pair is added to the new
   * hash map.
   */
  static from<K, V>(iterable: Iterable<[K, V]>): HashMap<K, V> {
    let size: number;
    const arrayLike = iterable as unknown as ArrayLike<[K, V]>;

    if (typeof arrayLike.length === "number") {
      size = arrayLike.length;
    } else {
      const elements = [...iterable];

      size = elements.length;
    }

    const map = new HashMap<K, V>(Math.max(2 * size, 11), 0.75);

    for (const [key, value] of iterable) {
      map.set(key, value);
    }

    return map;
  }

  /**
   * Returns a new iterator object that contains **an array of `[key, value]`**
   * for each element in the hash map.
   */
  [Symbol.iterator](): IterableIterator<[K, V]> {
    return this.entries();
  }

  /**
   * Returns a new iterator object that contains **an array of `[key, value]`**
   * for each element in the hash map.
   */
  entries(): IterableIterator<[K, V]> {
    const table = this.#table;
    let index = 0;
    let listIterator: IterableIterator<Entry<K, unknown>> | undefined;

    return {
      [Symbol.iterator](): IterableIterator<[K, V]> {
        return this;
      },
      next(): IteratorResult<[K, V]> {
        let element: [K, V] | undefined;

        while (index < table.length) {
          if (listIterator === undefined) {
            const list = table[index];

            if (list === undefined || list.size === 0) {
              index += 1;
            } else {
              listIterator = list.elements();
            }

            continue;
          }

          const next = listIterator.next();

          if (next.done) {
            listIterator = undefined;
            index += 1;
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

  /**
   * Returns a new iterator object that contains the **keys** for each element
   * in the hash map.
   */
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

  /**
   * Returns a new iterator object that contains the **values** for each
   * element in the hash map.
   */
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

  /**
   * Calls `callback` once for each key-value pair present in the hash map.
   * If a `thisArg` parameter is provided to `forEach`, it will be used as the
   * `this` value for each callback.
   *
   * @param callback - Function to execute for each entry in the map.
   * @param thisArg - Value to use as `this` when executing `callback`.
   */
  forEach(
    callback: (value: V, key: K, map: HashMap<K, V>) => void,
    thisArg?: any
  ): void {
    for (const [key, value] of this.entries()) {
      callback.call(thisArg, value, key, this);
    }
  }

  /**
   * Returns the value associated to the `key`, or `undefined` if there is
   * none.
   *
   * @param key - The key of the element to return from the hash map.
   */
  get(key: K): V | undefined {
    const table = this.#table;
    const hashValue = hash(key);
    const index = (hashValue & 0x7fff_ffff) % table.length;
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

  /**
   * Returns a boolean asserting whether a value has been associated to the
   * `key` in the map or not.
   *
   * @param key - The key of the element to test for presence in the hash map.
   */
  has(key: K): boolean {
    return this.get(key) !== undefined;
  }

  /**
   * Sets the `value` for the `key` in the hash map. Returns the hash map.
   *
   * @param key - The key of the element to add to the hash map.
   * @param value - The value of the element to add to the hash map.
   */
  set(key: K, value: V): this {
    const table = this.#table;
    const hashValue = hash(key);
    const index = (hashValue & 0x7fff_ffff) % table.length;
    const list = table[index];

    if (list !== undefined) {
      for (const entry of list) {
        if (equality(entry.key, key)) {
          entry.value = value;

          return this;
        }
      }
    }

    this.#add(hashValue, key, value, index);

    return this;
  }

  /**
   * Returns `true` if an element in the hash map existed and has been removed,
   * or `false` if the element does not exist.
   *
   * @param key - The key of the element to remove from the hash map.
   */
  delete(key: K): boolean {
    const table = this.#table;
    const hashValue = hash(key);
    const index = (hashValue & 0x7fff_ffff) % table.length;
    const list = table[index];

    if (list !== undefined) {
      const existed = list.delete(new Entry<K, unknown>(key, PRESENT));

      if (existed) {
        this.#size -= 1;

        return true;
      }
    }

    return false;
  }

  /**
   * Removes all key-value pairs from the hash map.
   */
  clear(): void {
    const table = this.#table;
    const size = table.length;

    for (let i = 0; i < size; i++) {
      const list = table[i];

      if (list !== undefined) {
        list.clear();
        table[i] = undefined;
      }
    }

    this.#size = 0;
  }

  #add(hashValue: number, key: K, value: V, index: number): void {
    let table = this.#table;

    if (this.#size >= this.#threshold) {
      this.#rehash();

      table = this.#table;
      index = (hashValue & 0x7fff_ffff) % table.length;
    }

    let list = table[index];

    if (list === undefined) {
      list = new LinkedList<Entry<K, unknown>>();
      table[index] = list;
    }

    list.pushBack(new Entry(key, value));
    this.#size += 1;
  }

  #rehash(): void {
    const oldTable = this.#table;
    const oldCapacity = oldTable.length;
    let newCapacity = oldCapacity * 2 + 1;

    if (newCapacity - MAX_ARRAY_SIZE > 0) {
      if (oldCapacity === MAX_ARRAY_SIZE) {
        return;
      }

      newCapacity = MAX_ARRAY_SIZE;
    }

    const newTable = new Array<LinkedList<Entry<K, unknown>> | undefined>(
      newCapacity
    ).fill(undefined);

    this.#threshold = Math.floor(
      Math.min(newCapacity * this.#loadFactor, MAX_ARRAY_SIZE + 1)
    );
    this.#table = newTable;

    for (let i = 0; i < oldCapacity; i++) {
      const oldList = oldTable[i];

      if (oldList !== undefined) {
        for (const entry of oldList) {
          const index = (hash(entry.key) & 0x7fff_ffff) % newCapacity;
          let list = newTable[index];

          if (list === undefined) {
            list = new LinkedList<Entry<K, unknown>>();
            newTable[index] = list;
          }

          list.pushBack(entry);
        }
      }
    }
  }
}
