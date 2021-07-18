import { Comparable, lessThan } from "./comparable";

class Point implements Comparable {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  equality(rhs: Point): boolean {
    return this.x === rhs.x && this.y === rhs.y;
  }

  lessThan(rhs: Point): boolean {
    if (this.x === rhs.x) {
      return this.y < rhs.y;
    }

    return this.x < rhs.x;
  }
}

describe("comparable", () => {
  test("basic", () => {
    let a = new Point(1, 2);
    let b = new Point(1, 3);

    expect(a.lessThan(b)).toBe(true);
    expect(lessThan(a, b)).toBe(true);
  });
});
