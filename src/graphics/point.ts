import { Equatable, Hashable, Hasher, Identifiable } from "../core";

// Copied from
// https://github.com/apple/swift/blob/7123d2614b5f222d03b3762cb110d27a9dd98e24/stdlib/public/Darwin/CoreGraphics/CoreGraphics.swift

/**
 * @public
 *
 * In classical Euclidean geometry, a point is a primitive notion that models
 * an exact location in the space, and has no length, width, or thickness.
 */
export class Point implements Equatable {
  /**
   * Represents the horizontal.
   */
  readonly x: number;

  /**
   * Represents the vertical.
   */
  readonly y: number;

  constructor();

  constructor(x: number, y: number);

  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  /**
   * Returns a Boolean value indicating whether two point are equal.
   *
   * @param rhs - Another point to compare.
   */
  equality(rhs: Point): boolean {
    return this.x === rhs.x && this.y === rhs.y;
  }
}

export class IdentifiablePoint extends Point implements Identifiable, Hashable {
  readonly id: string;

  constructor(id: string, x: number, y: number) {
    super(x, y);
    this.id = id;
  }

  equality(rhs: IdentifiablePoint): boolean {
    return this.id === rhs.id;
  }

  hash(hasher: Hasher): void {
    hasher.combine(this.id);
  }
}
