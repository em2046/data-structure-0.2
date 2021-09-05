// Copied from
// https://github.com/rust-lang/rust/blob/fa2692990c05652c7823c8d2afae501a00a69050/library/alloc/src/collections/btree/set/tests.rs

import { HashSet } from "../../src";

describe("hash set", () => {
  test("clone equal", () => {
    const m = new HashSet();

    m.add(1);
    m.add(2);

    const n = HashSet.from(m);

    expect([...n]).toStrictEqual([...m]);
  });

  test("const", () => {
    const SET = new HashSet();
    const SIZE = SET.size;

    expect(SIZE).toBe(0);
  });

  test("clear", () => {
    const x = new HashSet();

    x.add(1);
    x.clear();
    expect(x.size).toBe(0);
  });

  test("from iterator", () => {
    const xs = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    const set = HashSet.from(xs);

    for (const x of xs) {
      set.has(x);
    }
  });
});
