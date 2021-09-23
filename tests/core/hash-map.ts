import {
  MIN_INSERTS_HEIGHT_1,
  MIN_INSERTS_HEIGHT_2,
  NODE_CAPACITY,
  VITE,
} from "../config";
import { HashMap } from "../../src";

// Copied from
// https://github.com/rust-lang/rust/blob/fa2692990c05652c7823c8d2afae501a00a69050/library/alloc/src/collections/btree/map/tests.rs

describe("hash map", () => {
  test("basic large", () => {
    const map = new HashMap<number, number>();
    let size = VITE ? MIN_INSERTS_HEIGHT_2 : 10_000;

    // Round up to even number.
    size = size + (size % 2);

    expect(map.size).toBe(0);

    for (let i = 0; i < size; i++) {
      map.set(i, 10 * i);
      expect(map.size).toBe(i + 1);
    }

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
    const map = new HashMap<number, number>();

    expect(map.delete(1)).toBe(false);

    expect(map.size).toBe(0);
    expect(map.get(1)).toBe(undefined);
    expect([...map.keys()].length).toBe(0);
    expect([...map.values()].length).toBe(0);

    map.set(1, 1);

    expect(map.size).toBe(1);
    expect(map.get(1)).toBe(1);
    expect([...map.keys()]).toStrictEqual([1]);
    expect([...map.values()]).toStrictEqual([1]);

    map.set(1, 2);

    expect(map.size).toBe(1);
    expect(map.get(1)).toBe(2);
    expect([...map.keys()]).toStrictEqual([1]);
    expect([...map.values()]).toStrictEqual([2]);

    map.set(2, 4);

    expect(map.size).toBe(2);
    expect(map.get(2)).toBe(4);
    expect([...map.keys()]).toStrictEqual([1, 2]);
    expect([...map.values()]).toStrictEqual([2, 4]);

    expect(map.delete(1)).toBe(true);

    expect(map.size).toBe(1);
    expect(map.get(1)).toBe(undefined);
    expect(map.get(2)).toBe(4);
    expect([...map.keys()]).toStrictEqual([2]);
    expect([...map.values()]).toStrictEqual([4]);

    expect(map.delete(2)).toBe(true);

    expect(map.size).toBe(0);
    expect(map.get(1)).toBe(undefined);
    expect(map.get(2)).toBe(undefined);
    expect([...map.keys()].length).toBe(0);
    expect([...map.values()].length).toBe(0);

    expect(map.delete(1)).toBe(false);
  });

  test("entries iterator next", () => {
    const size = VITE ? 200 : 10_000;
    const data: [number, number][] = new Array(size)
      .fill(0)
      .map((_, i) => [i, i]);
    const map = HashMap.from(data);
    const entries = map.entries();
    const sorted = [...entries].sort((a, b) => {
      return a[0] - b[0];
    });
    const iterator = sorted.values();

    for (let i = 0; i < sorted.length; i++) {
      const value = iterator.next().value;

      expect(value).toStrictEqual([i, i]);
    }

    expect(iterator.next().done).toBe(true);
  });

  test("entries iterator collect", () => {
    const size = VITE ? 200 : 10_000;
    const data: [number, number][] = new Array(size)
      .fill(0)
      .map((_, i) => [i, i]);
    const map = HashMap.from(data);
    const sorted = [...map].sort((a, b) => {
      return a[0] - b[0];
    });

    expect(sorted).toStrictEqual(data);
  });

  test("clear", () => {
    const map = new HashMap<number, number>();
    const sizes = [
      MIN_INSERTS_HEIGHT_1,
      MIN_INSERTS_HEIGHT_2,
      0,
      NODE_CAPACITY,
    ];

    for (const size of sizes) {
      for (let i = 0; i < size; i++) {
        map.set(i, i);
      }

      expect(map.size).toBe(size);
      map.clear();
      expect(map.size).toBe(0);
    }
  });

  test("keys", () => {
    const data: [number, string][] = [
      [1, "a"],
      [2, "b"],
      [3, "c"],
    ];
    const map = HashMap.from<number, string>(data);
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
    const map = HashMap.from<number, string>(data);
    const values = [...map.values()];

    expect(values.length).toBe(3);
    expect(values.includes("a")).toBe(true);
    expect(values.includes("b")).toBe(true);
    expect(values.includes("c")).toBe(true);
  });

  test("insert remove intertwined", () => {
    const size = VITE ? 100 : 1_000_000;
    const map = new HashMap<number, number>();
    let i = 1;
    const offset = 165;

    for (let j = 0; j < size; j++) {
      i = (i + offset) & 0xff;
      map.set(i, i);
      map.delete(0xff - i);
    }
  });

  test("init", () => {
    expect(() => {
      new HashMap(-1);
    }).toThrowError();

    expect(() => {
      new HashMap(undefined, 0);
    }).toThrowError();

    expect(() => {
      const map = new HashMap();

      map.set(0, undefined);
    }).toThrowError();

    new HashMap(0);

    const size = VITE ? 200 : 10_000;
    const data: [number, number][] = new Array(size)
      .fill(0)
      .map((_, i) => [i, i]);

    HashMap.from(data.values());
  });

  test("for each", () => {
    const data: [number, string][] = [
      [1, "a"],
      [2, "b"],
      [3, "c"],
    ];
    const map = HashMap.from(data);

    map.forEach((value, key) => {
      const find = data.find((item) => {
        return item[0] === key && item[1] === value;
      });

      expect(find).not.toBe(undefined);
    });
  });
});
