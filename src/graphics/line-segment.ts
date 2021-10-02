import { Equatable, Hashable, Hasher, Identifiable } from "../core";
import { IdentifiablePoint, Point } from "./point";

/**
 * @public
 *
 * In geometry, a line segment is a part of a line that is bounded by two
 * distinct end points, and contains every point on the line that is between
 * its endpoints.
 */
export class LineSegment<T extends Point = Point>
  implements Equatable, Hashable
{
  /**
   * An end point.
   */
  readonly start: T;

  /**
   * Another end point.
   */
  readonly end: T;

  constructor(start: T, end: T) {
    this.start = start;
    this.end = end;
  }

  equality(rhs: LineSegment<T>): boolean {
    return this.start === rhs.start && this.end === rhs.end;
  }

  hash(hasher: Hasher): void {
    hasher.combine(this.start);
    hasher.combine(this.end);
  }
}

export class IdentifiableLineSegment
  extends LineSegment<IdentifiablePoint>
  implements Identifiable
{
  readonly id: string;

  constructor(id: string, start: IdentifiablePoint, end: IdentifiablePoint) {
    super(start, end);
    this.id = id;
  }
}
