import { Point } from "./point";

/**
 * @public
 *
 * In geometry, a line segment is a part of a line that is bounded by two
 * distinct end points, and contains every point on the line that is between
 * its endpoints.
 */
export class LineSegment {
  /**
   * An end point.
   */
  readonly start: Point;

  /**
   * Another end point.
   */
  readonly end: Point;

  constructor(start: Point, end: Point) {
    this.start = start;
    this.end = end;
  }
}
