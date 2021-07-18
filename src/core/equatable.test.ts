import { equality, Equatable } from "./equatable";

class Point implements Equatable {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  equality(rhs: Point): boolean {
    return this.x === rhs.x && this.y === rhs.y;
  }
}

describe("equatable", () => {
  test("basic", () => {
    const a = new Point(1, 2);
    const b = new Point(1, 2);

    expect(a.equality(b)).toBe(true);
    expect(equality(a, b)).toBe(true);
  });
});
