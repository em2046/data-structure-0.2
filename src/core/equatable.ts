/**
 * @public
 *
 * A type that can be compared for value equality.
 */
export interface Equatable {
  /**
   * Returns a Boolean value indicating whether two values are equal.
   *
   * @param rhs - Another value to compare.
   */
  equality(rhs: Equatable): boolean;
}

/**
 * @public
 *
 * Returns a Boolean value indicating whether two values are equal.
 *
 * @param lhs - A value to compare.
 * @param rhs - Another value to compare.
 */
export function equality<T>(lhs: T, rhs: T): boolean {
  const lhsEquable = lhs as unknown as Equatable;
  const rhsEquable = rhs as unknown as Equatable;

  if (
    typeof lhsEquable.equality === "function" &&
    typeof rhsEquable.equality === "function"
  ) {
    return lhsEquable.equality(rhsEquable);
  }

  return lhs === rhs;
}
