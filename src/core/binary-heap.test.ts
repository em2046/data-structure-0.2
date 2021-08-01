import { BinaryHeap } from "./binary-heap";

describe("binary-heap", () => {
  test("basic", () => {
    const binaryHeap = new BinaryHeap();
    const origin = [];
    const length = 1000;

    expect(binaryHeap.length).toBe(0);
    expect(binaryHeap.peek()).toBe(undefined);

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

    const length = origin.length;

    for (let i = 0; i < length; i++) {
      expect(binaryHeap.pop()).toEqual(result[i]);
    }
  });
});
