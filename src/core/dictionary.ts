export interface Dictionary<K, V> extends Iterable<[K, V]> {
  readonly size: number;

  [Symbol.iterator](): IterableIterator<[K, V]>;

  clear(): void;

  delete(key: K): boolean;

  entries(): IterableIterator<[K, V]>;

  forEach(
    callbackFn: (value: V, key: K, map: Dictionary<K, V>) => void,
    thisArg?: any
  ): void;

  get(key: K): V | undefined;

  has(key: K): boolean;

  keys(): IterableIterator<K>;

  set(key: K, value: V): this;

  values(): IterableIterator<V>;
}
