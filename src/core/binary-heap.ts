import { lessThan } from "./comparable";

export class BinaryHeap<T> {
  elements: T[] = [];

  peek(): T | undefined {
    return this.elements[0];
  }

  pop(): T | undefined {
    if (this.elements.length <= 0) {
      return undefined;
    }

    const first = this.elements[0];
    const last = this.elements.pop();

    this.elements[0] = last;
    this.siftDown(0);

    return first;
  }

  push(element: T): void {
    const length = this.elements.length;

    this.elements.push(element);
    this.siftUp(length);
  }

  siftUp(index: number): void {
    while (index > 0) {
      const parentIndex = Math.floor((index - 1) / 2);

      if (lessThan(this.elements[index], this.elements[parentIndex])) {
        [this.elements[index], this.elements[parentIndex]] = [
          this.elements[parentIndex],
          this.elements[index],
        ];
        index = parentIndex;
      } else {
        break;
      }
    }
  }

  siftDown(index: number): void {
    const length = this.elements.length;

    while (true) {
      const leftIndex = index * 2 + 1;
      const rightIndex = index * 2 + 2;

      if (rightIndex < length) {
        if (lessThan(this.elements[leftIndex], this.elements[rightIndex])) {
          if (lessThan(this.elements[leftIndex], this.elements[index])) {
            [this.elements[leftIndex], this.elements[index]] = [
              this.elements[index],
              this.elements[leftIndex],
            ];
            index = leftIndex;
          } else {
            break;
          }
        } else {
          if (lessThan(this.elements[rightIndex], this.elements[index])) {
            [this.elements[rightIndex], this.elements[index]] = [
              this.elements[index],
              this.elements[rightIndex],
            ];
            index = rightIndex;
          } else {
            break;
          }
        }
      } else if (leftIndex < length) {
        if (lessThan(this.elements[leftIndex], this.elements[index])) {
          [this.elements[leftIndex], this.elements[index]] = [
            this.elements[index],
            this.elements[leftIndex],
          ];
          index = leftIndex;
        } else {
          break;
        }
      } else {
        break;
      }
    }
  }
}
