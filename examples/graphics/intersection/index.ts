import { findIntersections } from "../../../src/graphics/bentley-ottmann";
import { IdentifiablePoint } from "../../../src/graphics/point";
import { setupCanvas } from "../../shared/canvas";
import { segmentList } from "../../shared/cgaa";

const canvas = document.querySelector<HTMLCanvasElement>("#canvas")!;
const { ctx, width, height } = setupCanvas(canvas);

ctx.strokeStyle = "#000";

const w = width / 10;
const h = height / 10;

function drawText(point: IdentifiablePoint) {
  if (point.x === 5 && point.y === 5) {
    return;
  }

  ctx.font = "12px serif";
  ctx.fillText(point.id, point.x * w + 5, point.y * h);
}

segmentList.forEach((segment) => {
  const start = segment.start;
  const end = segment.end;

  ctx.beginPath();
  ctx.moveTo(start.x * w, start.y * h);
  ctx.lineTo(end.x * w, end.y * h);
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
  ctx.arc(point.x * w, point.y * h, 2, 0, Math.PI * 2);
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
