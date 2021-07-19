import { BinaryHeap } from "./binary-heap";

describe("binary-heap", () => {
  test("basic", () => {
    const binaryHeap = new BinaryHeap();
    const origin = [];
    const length = 1000;

    for (let i = 0; i < length; i++) {
      const element = Math.random();

      binaryHeap.push(element);
      origin.push(element);
    }

    const result = [];

    for (let i = 0; i < length; i++) {
      result.push(binaryHeap.pop());
    }

    origin.sort((a, b) => {
      return a - b;
    });

    expect(result).toEqual(origin);
  });
});
