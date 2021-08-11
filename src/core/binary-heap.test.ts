import { BinaryHeap } from "./binary-heap";
import { Comparable } from "./comparable";

// Copied from
// https://github.com/rust-lang/rust/blob/d488de82f30fd1dcb0220d57498638596622394e/library/alloc/tests/binary_heap.rs

describe("binary heap", () => {
  test("basic", () => {
    const binaryHeap = new BinaryHeap();
    const origin = [];
    const size = 1000;

    expect(binaryHeap.size).toBe(0);
    expect(binaryHeap.peek()).toBe(undefined);

    for (let i = 0; i < size; i++) {
      const element = Math.random();

      binaryHeap.push(element);
      origin.push(element);

      expect(binaryHeap.size).toBe(i + 1);
    }

    expect(binaryHeap.size).toBe(size);

    const result = [];

    for (let i = 0; i < size; i++) {
      const peek = binaryHeap.peek();
      const pop = binaryHeap.pop();

      result.push(pop);

      expect(peek).toBe(pop);
      expect(binaryHeap.size).toBe(size - i - 1);
    }

    origin.sort((a, b) => {
      return a - b;
    });

    expect(binaryHeap.size).toBe(0);
    expect(binaryHeap.peek()).toBe(undefined);
    expect(binaryHeap.pop()).toBe(undefined);
    expect(result).toStrictEqual(origin);
  });

  test("clear", () => {
    const binaryHeap = new BinaryHeap();
    const size = 1000;

    for (let i = 0; i < size; i++) {
      const element = Math.random();

      binaryHeap.push(element);
    }

    expect(binaryHeap.size).toBe(size);

    binaryHeap.clear();

    expect(binaryHeap.size).toBe(0);
  });

  test("mess", () => {
    const origin = [
      18, 73, 67, 64, 58, 71, 76, 5, 61, 27, 96, 95, 4, 32, 99, 72, 37, 87, 90,
      48, 70, 56, 57, 28, 74, 3, 41, 39, 59, 38, 94, 13, 35, 89, 7, 85, 81, 10,
      83, 49, 12, 97, 21, 15, 50, 65, 40, 55, 98, 86, 2, 100, 63, 75, 14, 9, 62,
      43, 69, 19, 0, 53, 80, 33, 47, 44,
    ];
    const result = [...origin].sort((a, b) => {
      return a - b;
    });
    const binaryHeap = new BinaryHeap();

    origin.forEach((element) => {
      binaryHeap.push(element);
    });

    const size = origin.length;

    for (let i = 0; i < size; i++) {
      expect(binaryHeap.pop()).toEqual(result[i]);
    }
  });

  test("iterator", () => {
    const data = [5, 9, 3];
    const iterOut = [3, 5, 9];
    const heap = BinaryHeap.from(data);
    let i = 0;

    for (const el of heap) {
      expect(el).toBe(iterOut[i]);
      i += 1;
    }
  });

  test("iter collect", () => {
    const data = [5, 9, 3];
    const iterOut = [3, 5, 9];
    const heap = BinaryHeap.from(data);

    expect([...heap]).toStrictEqual(iterOut);
  });

  test("iter sorted collect", () => {
    const data = [2, 4, 6, 2, 1, 8, 10, 3, 5, 7, 0, 9, 1];
    const iterOut = [0, 1, 1, 2, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const heap = BinaryHeap.from(data);

    expect([...heap]).toStrictEqual(iterOut);
  });

  test("peek and pop", () => {
    const data = [2, 4, 6, 2, 1, 8, 10, 3, 5, 7, 0, 9, 1];
    const sorted = [...data].sort((a, b) => {
      return a - b;
    });
    const heap = BinaryHeap.from(data);

    while (heap.size > 0) {
      expect(heap.peek()).toBe(sorted[0]);
      expect(heap.pop()).toBe(sorted.shift());
    }
  });

  test("push", () => {
    const heap = BinaryHeap.from([2, 4, 9]);

    expect(heap.size).toBe(3);
    expect(heap.peek()).toBe(2);

    heap.push(11);
    expect(heap.size).toBe(4);
    expect(heap.peek()).toBe(2);

    heap.push(5);
    expect(heap.size).toBe(5);
    expect(heap.peek()).toBe(2);

    heap.push(27);
    expect(heap.size).toBe(6);
    expect(heap.peek()).toBe(2);

    heap.push(3);
    expect(heap.size).toBe(7);
    expect(heap.peek()).toBe(2);

    heap.push(103);
    expect(heap.size).toBe(8);
    expect(heap.peek()).toBe(2);
  });

  test("push unique", () => {
    class Box<T> implements Comparable {
      value: T;

      constructor(value: T) {
        this.value = value;
      }

      equality(rhs: Box<T>): boolean {
        return rhs.value === this.value;
      }

      lessThan(rhs: Box<T>): boolean {
        return rhs.value < this.value;
      }
    }

    const heap = BinaryHeap.from([new Box(2), new Box(4), new Box(9)]);

    expect(heap.size).toBe(3);
    expect(heap.peek()?.value).toBe(9);

    heap.push(new Box(11));
    expect(heap.size).toBe(4);
    expect(heap.peek()?.value).toBe(11);

    heap.push(new Box(5));
    expect(heap.size).toBe(5);
    expect(heap.peek()?.value).toBe(11);

    heap.push(new Box(27));
    expect(heap.size).toBe(6);
    expect(heap.peek()?.value).toBe(27);

    heap.push(new Box(3));
    expect(heap.size).toBe(7);
    expect(heap.peek()?.value).toBe(27);

    heap.push(new Box(103));
    expect(heap.size).toBe(8);
    expect(heap.peek()?.value).toBe(103);
  });

  test("to vec", () => {
    function checkToVec(data: number[]) {
      const heap = BinaryHeap.from([...data]);
      const v = [...heap];

      v.sort((a, b) => a - b);
      const sorted = [...data].sort((a, b) => a - b);

      expect(v).toStrictEqual(sorted);
    }

    checkToVec([]);
    checkToVec([5]);
    checkToVec([3, 2]);
    checkToVec([2, 3]);
    checkToVec([5, 1, 2]);
    checkToVec([1, 100, 2, 3]);
    checkToVec([1, 3, 5, 7, 9, 2, 4, 6, 8, 0]);
    checkToVec([2, 4, 6, 2, 1, 8, 10, 3, 5, 7, 0, 9, 1]);
    checkToVec([9, 11, 9, 9, 9, 9, 11, 2, 3, 4, 11, 9, 0, 0, 0, 0]);
    checkToVec([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    checkToVec([10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0]);
    checkToVec([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 0, 0, 1, 2]);
    checkToVec([5, 4, 3, 2, 1, 5, 4, 3, 2, 1, 5, 4, 3, 2, 1]);
  });

  test("empty pop", () => {
    const heap = new BinaryHeap();

    expect(heap.pop()).toBe(undefined);
  });

  test("empty peek", () => {
    const heap = new BinaryHeap();

    expect(heap.peek()).toBe(undefined);
  });

  test("from iter", () => {
    const xs = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    const q = BinaryHeap.from(xs);

    for (const x of xs) {
      expect(q.pop()).toBe(x);
    }
  });
});
