import { Equatable, Hashable, Hasher, Identifiable } from "../core";
import { Point } from "./point";

/**
 * @public
 *
 * In geometry, a line segment is a part of a line that is bounded by two
 * distinct end points, and contains every point on the line that is between
 * its endpoints.
 */
export class LineSegment implements Equatable {
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

  equality(rhs: LineSegment): boolean {
    return this.start === rhs.start && this.end === rhs.end;
  }
}

export class IdentifiableLineSegment
  extends LineSegment
  implements Identifiable, Hashable
{
  readonly id: string;

  constructor(id: string, start: Point, end: Point) {
    super(start, end);
    this.id = id;
  }

  equality(rhs: IdentifiableLineSegment): boolean {
    return this.id === rhs.id;
  }

  hash(hasher: Hasher): void {
    hasher.combine(this.id);
  }
}
