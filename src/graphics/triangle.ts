import { Point } from "./point";

export class Triangle {
  a: Point;
  b: Point;
  c: Point;

  constructor(a: Point, b: Point, c: Point) {
    this.a = a;
    this.b = b;
    this.c = c;
  }
}
