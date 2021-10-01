export function determinant(
  a: number,
  b: number,
  c: number,
  d: number,
  e: number,
  f: number,
  g: number,
  h: number,
  i: number
): number {
  return a * e * i + b * f * g + c * d * h - c * e * g - b * d * i - a * f * h;
}
