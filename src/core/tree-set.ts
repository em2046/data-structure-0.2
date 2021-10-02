import { AbstractSet } from "./abstract-set";
import { RedBlackTree } from "./red-black-tree";

const PRESENT = {};

/**
 * @public
 *
 * The tree set lets you store unique values of any type, whether primitive
 * values or object references.
 */
export class TreeSet<E> implements AbstractSet<E> {
  #map: RedBlackTree<E, unknown>;

  /**
   * Creates a new tree set.
   */
  constructor() {
    this.#map = new RedBlackTree<E, unknown>();
  }

  /**
   * Returns the number of values in the tree set.
   */
  get size(): number {
    return this.#map.size;
  }

  /**
   * Creates a new, shallow-copied tree set instance from an iterable object.
   *
   * @param iterable - If an iterable object is passed, all of its elements
   * will be added to the tree set.
   * If you don't specify this parameter, or its value is `null`, the tree set
   * is empty.
   */
  static from<E>(iterable: Iterable<E>): TreeSet<E> {
    const set = new TreeSet<E>();

    for (const element of iterable) {
      set.add(element);
    }

    return set;
  }

  /**
   * Returns a new iterator object that yields the `values` for each element in
   * the tree set.
   */
  [Symbol.iterator](): IterableIterator<E> {
    return this.elements();
  }

  /**
   * Returns a new iterator object that yields the `values` for each element in
   * the tree set.
   */
  elements(): IterableIterator<E> {
    return this.#map.keys();
  }

  /**
   * Calls `callback` once for each value present in the tree set.
   * If a `thisArg` parameter is provided, it will be used as the `this` value
   * for each invocation of `callback`.
   *
   * @param callback - Function to execute for each element.
   * @param thisArg - Value to use as `this` when executing `callback`.
   */
  forEach(
    callback: (element: E, set: TreeSet<E>) => void,
    thisArg?: any
  ): void {
    for (const element of this.elements()) {
      callback.call(thisArg, element, this);
    }
  }

  /**
   * Returns a boolean asserting whether an element is present with the given
   * value in the tree set or not.
   *
   * @param element - The value to test for presence in the tree set.
   */
  has(element: E): boolean {
    return this.#map.has(element);
  }

  /**
   * Appends `value` to the tree set. Returns the tree set with added value.
   *
   * @param element - The value of the element to add to the tree set.
   */
  add(element: E): this {
    this.#map.set(element, PRESENT);

    return this;
  }

  /**
   * Removes the element associated to the `value` and returns a boolean
   * asserting whether an element was successfully removed or not.
   *
   * @param element - The value to remove from the tree set.
   */
  delete(element: E): boolean {
    return this.#map.delete(element);
  }

  /**
   * Removes all elements from the tree set.
   */
  clear(): void {
    this.#map.clear();
  }
}
