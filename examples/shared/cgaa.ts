import { IdentifiableLineSegment } from "../../src/graphics/line-segment";
import { IdentifiablePoint } from "../../src/graphics/point";

export const segmentList = [
  new IdentifiableLineSegment(
    "s1",
    new IdentifiablePoint("s1-t", 0.0, 0.5),
    new IdentifiablePoint("s1-b", 0.5, 1.0)
  ),
  new IdentifiableLineSegment(
    "s6",
    new IdentifiablePoint("s6-t", 0.5, 0.5),
    new IdentifiablePoint("s6-b", 1.0, 1.0)
  ),
  new IdentifiableLineSegment(
    "s7",
    new IdentifiablePoint("s7-t", 0.5, 0.5),
    new IdentifiablePoint("s7-b", 0.0, 1.0)
  ),
  new IdentifiableLineSegment(
    "s12",
    new IdentifiablePoint("s12-t", 1.0, 0.5),
    new IdentifiablePoint("s12-b", 0.5, 1.0)
  ),
];
