/***
 * https://github.com/apple/swift/blob/7123d2614b5f222d03b3762cb110d27a9dd98e24/stdlib/public/core/Comparable.swift
 */

import { Equatable } from "./equatable";

/**
 * @public
 *
 * A type that can be compared using the relational operators `<`, `<=`, `>=`
 * and `>`.
 */
export interface Comparable extends Equatable {
  /**
   * Returns a Boolean value indicating whether the value of `this`
   * is less than that of the first argument.
   *
   * @param rhs - Another value to compare.
   */
  lessThan(rhs: Comparable): boolean;
}

/**
 * @public
 *
 * Returns a Boolean value indicating whether the value of the first argument
 * is less than that of the second argument.
 *
 * @param lhs - A value to compare.
 * @param rhs - Another value to compare.
 */
export function lessThan<T>(lhs: T, rhs: T): boolean {
  const lhsComparable = lhs as unknown as Comparable;
  const rhsComparable = rhs as unknown as Comparable;

  if (
    typeof lhsComparable.lessThan === "function" &&
    typeof rhsComparable.lessThan === "function"
  ) {
    return lhsComparable.lessThan(rhsComparable);
  }

  return lhs < rhs;
}
