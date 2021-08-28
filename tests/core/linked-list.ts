import { LinkedList } from "../../src/core/linked-list";
import { VITE } from "../config";

// Copied from
// https://github.com/rust-lang/rust/blob/2b4196e97736ffe75433235bf586989cdb4221c4/library/alloc/src/collections/linked_list/tests.rs

describe("linked list", () => {
  test("append empty to empty", () => {
    const m = new LinkedList<number>();
    const n = new LinkedList<number>();

    m.append(n);

    expect(m.size).toBe(0);
    expect(n.size).toBe(0);
  });

  test("append non-empty to empty", () => {
    const m = new LinkedList<number>();
    const n = new LinkedList<number>();

    n.pushBack(2);
    m.append(n);

    expect(m.size).toBe(1);
    expect(m.popBack()).toBe(2);
    expect(n.size).toBe(0);
  });

  test("append empty to non-empty", () => {
    const m = new LinkedList<number>();
    const n = new LinkedList<number>();

    m.pushBack(2);
    m.append(n);

    expect(m.size).toBe(1);
    expect(m.popBack()).toBe(2);
  });

  test("append non-empty to non-empty", () => {
    const v = [1, 2, 3, 4, 5];
    const u = [9, 8, 1, 2, 3, 4, 5];
    const m = LinkedList.from(v);
    const n = LinkedList.from(u);
    const sum = [...v, ...u];

    m.append(n);

    expect(m.size).toBe(sum.length);

    for (const element of sum) {
      expect(m.popFront()).toBe(element);
    }

    expect(n.size).toBe(0);

    n.pushBack(3);

    expect(n.size).toBe(1);
    expect(n.popFront()).toBe(3);
  });

  test("fuzz", () => {
    function fuzzTest(size: number) {
      const m = new LinkedList<number>();
      const v = [];
      let popBack: number | undefined;
      let pop: number | undefined;
      let popFront: number | undefined;
      let shift: number | undefined;
      let back: number | undefined;
      let front: number | undefined;

      for (let i = 0; i < size; i++) {
        const r = Math.floor(Math.random() * 6);

        switch (r) {
          case 0:
            back = m.back();

            expect(back).toBe(v[v.length - 1]);

            popBack = m.popBack();
            pop = v.pop();

            expect(popBack).toBe(pop);

            break;
          case 1:
            front = m.front();

            expect(front).toBe(v[0]);

            popFront = m.popFront();
            shift = v.shift();

            expect(popFront).toBe(shift);

            break;
          case 2:
          case 4:
            m.pushFront(-i);
            v.unshift(-i);
            break;
          case 3:
          case 5:
            m.pushBack(i);
            v.push(i);
            break;
        }
      }

      const iterator = [...m];

      for (let i = 0; i < iterator.length; i++) {
        const a = iterator[i];
        const b = v[i];

        expect(a).toBe(b);
      }

      expect(iterator.length).toBe(v.length);
    }

    for (let i = 0; i < 25; i++) {
      fuzzTest(3);
      fuzzTest(16);

      if (!VITE) {
        fuzzTest(189);
      }
    }
  });

  test("clear", () => {
    const data = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    const list = LinkedList.from(data);

    list.clear();

    expect(list.size).toBe(0);
  });

  test("symbol iterator collect", () => {
    const data = [2, 4, 6, 2, 1, 8, 10, 3, 5, 7, 0, 9, 1];
    const out = [...data];
    const heap = LinkedList.from(data);
    const iterator = heap[Symbol.iterator]();

    expect([...iterator]).toStrictEqual(out);
  });
});
