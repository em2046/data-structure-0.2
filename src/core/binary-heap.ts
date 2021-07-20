import { assert } from "../shared";
import { lessThan } from "./comparable";

export class BinaryHeap<T> {
  #elements: T[] = [];

  push(element: T): void {
    const elements = this.#elements;
    const length = elements.length;

    elements.push(element);
    this.siftUp(length);
  }

  peek(): T | undefined {
    return this.#elements[0];
  }

  pop(): T | undefined {
    const elements = this.#elements;
    const first = elements[0];

    if (elements.length <= 1) {
      return first;
    }

    const last = elements.pop();

    assert(last !== undefined);
    elements[0] = last;
    this.siftDown(0);

    return first;
  }

  siftUp(index: number): void {
    const elements = this.#elements;

    while (index > 0) {
      const parentIndex = Math.floor((index - 1) / 2);

      if (lessThan(elements[index], elements[parentIndex])) {
        [elements[index], elements[parentIndex]] = [
          elements[parentIndex],
          elements[index],
        ];
        index = parentIndex;
      } else {
        break;
      }
    }
  }

  siftDown(index: number): void {
    const elements = this.#elements;
    const length = elements.length;

    while (index < length) {
      const leftIndex = index * 2 + 1;
      const rightIndex = leftIndex + 1;

      if (
        leftIndex < length &&
        lessThan(elements[leftIndex], elements[index])
      ) {
        if (
          rightIndex < length &&
          lessThan(elements[rightIndex], elements[leftIndex])
        ) {
          [elements[rightIndex], elements[index]] = [
            elements[index],
            elements[rightIndex],
          ];
          index = rightIndex;
        } else {
          [elements[leftIndex], elements[index]] = [
            elements[index],
            elements[leftIndex],
          ];
          index = leftIndex;
        }
      } else if (
        rightIndex < length &&
        lessThan(elements[rightIndex], elements[index])
      ) {
        [elements[rightIndex], elements[index]] = [
          elements[index],
          elements[rightIndex],
        ];
        index = rightIndex;
      } else {
        break;
      }
    }
  }
}
