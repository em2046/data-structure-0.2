export interface AbstractMap<K, V> extends Iterable<[K, V]> {
  readonly size: number;

  [Symbol.iterator](): IterableIterator<[K, V]>;

  entries(): IterableIterator<[K, V]>;

  keys(): IterableIterator<K>;

  values(): IterableIterator<V>;

  forEach(
    callbackFn: (value: V, key: K, map: AbstractMap<K, V>) => void,
    thisArg?: any
  ): void;

  get(key: K): V | undefined;

  has(key: K): boolean;

  set(key: K, value: V): this;

  delete(key: K): boolean;

  clear(): void;
}
