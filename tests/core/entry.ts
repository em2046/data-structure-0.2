import { LinkedList } from "../../src";
import { Entry } from "../../src/core/entry";
import { assert } from "../../src/shared";
import { MIN_INSERTS_HEIGHT_2, VITE } from "../config";

// Copied from
// https://github.com/rust-lang/rust/blob/fa2692990c05652c7823c8d2afae501a00a69050/library/alloc/src/collections/btree/map/tests.rs

const PRESENT = {};

describe("entry", () => {
  test("basic large", () => {
    const map = new LinkedList<Entry<number, unknown>>();
    let size = VITE ? MIN_INSERTS_HEIGHT_2 : 10_000;

    // Round up to even number.
    size = size + (size % 2);

    expect(map.size).toBe(0);

    for (let i = 0; i < size; i++) {
      map.add(new Entry(i, 10 * i));
      expect(map.size).toBe(i + 1);
    }

    expect(map.front()).toStrictEqual(new Entry(0, 0));
    expect(map.back()).toStrictEqual(new Entry(size - 1, 10 * (size - 1)));
    expect(map.front()?.key).toBe(0);
    expect(map.back()?.key).toBe(size - 1);

    for (let i = 0; i < size; i++) {
      expect(map.has(new Entry(i, PRESENT))).toBe(true);
    }

    for (let i = size; i < size * 2; i++) {
      expect(map.has(new Entry(i, PRESENT))).toBe(false);
    }

    for (let i = 0; i < size; i++) {
      map.add(new Entry(i, 100 * i));
      expect(map.size).toBe(size);
    }

    for (let i = 0; i < size; i++) {
      expect(map.has(new Entry(i, PRESENT))).toBe(true);
    }

    for (let i = 0; i < size / 2; i++) {
      expect(map.delete(new Entry(i * 2, PRESENT))).toBe(true);
      expect(map.size).toBe(size - i - 1);
    }

    for (let i = 0; i < size / 2; i++) {
      expect(map.has(new Entry(2 * i, PRESENT))).toBe(false);
      expect(map.has(new Entry(2 * i + 1, PRESENT))).toBe(true);
    }

    for (let i = 0; i < size / 2; i++) {
      expect(map.delete(new Entry(2 * i, PRESENT))).toBe(false);
      expect(map.delete(new Entry(2 * i + 1, PRESENT))).toBe(true);
      expect(map.size).toBe(size / 2 - i - 1);
    }
  });

  test("basic small", () => {
    const map = new LinkedList<Entry<number, unknown>>();

    expect(map.delete(new Entry(1, PRESENT))).toBe(false);

    expect(map.size).toBe(0);
    expect(map.has(new Entry(1, PRESENT))).toBe(false);
    expect(map.front()).toBe(undefined);
    expect(map.back()).toBe(undefined);
    expect([...map.elements()].length).toBe(0);

    map.add(new Entry(1, 1));

    expect(map.size).toBe(1);
    expect(map.has(new Entry(1, PRESENT))).toBe(true);
    expect(map.front()).toStrictEqual(new Entry(1, 1));
    expect(map.back()).toStrictEqual(new Entry(1, 1));
    expect([...map.elements()]).toStrictEqual([new Entry(1, 1)]);

    map.add(new Entry(1, 2));

    expect(map.size).toBe(1);
    expect(map.has(new Entry(1, PRESENT))).toBe(true);
    expect(map.front()).toStrictEqual(new Entry(1, 2));
    expect(map.back()).toStrictEqual(new Entry(1, 2));
    expect([...map.elements()]).toStrictEqual([new Entry(1, 2)]);

    map.add(new Entry(2, 4));

    expect(map.size).toBe(2);
    expect(map.has(new Entry(2, PRESENT))).toBe(true);
    expect(map.front()).toStrictEqual(new Entry(1, 2));
    expect(map.back()).toStrictEqual(new Entry(2, 4));
    expect([...map.elements()]).toStrictEqual([
      new Entry(1, 2),
      new Entry(2, 4),
    ]);

    expect(map.delete(new Entry(1, PRESENT))).toBe(true);

    expect(map.size).toBe(1);
    expect(map.has(new Entry(1, PRESENT))).toBe(false);
    expect(map.has(new Entry(2, PRESENT))).toBe(true);
    expect(map.front()).toStrictEqual(new Entry(2, 4));
    expect(map.back()).toStrictEqual(new Entry(2, 4));
    expect([...map.elements()]).toStrictEqual([new Entry(2, 4)]);

    expect(map.delete(new Entry(2, PRESENT))).toBe(true);

    expect(map.size).toBe(0);
    expect(map.has(new Entry(1, PRESENT))).toBe(false);
    expect(map.has(new Entry(2, PRESENT))).toBe(false);
    expect(map.front()).toBe(undefined);
    expect(map.back()).toBe(undefined);
    expect([...map.elements()].length).toBe(0);

    expect(map.delete(new Entry(1, PRESENT))).toBe(false);
  });

  test("delete back small", () => {
    const map = new LinkedList<Entry<number, unknown>>();

    expect(map.delete(new Entry(1, PRESENT))).toBe(false);

    expect(map.size).toBe(0);

    map.add(new Entry(1, 1));

    {
      const back = map.back();

      assert(back !== undefined);
      expect(map.delete(back)).toBe(true);

      expect(map.size).toBe(0);
    }

    map.add(new Entry(1, 2));
    map.add(new Entry(2, 4));

    {
      const back = map.back();

      assert(back !== undefined);
      expect(map.delete(back)).toBe(true);
      expect(map.size).toBe(1);
      expect(map.has(new Entry(1, PRESENT))).toBe(true);
    }
  });
});
