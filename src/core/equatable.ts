export interface Equatable {
  equality(rhs: Equatable): boolean;
}

export function equality<T>(lhs: T, rhs: T): boolean {
  let lhsEquable = lhs as unknown as Equatable;
  let rhsEquable = rhs as unknown as Equatable;

  if (
    typeof lhsEquable.equality === "function" &&
    typeof rhsEquable.equality === "function"
  ) {
    return lhsEquable.equality(rhsEquable);
  }

  return lhs === rhs;
}
