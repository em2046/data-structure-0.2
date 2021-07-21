import { BinaryHeap } from "./binary-heap";

describe("binary-heap", () => {
  test("basic", () => {
    const binaryHeap = new BinaryHeap();
    const origin = [];
    const length = 1000;

    expect(binaryHeap.length).toEqual(0);

    for (let i = 0; i < length; i++) {
      const element = Math.random();

      binaryHeap.push(element);
      origin.push(element);

      expect(binaryHeap.length).toEqual(i + 1);
    }

    expect(binaryHeap.length).toEqual(length);

    const result = [];

    for (let i = 0; i < length; i++) {
      const peek = binaryHeap.peek();
      const pop = binaryHeap.pop();

      result.push(pop);

      expect(peek).toEqual(pop);
      expect(binaryHeap.length).toEqual(length - i - 1);
    }

    origin.sort((a, b) => {
      return a - b;
    });

    expect(binaryHeap.length).toEqual(0);
    expect(result).toEqual(origin);
  });

  test("clear", () => {
    const binaryHeap = new BinaryHeap();
    const length = 1000;

    for (let i = 0; i < length; i++) {
      const element = Math.random();

      binaryHeap.push(element);
    }

    expect(binaryHeap.length).toEqual(length);

    binaryHeap.clear();

    expect(binaryHeap.length).toEqual(0);
  });
});
