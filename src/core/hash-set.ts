import { HashMap } from "./hash-map";
import { AbstractSet } from "./abstract-set";

// Copied from
// https://github.com/openjdk/jdk/blob/1fb798d320c708dfcbc0bb157511a2937fafb9e6/src/java.base/share/classes/java/util/HashSet.java

const PRESENT = {};

/**
 * @public
 *
 * The hash set lets you store unique values of any type, whether primitive
 * values or object references.
 */
export class HashSet<E> implements AbstractSet<E> {
  #map: HashMap<E, unknown>;

  /**
   * Creates a new hash set.
   *
   * @param initialCapacity - The initial capacity of the hash set.
   * @param loadFactor - The load factor of the hash set.
   */
  constructor(initialCapacity = 11, loadFactor = 0.75) {
    this.#map = new HashMap(initialCapacity, loadFactor);
  }

  /**
   * Returns the number of values in the hash set.
   */
  get size(): number {
    return this.#map.size;
  }

  /**
   * Creates a new, shallow-copied hash set instance from an iterable object.
   *
   * @param iterable - If an iterable object is passed, all of its elements
   * will be added to the hash set.
   * If you don't specify this parameter, or its value is `null`, the hash set
   * is empty.
   */
  static from<E>(iterable: Iterable<E> = []): HashSet<E> {
    let size: number;
    const arrayLike = iterable as unknown as ArrayLike<E>;

    if (typeof arrayLike.length === "number") {
      size = arrayLike.length;
    } else {
      const elements = [...iterable];

      size = elements.length;
    }

    const set = new HashSet<E>(Math.max(2 * size, 11), 0.75);

    for (const element of iterable) {
      set.add(element);
    }

    return set;
  }

  /**
   * Returns a new iterator object that yields the values for each element in
   * the hash set.
   */
  [Symbol.iterator](): IterableIterator<E> {
    return this.elements();
  }

  /**
   * Returns a new iterator object that yields the values for each element in
   * the hash set.
   */
  elements(): IterableIterator<E> {
    return this.#map.keys();
  }

  /**
   * Calls `callbackFn` once for each value present in the hash set.
   * If a `thisArg` parameter is provided, it will be used as the `this` value
   * for each invocation of `callbackFn`.
   *
   * @param callbackFn - Function to execute for each element.
   * @param thisArg - Value to use as this when executing callbackFn.
   */
  forEach(
    callbackFn: (element: E, set: HashSet<E>) => void,
    thisArg?: any
  ): void {
    for (const element of this.elements()) {
      callbackFn.call(thisArg, element, this);
    }
  }

  /**
   * Returns a boolean asserting whether an element is present with the given
   * value in the hash set or not.
   *
   * @param element - The value to test for presence in the hash set.
   */
  has(element: E): boolean {
    return this.#map.has(element);
  }

  /**
   * Appends value to the hash set. Returns the hash set with added value.
   *
   * @param element - The value of the element to add to the hash set.
   */
  add(element: E): this {
    this.#map.set(element, PRESENT);

    return this;
  }

  /**
   * Removes the element associated to the value and returns a boolean
   * asserting whether an element was successfully removed or not.
   *
   * @param element - The value to remove from the hash set.
   */
  delete(element: E): boolean {
    return this.#map.delete(element);
  }

  /**
   * Removes all elements from the hash set.
   */
  clear(): void {
    this.#map.clear();
  }
}
