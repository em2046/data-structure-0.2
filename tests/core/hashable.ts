import { Hashable, Hasher, HashSet } from "../../src";

// Copied from
// https://github.com/apple/swift/blob/3616872c286685f60a462bcc3eb993930313ff70/stdlib/public/core/Hashable.swift

describe("hashable", () => {
  test("basic", () => {
    class GridPoint implements Hashable {
      x: number;
      y: number;

      constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
      }

      equality(rhs: GridPoint): boolean {
        return this.x === rhs.x && this.y === rhs.y;
      }

      hash(hasher: Hasher): void {
        hasher.combine(this.x);
        hasher.combine(this.y);
      }
    }

    const tappedPoints = HashSet.from([
      new GridPoint(2, 3),
      new GridPoint(4, 1),
    ]);

    expect(tappedPoints.has(new GridPoint(0, 1))).toBe(false);
    expect(tappedPoints.has(new GridPoint(2, 3))).toBe(true);
    expect(tappedPoints.has(new GridPoint(4, 1))).toBe(true);
    expect(tappedPoints.has(new GridPoint(3, 2))).toBe(false);
    expect(tappedPoints.has(new GridPoint(1, 4))).toBe(false);
  });

  test("hash value", () => {
    class Point implements Hashable {
      x: number;
      y: number;
      hashValue: number;

      constructor(x = 0, y = 0, hashValue: number) {
        this.x = x;
        this.y = y;
        this.hashValue = hashValue;
      }

      equality(rhs: Point): boolean {
        return this.x === rhs.x && this.y === rhs.y;
      }

      hash(hasher: Hasher): void {
        hasher.combine(this.hashValue);
      }
    }

    const a = new Point(2, 3, 65);
    const b = new Point(4, 1, 125);
    const c = new Point(0, 1, 1);
    const d = new Point(3, 2, 95);
    const e = new Point(1, 4, 35);
    const set = HashSet.from([a, b]);

    expect(set.has(a)).toBe(true);
    expect(set.has(b)).toBe(true);
    expect(set.has(c)).toBe(false);
    expect(set.has(d)).toBe(false);
    expect(set.has(e)).toBe(false);
  });
});
