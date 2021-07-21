/***
 * https://github.com/facebook/react/blob/3f62dec84aba5d7ae6dfc73d68752254e8f06384/packages/scheduler/src/SchedulerMinHeap.js
 */

import { assert } from "../shared";
import { lessThan } from "./comparable";

/**
 * @public
 *
 * A priority queue implemented with a binary heap.
 *
 * This will be a min-heap.
 */
export class BinaryHeap<T> {
  #elements: T[] = [];

  /**
   * Pushes a new element onto the binary heap.
   *
   * @param newElement - The element to push to the binary heap.
   */
  push(newElement: T): void {
    const elements = this.#elements;
    const index = elements.length;

    elements.push(newElement);
    this.#siftUp(newElement, index);
  }

  /**
   * Returns the least element in the binary heap, or `undefined` if it is
   * empty.
   */
  peek(): T | undefined {
    return this.#elements[0];
  }

  /**
   * Removes the least element from the binary heap and returns it, or
   * `undefined` if it is empty.
   */
  pop(): T | undefined {
    const elements = this.#elements;
    const length = elements.length;

    if (length < 1) {
      return undefined;
    }

    const first = elements[0];
    const last = elements.pop();

    if (length > 1) {
      assert(last !== undefined);
      elements[0] = last;
      this.#siftDown(last, 0);
    }

    return first;
  }

  /**
   * Returns the length of the binary heap.
   */
  get length(): number {
    return this.#elements.length;
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
        // The parent is larger. Swap position.
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
    const length = elements.length;

    while (index < length) {
      const leftIndex = index * 2 + 1;
      const left = elements[leftIndex];
      const rightIndex = leftIndex + 1;
      const right = elements[rightIndex];

      // If the left or right element is smaller, swap with the smaller of
      // those.
      if (leftIndex < length && lessThan(left, element)) {
        if (rightIndex < length && lessThan(right, left)) {
          elements[index] = right;
          elements[rightIndex] = element;
          index = rightIndex;
        } else {
          elements[index] = left;
          elements[leftIndex] = element;
          index = leftIndex;
        }
      } else if (rightIndex < length && lessThan(right, element)) {
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
