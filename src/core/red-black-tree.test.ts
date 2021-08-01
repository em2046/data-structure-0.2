import { RedBlackTree } from "./red-black-tree";

describe("red black tree", () => {
  test("basic", () => {
    const origin = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    const redBlackTree = new RedBlackTree<number, number>();
    const size = origin.length;

    redBlackTree.delete(20);

    origin.forEach((element) => {
      redBlackTree.put(element, element);

      expect(redBlackTree.get(element)).toBe(element);
    });

    expect(redBlackTree.size).toBe(size);
    expect(redBlackTree.get(20)).toBe(undefined);

    redBlackTree.put(1, 1);
    redBlackTree.delete(20);

    expect(redBlackTree.size).toBe(size);

    origin.forEach((element) => {
      redBlackTree.delete(element);
    });

    expect(redBlackTree.min()).toBe(undefined);
    expect(redBlackTree.size).toBe(0);
  });

  test("change", () => {
    const redBlackTree = new RedBlackTree<number, number>();
    const len = 1000;

    for (let i = 0; i < len; i++) {
      redBlackTree.put(i, i);
    }

    expect(redBlackTree.size).toEqual(len);

    for (let i = 0; i < len; i++) {
      redBlackTree.delete(i);
    }

    expect(redBlackTree.size).toEqual(0);
  });

  test("mess", () => {
    const origin = [
      18, 73, 67, 64, 58, 71, 76, 5, 61, 27, 96, 95, 4, 32, 99, 72, 37, 87, 90,
      48, 70, 56, 57, 28, 74, 3, 41, 39, 59, 38, 94, 13, 35, 89, 7, 85, 81, 10,
      83, 49, 12, 97, 21, 15, 50, 65, 40, 55, 98, 86, 2, 100, 63, 75, 14, 9, 62,
      43, 69, 19, 0, 53, 80, 33, 47, 44,
    ];
    const redBlackTree = new RedBlackTree<number, number>();
    const len = origin.length;

    for (let i = 0; i < len; i++) {
      redBlackTree.put(origin[i], origin[i]);
    }

    expect(redBlackTree.size).toEqual(len);

    for (let i = 0; i < len; i++) {
      redBlackTree.delete(origin[i]);
    }

    expect(redBlackTree.size).toEqual(0);
  });

  test("random", () => {
    const len = 1000;
    const origin = new Array(len).fill(0).map(() => Math.random());
    const redBlackTree = new RedBlackTree<number, number>();

    for (let i = 0; i < len; i++) {
      redBlackTree.put(origin[i], origin[i]);
    }

    expect(redBlackTree.size).toEqual(len);

    for (let i = 0; i < len; i++) {
      redBlackTree.delete(origin[i]);
    }

    expect(redBlackTree.size).toEqual(0);
  });

  test("delete min", () => {
    const len = 1000;
    const origin = new Array(len).fill(0).map(() => Math.random());
    const ordered = [...origin].sort((a, b) => {
      return a - b;
    });
    const redBlackTree = new RedBlackTree<number, number>();

    for (let i = 0; i < len; i++) {
      redBlackTree.put(origin[i], origin[i]);
    }

    expect(redBlackTree.size).toEqual(len);

    for (let i = 0; i < len; i++) {
      const min = redBlackTree.min();

      expect(min).toBe(ordered[i]);

      redBlackTree.deleteMin();
    }

    expect(redBlackTree.size).toEqual(0);

    redBlackTree.deleteMin();

    expect(redBlackTree.size).toEqual(0);
  });

  test("delete max", () => {
    const len = 1000;
    const origin = new Array(len).fill(0).map(() => Math.random());
    const ordered = [...origin].sort((a, b) => {
      return b - a;
    });
    const redBlackTree = new RedBlackTree<number, number>();

    for (let i = 0; i < len; i++) {
      redBlackTree.put(origin[i], origin[i]);
    }

    expect(redBlackTree.size).toEqual(len);

    for (let i = 0; i < len; i++) {
      const max = redBlackTree.max();

      expect(max).toBe(ordered[i]);

      redBlackTree.deleteMax();
    }

    expect(redBlackTree.size).toEqual(0);

    redBlackTree.deleteMax();

    expect(redBlackTree.size).toEqual(0);
  });
});
