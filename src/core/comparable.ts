import { Equatable } from "./equatable";

export interface Comparable extends Equatable {
  lessThan(rhs: Comparable): boolean;
}

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
