/**
 * @public
 *
 * The map holds key-value pairs.
 * Any value (both objects and primitive values) may be used as either a key or
 * a value.
 */
export interface AbstractMap<K, V> extends Iterable<[K, V]> {
  /**
   * Returns the number of key/value pairs in the map.
   */
  readonly size: number;

  /**
   * Returns a new iterator object that contains **an array of `[key, value]`**
   * for each element in the map.
   */
  [Symbol.iterator](): IterableIterator<[K, V]>;

  /**
   * Returns a new iterator object that contains **an array of `[key, value]`**
   * for each element in the map.
   */
  entries(): IterableIterator<[K, V]>;

  /**
   * Returns a new iterator object that contains the **keys** for each element
   * in the map.
   */
  keys(): IterableIterator<K>;

  /**
   * Returns a new iterator object that contains the **values** for each
   * element in the map.
   */
  values(): IterableIterator<V>;

  /**
   * Calls `callback` once for each key-value pair present in the map.
   * If a `thisArg` parameter is provided to `forEach`, it will be used as the
   * `this` value for each callback.
   *
   * @param callback - Function to execute for each entry in the map.
   * @param thisArg - Value to use as `this` when executing `callback`.
   */
  forEach(
    callback: (value: V, key: K, map: AbstractMap<K, V>) => void,
    thisArg?: any
  ): void;

  /**
   * Returns the value associated to the `key`, or `undefined` if there is
   * none.
   *
   * @param key - The key of the element to return from the map.
   */
  get(key: K): V | undefined;

  /**
   * Returns a boolean asserting whether a value has been associated to the
   * `key` in the map or not.
   *
   * @param key - The key of the element to test for presence in the map.
   */
  has(key: K): boolean;

  /**
   * Sets the `value` for the `key` in the map. Returns the map.
   *
   * @param key - The key of the element to add to the map.
   * @param value - The value of the element to add to the map.
   */
  set(key: K, value: V): this;

  /**
   * Returns `true` if an element in the map existed and has been removed,
   * or `false` if the element does not exist.
   *
   * @param key - The key of the element to remove from the map.
   */
  delete(key: K): boolean;

  /**
   * Removes all key-value pairs from the map.
   */
  clear(): void;
}
