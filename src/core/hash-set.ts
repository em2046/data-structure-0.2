import { HashMap } from "./hash-map";

const PRESENT = {};

export class HashSet<E> implements Iterable<E> {
  #map: HashMap<E, unknown>;

  constructor(initialCapacity = 11, loadFactor = 0.75) {
    this.#map = new HashMap(initialCapacity, loadFactor);
  }

  get size(): number {
    return this.#map.size;
  }

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

  [Symbol.iterator](): IterableIterator<E> {
    return this.keys();
  }

  keys(): IterableIterator<E> {
    return this.#map.keys();
  }

  add(element: E): HashSet<E> {
    this.#map.set(element, PRESENT);

    return this;
  }

  has(element: E): boolean {
    return this.#map.has(element);
  }

  delete(element: E): boolean {
    return this.#map.delete(element);
  }

  clear(): void {
    this.#map.clear();
  }
}
