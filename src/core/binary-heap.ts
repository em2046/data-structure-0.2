import { assert } from "../shared";
import { lessThan } from "./comparable";

// Copied from
// https://github.com/rust-lang/rust/blob/362e0f55eb1f36d279e5c4a58fb0fe5f9a2c579d/library/alloc/src/collections/binary_heap.rs
// https://github.com/facebook/react/blob/3f62dec84aba5d7ae6dfc73d68752254e8f06384/packages/scheduler/src/SchedulerMinHeap.js

/**
 * @public
 *
 * A priority queue implemented with a binary heap.
 *
 * This will be a min-heap.
 */
export class BinaryHeap<T> implements Iterable<T> {
  #elements: T[] = [];

  /**
   * Returns the size of the binary heap.
   */
  get size(): number {
    return this.#elements.length;
  }

  /**
   * Creates a new, shallow-copied binary heap instance from an array-like or
   * iterable object.
   *
   * @param arrayLike - An array-like or iterable object to convert to an
   * binary heap.
   */
  static from<T>(arrayLike: Iterable<T>): BinaryHeap<T> {
    const heap = new BinaryHeap<T>();

    for (const element of arrayLike) {
      heap.push(element);
    }

    return heap;
  }

  /**
   * Returns an iterator that iterates over the elements on this binary heap in
   * ascending order.
   */
  [Symbol.iterator](): Iterator<T> {
    const clone = BinaryHeap.from(this.#elements);

    return {
      next(): IteratorResult<T> {
        if (clone.size > 0) {
          const value = clone.pop();

          assert(value !== undefined);

          return {
            value,
            done: false,
          };
        } else {
          return {
            value: undefined,
            done: true,
          };
        }
      },
    };
  }

  /**
   * Pushes a new element onto the binary heap.
   *
   * @param newElement - The element to push to the binary heap.
   */
  push(newElement: T): BinaryHeap<T> {
    const elements = this.#elements;
    const index = elements.length;

    elements.push(newElement);
    this.#siftUp(newElement, index);

    return this;
  }

  /**
   * Returns the smallest element in the binary heap, or `undefined` if it is
   * empty.
   */
  peek(): T | undefined {
    return this.#elements[0];
  }

  /**
   * Removes the smallest element from the binary heap and returns it, or
   * `undefined` if it is empty.
   */
  pop(): T | undefined {
    const elements = this.#elements;
    const size = elements.length;

    if (size < 1) {
      return undefined;
    }

    const first = elements[0];
    const last = elements.pop();

    if (size > 1) {
      assert(last !== undefined);
      elements[0] = last;
      this.#siftDown(last, 0);
    }

    return first;
  }

  /**
   * Drops all elements from the binary heap.
   */
  clear(): void {
    this.#elements = [];
  }

  #siftUp(element: T, index: number): void {
    const elements = this.#elements;

    while (index > 0) {
      const parentIndex = Math.floor((index - 1) / 2);
      const parent = elements[parentIndex];

      if (lessThan(element, parent)) {
        // The parent is larger. Swap positions.
        elements[parentIndex] = element;
        elements[index] = parent;
        index = parentIndex;
      } else {
        // The parent is smaller. Exit.
        return;
      }
    }
  }

  #siftDown(element: T, index: number): void {
    const elements = this.#elements;
    const size = elements.length;

    while (index < size) {
      const leftIndex = index * 2 + 1;
      const left = elements[leftIndex];
      const rightIndex = leftIndex + 1;
      const right = elements[rightIndex];

      // If the left or right element is smaller, swap with the smaller of
      // those.
      if (leftIndex < size && lessThan(left, element)) {
        if (rightIndex < size && lessThan(right, left)) {
          elements[index] = right;
          elements[rightIndex] = element;
          index = rightIndex;
        } else {
          elements[index] = left;
          elements[leftIndex] = element;
          index = leftIndex;
        }
      } else if (rightIndex < size && lessThan(right, element)) {
        elements[index] = right;
        elements[rightIndex] = element;
        index = rightIndex;
      } else {
        // Neither child is smaller. Exit.
        return;
      }
    }
  }
}
