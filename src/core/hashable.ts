import { Equatable } from "./equatable";
import { Hasher } from "./hasher";

// Copied from
// https://github.com/apple/swift/blob/3616872c286685f60a462bcc3eb993930313ff70/stdlib/public/core/Hashable.swift

/**
 * @public
 *
 * A type that can be hashed into a `Hasher` to produce an integer hash value.
 */
export interface Hashable extends Equatable {
  /**
   * The hash value.
   */
  hashValue: number;

  /**
   * Hashes the essential components of this value by feeding them into the
   * given hasher.
   *
   * @param hasher - The hasher to use when combining the components of this
   * instance.
   */
  hash(hasher: Hasher): number;
}
