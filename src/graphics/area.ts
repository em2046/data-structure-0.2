import { determinant } from "./determinant";
import { LineSegment } from "./line-segment";
import { Point } from "./point";

export function parallelogramArea(line: LineSegment, point: Point): number {
  const a = line.start;
  const b = line.end;
  const c = point;
  const a1 = a.x;
  const a2 = a.y;
  const b1 = b.x;
  const b2 = b.y;
  const c1 = c.x;
  const c2 = c.y;

  return determinant(a1, a2, 1, b1, b2, 1, c1, c2, 1);
}
