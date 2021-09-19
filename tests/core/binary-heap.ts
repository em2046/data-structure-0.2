import { BinaryHeap, Comparable } from "../../src";

// Copied from
// https://github.com/rust-lang/rust/blob/d488de82f30fd1dcb0220d57498638596622394e/library/alloc/tests/binary_heap.rs

describe("binary heap", () => {
  test("iterator", () => {
    const data = [5, 9, 3];
    const out = [3, 5, 9];
    const heap = BinaryHeap.from(data);
    let i = 0;

    for (const element of heap) {
      expect(element).toBe(out[i]);
      i += 1;
    }
  });

  test("iterator collect", () => {
    const data = [5, 9, 3];
    const out = [3, 5, 9];
    const heap = BinaryHeap.from(data);
    const vector = [...heap];

    expect(vector).toStrictEqual(out);
  });

  test("iterator sorted collect", () => {
    const data = [2, 4, 6, 2, 1, 8, 10, 3, 5, 7, 0, 9, 1];
    const out = [0, 1, 1, 2, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const heap = BinaryHeap.from(data);
    const sorted = [...heap];

    expect(sorted).toStrictEqual(out);
  });

  test("symbol iterator next", () => {
    const data = [2, 4, 6, 2, 1, 8, 10, 3, 5, 7, 0, 9, 1];
    const out = [0, 1, 1, 2, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const heap = BinaryHeap.from(data);
    const iterator = heap.elements();

    for (const value of out) {
      expect(iterator.next().value).toBe(value);
    }

    expect(iterator.next().done).toBe(true);
  });

  test("symbol iterator collect", () => {
    const data = [2, 4, 6, 2, 1, 8, 10, 3, 5, 7, 0, 9, 1];
    const out = [0, 1, 1, 2, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const heap = BinaryHeap.from(data);
    const iterator = heap.elements();

    expect([...iterator]).toStrictEqual(out);
  });

  test("peek and pop", () => {
    const data = [2, 4, 6, 2, 1, 8, 10, 3, 5, 7, 0, 9, 1];
    const sorted = [...data].sort((a, b) => a - b);
    const heap = BinaryHeap.from(data);

    while (heap.size > 0) {
      expect(heap.peek()).toBe(sorted[0]);
      expect(heap.pop()).toBe(sorted.shift());
    }
  });

  test("push", () => {
    const heap = BinaryHeap.from([-2, -4, -9]);

    expect(heap.size).toBe(3);
    expect(heap.peek()).toBe(-9);

    heap.push(-11);
    expect(heap.size).toBe(4);
    expect(heap.peek()).toBe(-11);

    heap.push(-5);
    expect(heap.size).toBe(5);
    expect(heap.peek()).toBe(-11);

    heap.push(-27);
    expect(heap.size).toBe(6);
    expect(heap.peek()).toBe(-27);

    heap.push(-3);
    expect(heap.size).toBe(7);
    expect(heap.peek()).toBe(-27);

    heap.push(-103);
    expect(heap.size).toBe(8);
    expect(heap.peek()).toBe(-103);
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

  test("to vector", () => {
    function checkToVector(data: number[]) {
      const heap = BinaryHeap.from(data);
      const vector = [...heap].sort((a, b) => a - b);
      const sorted = [...data].sort((a, b) => a - b);

      expect(vector).toStrictEqual(sorted);
      expect([...heap]).toStrictEqual(sorted);
    }

    checkToVector([]);
    checkToVector([5]);
    checkToVector([3, 2]);
    checkToVector([2, 3]);
    checkToVector([5, 1, 2]);
    checkToVector([1, 100, 2, 3]);
    checkToVector([1, 3, 5, 7, 9, 2, 4, 6, 8, 0]);
    checkToVector([2, 4, 6, 2, 1, 8, 10, 3, 5, 7, 0, 9, 1]);
    checkToVector([9, 11, 9, 9, 9, 9, 11, 2, 3, 4, 11, 9, 0, 0, 0, 0]);
    checkToVector([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    checkToVector([10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0]);
    checkToVector([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 0, 0, 1, 2]);
    checkToVector([5, 4, 3, 2, 1, 5, 4, 3, 2, 1, 5, 4, 3, 2, 1]);
  });

  test("empty pop", () => {
    const heap = new BinaryHeap();

    expect(heap.pop()).toBe(undefined);
  });

  test("empty peek", () => {
    const heap = new BinaryHeap();

    expect(heap.peek()).toBe(undefined);
  });

  test("from iterator", () => {
    const data = [9, 8, 7, 6, 5, 4, 3, 2, 1];
    const out = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    const heap = BinaryHeap.from(data);

    for (const element of out) {
      expect(heap.pop()).toBe(element);
    }
  });

  test("clear", () => {
    const data = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    const heap = BinaryHeap.from(data);

    heap.clear();

    expect(heap.size).toBe(0);
  });
});
