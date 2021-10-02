import { findIntersections } from "../../../src/graphics/bentley-ottmann";
import { setupCanvas } from "../../shared/canvas";
import { getLineSegmentList } from "../../shared/line-segment-list";

const canvas = document.querySelector<HTMLCanvasElement>("#canvas")!;
const { ctx, width, height } = setupCanvas(canvas);
const segmentList = getLineSegmentList();

ctx.strokeStyle = "#000";

segmentList.forEach((segment) => {
  const start = segment.start;
  const end = segment.end;

  ctx.beginPath();
  ctx.moveTo(start.x * width, start.y * height);
  ctx.lineTo(end.x * width, end.y * height);
  ctx.stroke();
  ctx.closePath();
});

const points = findIntersections(segmentList);

points.forEach((point) => {
  ctx.beginPath();
  ctx.arc(point.x * width, point.y * height, 2, 0, Math.PI * 2);
  ctx.fill();
  ctx.closePath();
});
