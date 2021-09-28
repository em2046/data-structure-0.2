import { LineSegment } from "./line-segment";
import { Point } from "./point";

/**
 * @public
 *
 * In Euclidean geometry, the intersection of a line and a line can be the
 * empty set, a point, or a line.
 *
 * @param lhs - A line to intersect.
 * @param rhs - Another line to intersect.
 */
export function lineLineIntersection(
  lhs: LineSegment,
  rhs: LineSegment
): Point {
  const p1 = lhs.start;
  const p2 = lhs.end;
  const p3 = rhs.start;
  const p4 = rhs.end;
  const x1 = p1.x;
  const y1 = p1.y;
  const x2 = p2.x;
  const y2 = p2.y;
  const x3 = p3.x;
  const y3 = p3.y;
  const x4 = p4.x;
  const y4 = p4.y;
  const denominator = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
  const x =
    ((x1 * y2 - y1 * x2) * (x3 - x4) - (x1 - x2) * (x3 * y4 - y3 * x4)) /
    denominator;
  const y =
    ((x1 * y2 - y1 * x2) * (y3 - y4) - (y1 - y2) * (x3 * y4 - y3 * x4)) /
    denominator;

  return new Point(x, y);
}
