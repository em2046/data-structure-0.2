// Copied from
// https://github.com/apple/swift/blob/7123d2614b5f222d03b3762cb110d27a9dd98e24/stdlib/public/Darwin/CoreGraphics/CoreGraphics.swift

import { Equatable } from "../core";

export class Point implements Equatable {
  readonly x: number;
  readonly y: number;

  constructor();

  constructor(x: number, y: number);

  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  equality(rhs: Point): boolean {
    return this.x === rhs.x && this.y === rhs.y;
  }
}
