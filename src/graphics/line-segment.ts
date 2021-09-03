import { Point } from "./point";

export class LineSegment {
  readonly start: Point;
  readonly end: Point;

  constructor(start: Point, end: Point) {
    this.start = start;
    this.end = end;
  }
}
