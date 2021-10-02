import { IdentifiableLineSegment } from "../../src/graphics/line-segment";
import { getPointList } from "./point-list";

export function getLineSegmentList(): IdentifiableLineSegment[] {
  const pointList = getPointList();
  const size = Math.floor(pointList.length / 2);
  const list = [];

  for (let i = 0; i < size; i++) {
    const index = i * 2;
    const id = `SEGMENT_${(i + 1).toString().padStart(4, "0")}`;

    list.push(
      new IdentifiableLineSegment(id, pointList[index], pointList[index + 1])
    );
  }

  return list;
}
