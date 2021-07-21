import { BinaryHeap } from "./binary-heap";

describe("binary-heap", () => {
  test("basic", () => {
    const binaryHeap = new BinaryHeap();
    const origin = [];
    const length = 1000;

    expect(binaryHeap.length).toBe(0);

    for (let i = 0; i < length; i++) {
      const element = Math.random();

      binaryHeap.push(element);
      origin.push(element);

      expect(binaryHeap.length).toBe(i + 1);
    }

    expect(binaryHeap.length).toBe(length);

    const result = [];

    for (let i = 0; i < length; i++) {
      const peek = binaryHeap.peek();
      const pop = binaryHeap.pop();

      result.push(pop);

      expect(peek).toBe(pop);
      expect(binaryHeap.length).toBe(length - i - 1);
    }

    origin.sort((a, b) => {
      return a - b;
    });

    expect(binaryHeap.length).toBe(0);
    expect(binaryHeap.peek()).toBe(undefined);
    expect(binaryHeap.pop()).toBe(undefined);
    expect(result).toStrictEqual(origin);
  });

  test("clear", () => {
    const binaryHeap = new BinaryHeap();
    const length = 1000;

    for (let i = 0; i < length; i++) {
      const element = Math.random();

      binaryHeap.push(element);
    }

    expect(binaryHeap.length).toBe(length);

    binaryHeap.clear();

    expect(binaryHeap.length).toBe(0);
  });
});
