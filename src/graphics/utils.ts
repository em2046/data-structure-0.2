import { Triangle } from "./triangle";
import { Point } from "./point";
import { parallelogramArea } from "./area";
import { LineSegment } from "./line-segment";

export function pointInTriangle(triangle: Triangle, point: Point): boolean {
  const { a, b, c } = triangle;
  const area1 = parallelogramArea(new LineSegment(a, b), point);
  const area2 = parallelogramArea(new LineSegment(b, c), point);
  const area3 = parallelogramArea(new LineSegment(c, a), point);

  return (
    (area1 < 0 && area2 < 0 && area3 < 0) ||
    (area1 > 0 && area2 > 0 && area3 > 0)
  );
}
