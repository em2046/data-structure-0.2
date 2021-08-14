import {
  Comparable,
  greaterThan,
  greaterThanOrEqual,
  lessThan,
  lessThanOrEqual,
} from "./comparable";
import { equality, Equatable, inequality } from "./equatable";

// Copied from
// https://github.com/rust-lang/rust/blob/673d0db5e393e9c64897005b470bfeb6d5aec61b/library/core/tests/cmp.rs

describe("comparable", () => {
  test("int total order", () => {
    expect(lessThan(5, 10)).toBe(true);
    expect(greaterThan(10, 5)).toBe(true);
    expect(equality(5, 5)).toBe(true);
    expect(lessThan(-5, 12)).toBe(true);
    expect(greaterThan(12, -5)).toBe(true);
  });

  test("bool total order", () => {
    expect(greaterThan(true, false)).toBe(true);
    expect(lessThan(false, true)).toBe(true);
    expect(equality(true, true)).toBe(true);
    expect(equality(false, false)).toBe(true);
  });

  test("user defined equality", () => {
    class SketchyNum implements Equatable {
      num: number;

      constructor(num: number) {
        this.num = num;
      }

      equality(rhs: SketchyNum): boolean {
        return Math.abs(this.num - rhs.num) < 5;
      }
    }

    expect(equality(new SketchyNum(37), new SketchyNum(34))).toBe(true);
    expect(inequality(new SketchyNum(25), new SketchyNum(57))).toBe(true);
  });

  test("user defined int", () => {
    class Int implements Comparable {
      value: number;

      constructor(value: number) {
        this.value = value;
      }

      equality(rhs: Int): boolean {
        return this.value === rhs.value;
      }

      lessThan(rhs: Int): boolean {
        return this.value < rhs.value;
      }
    }

    expect(greaterThan(new Int(2), new Int(1))).toBe(true);
    expect(greaterThanOrEqual(new Int(2), new Int(1))).toBe(true);
    expect(greaterThanOrEqual(new Int(1), new Int(1))).toBe(true);
    expect(lessThan(new Int(1), new Int(2))).toBe(true);
    expect(lessThanOrEqual(new Int(1), new Int(2))).toBe(true);
    expect(lessThanOrEqual(new Int(1), new Int(1))).toBe(true);
  });

  test("user defined reverse int", () => {
    class ReverseInt implements Comparable {
      value: number;

      constructor(value: number) {
        this.value = value;
      }

      equality(rhs: ReverseInt): boolean {
        return this.value === rhs.value;
      }

      lessThan(rhs: ReverseInt): boolean {
        return rhs.value < this.value;
      }
    }

    expect(lessThan(new ReverseInt(2), new ReverseInt(1))).toBe(true);
    expect(lessThanOrEqual(new ReverseInt(2), new ReverseInt(1))).toBe(true);
    expect(lessThanOrEqual(new ReverseInt(1), new ReverseInt(1))).toBe(true);
    expect(greaterThan(new ReverseInt(1), new ReverseInt(2))).toBe(true);
    expect(greaterThanOrEqual(new ReverseInt(1), new ReverseInt(2))).toBe(true);
    expect(greaterThanOrEqual(new ReverseInt(1), new ReverseInt(1))).toBe(true);
  });

  test("user defined fool", () => {
    class Fool implements Equatable {
      value: boolean;

      constructor(value: boolean) {
        this.value = value;
      }

      equality(rhs: Fool): boolean {
        return this.value !== rhs.value;
      }
    }

    expect(equality(new Fool(true), new Fool(false))).toBe(true);
    expect(inequality(new Fool(true), new Fool(true))).toBe(true);
    expect(inequality(new Fool(false), new Fool(false))).toBe(true);
    expect(equality(new Fool(false), new Fool(true))).toBe(true);
  });
});
