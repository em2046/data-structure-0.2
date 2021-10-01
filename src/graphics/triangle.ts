import { parallelogramSignedArea } from "./area";
import { LineSegment } from "./line-segment";
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

export function pointInTriangle(triangle: Triangle, point: Point): boolean {
  const { a, b, c } = triangle;
  const area1 = parallelogramSignedArea(new LineSegment(a, b), point);
  const area2 = parallelogramSignedArea(new LineSegment(b, c), point);
  const area3 = parallelogramSignedArea(new LineSegment(c, a), point);

  return (
    (area1 < 0 && area2 < 0 && area3 < 0) ||
    (area1 > 0 && area2 > 0 && area3 > 0)
  );
}
