import { RedBlackTree } from "./red-black-tree";

// Copied from
// https://github.com/rust-lang/rust/blob/fa2692990c05652c7823c8d2afae501a00a69050/library/alloc/src/collections/btree/map/tests.rs

describe("red black tree", () => {
  const MIN_INSERTS_HEIGHT_2 = 89;

  test("basic", () => {
    const origin = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    const redBlackTree = new RedBlackTree<number, number>();
    const size = origin.length;
    const ret1 = redBlackTree.delete(20);

    expect(ret1).toBe(false);

    origin.forEach((element) => {
      redBlackTree.set(element, element);

      expect(redBlackTree.get(element)).toBe(element);
    });

    expect(redBlackTree.size).toBe(size);
    expect(redBlackTree.get(20)).toBe(undefined);
    expect(redBlackTree.get(-1)).toBe(undefined);

    redBlackTree.set(1, 1);

    const ret2 = redBlackTree.delete(20);

    expect(ret2).toBe(false);
    expect(redBlackTree.size).toBe(size);
    expect(redBlackTree.previous(1)?.[0]).toBe(0);
    expect(redBlackTree.previous(0)).toBe(null);
    expect(redBlackTree.next(8)?.[0]).toBe(9);
    expect(redBlackTree.next(9)).toBe(null);

    origin.forEach((element) => {
      const ret = redBlackTree.delete(element);

      expect(ret).toBe(true);
    });

    expect(redBlackTree.min()).toBe(null);
    expect(redBlackTree.max()).toBe(null);
    expect(redBlackTree.previous(1)).toBe(null);
    expect(redBlackTree.next(8)).toBe(null);
    expect(redBlackTree.size).toBe(0);
  });

  test("change", () => {
    const redBlackTree = new RedBlackTree<number, number>();
    const size = 1000;

    for (let i = 0; i < size; i++) {
      redBlackTree.set(i, i);
    }

    expect(redBlackTree.size).toBe(size);

    for (let i = 0; i < size; i++) {
      const ret = redBlackTree.delete(i);

      expect(ret).toBe(true);
    }

    expect(redBlackTree.size).toBe(0);
  });

  test("clear", () => {
    const redBlackTree = new RedBlackTree<number, number>();
    const size = 1000;

    for (let i = 0; i < size; i++) {
      const element = Math.random();

      redBlackTree.set(element, element);
    }

    expect(redBlackTree.size).toBe(size);

    redBlackTree.clear();

    expect(redBlackTree.size).toBe(0);
  });

  test("mess", () => {
    const origin = [
      18, 73, 67, 64, 58, 71, 76, 5, 61, 27, 96, 95, 4, 32, 99, 72, 37, 87, 90,
      48, 70, 56, 57, 28, 74, 3, 41, 39, 59, 38, 94, 13, 35, 89, 7, 85, 81, 10,
      83, 49, 12, 97, 21, 15, 50, 65, 40, 55, 98, 86, 2, 100, 63, 75, 14, 9, 62,
      43, 69, 19, 0, 53, 80, 33, 47, 44,
    ];
    const redBlackTree = new RedBlackTree<number, number>();
    const size = origin.length;

    for (let i = 0; i < size; i++) {
      redBlackTree.set(origin[i], origin[i]);
    }

    expect(redBlackTree.size).toBe(size);

    for (let i = 0; i < size; i++) {
      const ret = redBlackTree.delete(origin[i]);

      expect(ret).toBe(true);
    }

    expect(redBlackTree.size).toBe(0);
  });

  test("random", () => {
    const size = 1000;
    const origin = new Array(size).fill(0).map(() => Math.random());
    const redBlackTree = new RedBlackTree<number, number>();

    for (let i = 0; i < size; i++) {
      redBlackTree.set(origin[i], origin[i]);
    }

    expect(redBlackTree.size).toBe(size);

    for (let i = 0; i < size; i++) {
      const ret = redBlackTree.delete(origin[i]);

      expect(ret).toBe(true);
    }

    expect(redBlackTree.size).toBe(0);
  });

  test("delete min", () => {
    const size = 1000;
    const origin = new Array(size).fill(0).map(() => Math.random());
    const ordered = [...origin].sort((a, b) => {
      return a - b;
    });
    const redBlackTree = new RedBlackTree<number, number>();

    for (let i = 0; i < size; i++) {
      redBlackTree.set(origin[i], origin[i]);
    }

    expect(redBlackTree.size).toBe(size);

    for (let i = 0; i < size; i++) {
      const min = redBlackTree.min();

      expect(min?.[0]).toBe(ordered[i]);

      const ret = redBlackTree.deleteMin();

      expect(ret).toBe(true);
    }

    expect(redBlackTree.size).toBe(0);

    const ret = redBlackTree.deleteMin();

    expect(ret).toBe(false);
    expect(redBlackTree.size).toBe(0);
  });

  test("delete max", () => {
    const size = 1000;
    const origin = new Array(size).fill(0).map(() => Math.random());
    const ordered = [...origin].sort((a, b) => {
      return b - a;
    });
    const redBlackTree = new RedBlackTree<number, number>();

    for (let i = 0; i < size; i++) {
      redBlackTree.set(origin[i], origin[i]);
    }

    expect(redBlackTree.size).toBe(size);

    for (let i = 0; i < size; i++) {
      const max = redBlackTree.max();

      expect(max?.[0]).toBe(ordered[i]);

      const ret = redBlackTree.deleteMax();

      expect(ret).toBe(true);
    }

    expect(redBlackTree.size).toBe(0);

    const ret = redBlackTree.deleteMax();

    expect(ret).toBe(false);
    expect(redBlackTree.size).toBe(0);
  });

  test("previous", () => {
    const size = 1000;
    const origin = new Array(size).fill(0).map(() => Math.random());
    const ordered = [...origin].sort((a, b) => {
      return a - b;
    });
    const redBlackTree = new RedBlackTree<number, number>();

    for (let i = 0; i < size; i++) {
      redBlackTree.set(origin[i], origin[i]);
    }

    for (let i = 0; i < size; i++) {
      const current = ordered[i];
      const previous = ordered[i - 1];

      expect(redBlackTree.previous(current)?.[0]).toBe(previous);
    }
  });

  test("next", () => {
    const size = 1000;
    const origin = new Array(size).fill(0).map(() => Math.random());
    const ordered = [...origin].sort((a, b) => {
      return a - b;
    });
    const redBlackTree = new RedBlackTree<number, number>();

    for (let i = 0; i < size; i++) {
      redBlackTree.set(origin[i], origin[i]);
    }

    for (let i = 0; i < size; i++) {
      const current = ordered[i];
      const next = ordered[i + 1];

      expect(redBlackTree.next(current)?.[0]).toBe(next);
    }
  });

  test("basic large", () => {
    const map = new RedBlackTree<number, number>();
    let size = MIN_INSERTS_HEIGHT_2;

    size = size + (size % 2);

    expect(map.size).toBe(0);

    for (let i = 0; i < size; i++) {
      map.set(i, 10 * i);
      expect(map.size).toBe(i + 1);
    }

    expect(map.min()).toStrictEqual([0, 0]);
    expect(map.max()).toStrictEqual([size - 1, 10 * (size - 1)]);
    expect(map.min()?.[0]).toStrictEqual(0);
    expect(map.max()?.[0]).toStrictEqual(size - 1);

    for (let i = 0; i < size; i++) {
      expect(map.get(i)).toBe(i * 10);
    }

    for (let i = size; i < size * 2; i++) {
      expect(map.get(i)).toBe(undefined);
    }

    for (let i = 0; i < size; i++) {
      map.set(i, 100 * i);
      expect(map.size).toBe(size);
    }

    for (let i = 0; i < size; i++) {
      expect(map.get(i)).toBe(i * 100);
    }

    for (let i = 0; i < size / 2; i++) {
      expect(map.delete(i * 2)).toBe(true);
      expect(map.size).toBe(size - i - 1);
    }

    for (let i = 0; i < size / 2; i++) {
      expect(map.get(2 * i)).toBe(undefined);
      expect(map.get(2 * i + 1)).toBe(i * 200 + 100);
    }

    for (let i = 0; i < size / 2; i++) {
      expect(map.delete(2 * i)).toBe(false);
      expect(map.delete(2 * i + 1)).toBe(true);
      expect(map.size).toBe(size / 2 - i - 1);
    }
  });

  test("basic small", () => {
    const map = new RedBlackTree<number, number>();

    expect(map.delete(1)).toBe(false);
    expect(map.size).toBe(0);
    expect(map.get(1)).toBe(undefined);
    expect(map.min()).toBe(null);
    expect(map.max()).toBe(null);
    expect([...map.keys()].length).toBe(0);
  });
});
