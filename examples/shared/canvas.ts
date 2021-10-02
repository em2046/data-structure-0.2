interface setupCanvasReturn {
  ctx: CanvasRenderingContext2D;
  width: number;
  height: number;
}

export function setupCanvas(canvas: HTMLCanvasElement): setupCanvasReturn {
  const dpr = window.devicePixelRatio;
  const rect = canvas.getBoundingClientRect();
  const width = rect.width;
  const height = rect.height;
  const ctx = canvas.getContext("2d")!;

  canvas.width = width * dpr;
  canvas.height = height * dpr;
  ctx.scale(dpr, dpr);

  return {
    ctx,
    width,
    height,
  };
}
