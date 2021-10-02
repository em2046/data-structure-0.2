import { IdentifiableLineSegment } from "../../src/graphics/line-segment";
import { IdentifiablePoint } from "../../src/graphics/point";

export const segmentList = [
  new IdentifiableLineSegment(
    "s1",
    new IdentifiablePoint("s1-t", 4, 1),
    new IdentifiablePoint("s1-b", 6, 9)
  ),
  new IdentifiableLineSegment(
    "s2",
    new IdentifiablePoint("s2-t", 5, 5),
    new IdentifiablePoint("s2-b", 4, 10)
  ),
  new IdentifiableLineSegment(
    "s3",
    new IdentifiablePoint("s3-t", 8, 2),
    new IdentifiablePoint("s3-b", 3, 7)
  ),
  new IdentifiableLineSegment(
    "s4",
    new IdentifiablePoint("s4-t", 2, 2),
    new IdentifiablePoint("s4-b", 5, 5)
  ),
  new IdentifiableLineSegment(
    "s5",
    new IdentifiablePoint("s5-t", 2, 4),
    new IdentifiablePoint("s5-b", 5, 5)
  ),
  new IdentifiableLineSegment(
    "s7",
    new IdentifiablePoint("s7-t", 0, 3),
    new IdentifiablePoint("s7-b", 1, 6)
  ),
  new IdentifiableLineSegment(
    "s8",
    new IdentifiablePoint("s8-t", 9, 3),
    new IdentifiablePoint("s8-b", 7, 6)
  ),
  new IdentifiableLineSegment(
    "s9",
    new IdentifiablePoint("s9-t", 0, 1),
    new IdentifiablePoint("s9-b", 10, 6)
  ),
];
