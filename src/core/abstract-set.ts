/**
 * @public
 *
 * The set lets you store unique values of any type, whether primitive
 * values or object references.
 */
export interface AbstractSet<E> extends Iterable<E> {
  /**
   * Returns the number of values in the set.
   */
  readonly size: number;

  /**
   * Returns a new iterator object that yields the values for each element in
   * the set.
   */
  [Symbol.iterator](): IterableIterator<E>;

  /**
   * Returns a new iterator object that yields the values for each element in
   * the set.
   */
  elements(): IterableIterator<E>;

  /**
   * Calls `callbackFn` once for each value present in the set.
   * If a `thisArg` parameter is provided, it will be used as the `this` value
   * for each invocation of `callbackFn`.
   *
   * @param callbackFn - Function to execute for each element.
   * @param thisArg - Value to use as this when executing callbackFn.
   */
  forEach(
    callbackFn: (element: E, set: AbstractSet<E>) => void,
    thisArg?: any
  ): void;

  /**
   * Returns a boolean asserting whether an element is present with the given
   * value in the set or not.
   *
   * @param element - The value to test for presence in the set.
   */
  has(element: E): boolean;

  /**
   * Appends value to the set. Returns the set with added value.
   *
   * @param element - The value of the element to add to the set.
   */
  add(element: E): this;

  /**
   * Removes the element associated to the value and returns a boolean
   * asserting whether an element was successfully removed or not.
   *
   * @param element - The value to remove from the set.
   */
  delete(element: E): boolean;

  /**
   * Removes all elements from the set.
   */
  clear(): void;
}
