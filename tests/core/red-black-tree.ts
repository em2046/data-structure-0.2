import { RedBlackTree } from "../../src";

// Copied from
// https://github.com/rust-lang/rust/blob/fa2692990c05652c7823c8d2afae501a00a69050/library/alloc/src/collections/btree/map/tests.rs

describe("red black tree", () => {
  const VITE = true;
  const B = 6;
  const NODE_CAPACITY = 2 * B - 1;
  const MIN_INSERTS_HEIGHT_1 = NODE_CAPACITY + 1;
  const MIN_INSERTS_HEIGHT_2 = 89;
  const ITERATOR_SIZE = 200;

  test("basic large", () => {
    const map = new RedBlackTree<number, number>();
    let size = VITE ? MIN_INSERTS_HEIGHT_2 : 10000;

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
    expect([...map.values()].length).toBe(0);

    map.set(1, 1);

    expect(map.size).toBe(1);
    expect(map.get(1)).toBe(1);
    expect(map.min()).toStrictEqual([1, 1]);
    expect(map.max()).toStrictEqual([1, 1]);
    expect([...map.keys()]).toStrictEqual([1]);
    expect([...map.values()]).toStrictEqual([1]);

    map.set(1, 2);

    expect(map.size).toBe(1);
    expect(map.get(1)).toBe(2);
    expect(map.min()).toStrictEqual([1, 2]);
    expect(map.max()).toStrictEqual([1, 2]);
    expect([...map.keys()]).toStrictEqual([1]);
    expect([...map.values()]).toStrictEqual([2]);

    map.set(2, 4);

    expect(map.size).toBe(2);
    expect(map.get(2)).toBe(4);
    expect(map.min()).toStrictEqual([1, 2]);
    expect(map.max()).toStrictEqual([2, 4]);
    expect([...map.keys()]).toStrictEqual([1, 2]);
    expect([...map.values()]).toStrictEqual([2, 4]);

    expect(map.delete(1)).toBe(true);

    expect(map.size).toBe(1);
    expect(map.get(1)).toBe(undefined);
    expect(map.get(2)).toBe(4);
    expect(map.min()).toStrictEqual([2, 4]);
    expect(map.max()).toStrictEqual([2, 4]);
    expect([...map.keys()]).toStrictEqual([2]);
    expect([...map.values()]).toStrictEqual([4]);

    expect(map.delete(2)).toBe(true);

    expect(map.size).toBe(0);
    expect(map.get(1)).toBe(undefined);
    expect(map.min()).toBe(null);
    expect(map.max()).toBe(null);
    expect([...map.keys()].length).toBe(0);
    expect([...map.values()].length).toBe(0);
  });

  test("iterator", () => {
    const size = VITE ? ITERATOR_SIZE : 10000;
    const data: [number, number][] = new Array(size)
      .fill(0)
      .map((_, i) => [i, i]);
    const map = new RedBlackTree<number, number>(data);
    const iterator = map[Symbol.iterator]();

    for (let i = 0; i < size; i++) {
      expect(iterator.next().value).toStrictEqual([i, i]);
    }

    expect(iterator.next().done).toBe(true);
  });

  test("clear", () => {
    const map = new RedBlackTree<number, number>();
    const sizes = [
      MIN_INSERTS_HEIGHT_1,
      MIN_INSERTS_HEIGHT_2,
      0,
      NODE_CAPACITY,
    ];

    sizes.forEach((size) => {
      for (let i = 0; i < size; i++) {
        map.set(i, i);
      }

      expect(map.size).toBe(size);
      map.clear();
      expect(map.size).toBe(0);
    });
  });

  test("keys", () => {
    const data: [number, string][] = [
      [1, "a"],
      [2, "b"],
      [3, "c"],
    ];
    const map = new RedBlackTree<number, string>(data);
    const keys = [...map.keys()];

    expect(keys.length).toBe(3);
    expect(keys.includes(1)).toBe(true);
    expect(keys.includes(2)).toBe(true);
    expect(keys.includes(3)).toBe(true);
  });

  test("values", () => {
    const data: [number, string][] = [
      [1, "a"],
      [2, "b"],
      [3, "c"],
    ];
    const map = new RedBlackTree<number, string>(data);
    const values = [...map.values()];

    expect(values.length).toBe(3);
    expect(values.includes("a")).toBe(true);
    expect(values.includes("b")).toBe(true);
    expect(values.includes("c")).toBe(true);
  });

  test("insert remove intertwined", () => {
    const size = VITE ? 100 : 1000000;
    const map = new RedBlackTree<number, number>();
    let i = 1;
    const offset = 165;

    for (let j = 0; j < size; j++) {
      i = (i + offset) & 0xff;
      map.set(i, i);
      map.delete(0xff - i);
    }
  });
});
