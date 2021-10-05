import { findIntersections } from "../../../src/graphics/bentley-ottmann";
import { IdentifiablePoint } from "../../../src/graphics/point";
import { setupCanvas } from "../../shared/canvas";
import { segmentList } from "../../shared/cgaa";
import { getLineSegmentList } from "../../shared/line-segment-list";

const canvas = document.querySelector<HTMLCanvasElement>("#canvas")!;
const { ctx, width, height } = setupCanvas(canvas);

ctx.strokeStyle = "#000";

function w(value: number): number {
  return value * 0.8 * width + 0.1 * width;
}

function h(value: number): number {
  return value * 0.8 * height + 0.1 * height;
}

function drawText(point: IdentifiablePoint) {
  if (point.x === 5 && point.y === 5) {
    return;
  }

  ctx.font = "12px serif";
  ctx.fillText(point.id, w(point.x), h(point.y));
}

// let segmentList = getLineSegmentList();

segmentList.forEach((segment) => {
  const start = segment.start;
  const end = segment.end;

  ctx.beginPath();
  ctx.moveTo(w(start.x), h(start.y));
  ctx.lineTo(w(end.x), h(end.y));
  ctx.stroke();
  ctx.closePath();

  drawText(start);
  drawText(end);
});

const { topList, bottomList, resultMap } = findIntersections(segmentList);

console.log(resultMap);

resultMap.forEach((pair) => {
  const [point] = pair;

  ctx.beginPath();
  ctx.arc(w(point.x), h(point.y), 2, 0, Math.PI * 2);
  ctx.fill();
  ctx.closePath();
});

// TopList.forEach((point) => {
//   ctx.beginPath();
//   ctx.arc(point.x * w, point.y * h, 2, 0, Math.PI * 2);
//   ctx.fill();
//   ctx.closePath();
// });
//
// bottomList.forEach((point) => {
//   ctx.beginPath();
//   ctx.arc(point.x * w, point.y * h, 2, 0, Math.PI * 2);
//   ctx.fill();
//   ctx.closePath();
// });
