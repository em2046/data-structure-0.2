import { Identifiable } from "./identifiable";

class Point implements Identifiable {
  id: string;
  x: number;
  y: number;

  constructor(id: string, x: number, y: number) {
    this.id = id;
    this.x = x;
    this.y = y;
  }
}

describe("identifiable", () => {
  test("basic", () => {
    const point = new Point("0001", 1, 2);

    expect(point.id).toBeDefined();
  });
});
