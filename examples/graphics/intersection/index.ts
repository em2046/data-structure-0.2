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
