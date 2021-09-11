export interface AbstractSet<E> extends Iterable<E> {
  readonly size: number;

  [Symbol.iterator](): IterableIterator<E>;

  elements(): IterableIterator<E>;

  forEach(
    callbackFn: (element: E, set: AbstractSet<E>) => void,
    thisArg?: any
  ): void;

  has(element: E): boolean;

  add(element: E): this;

  delete(element: E): boolean;

  clear(): void;
}
