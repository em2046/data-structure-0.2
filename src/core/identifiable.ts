// Copied from
// https://github.com/apple/swift/blob/b9cc312ac1d01fbc983fc73148b2c44446034b0c/stdlib/public/core/Identifiable.swift

/**
 * @public
 *
 * A class of types whose instances hold the value of an entity with stable
 * identity.
 */
export interface Identifiable {
  /**
   * The stable identity of the entity associated with this instance.
   */
  id: unknown;
}
