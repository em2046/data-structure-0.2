import { Equatable } from "./equatable";
import { Hasher } from "./hasher";

// Copied from
// https://github.com/apple/swift/blob/3616872c286685f60a462bcc3eb993930313ff70/stdlib/public/core/Hashable.swift

export interface Hashable extends Equatable {
  hashValue: number;

  hash(hasher: Hasher): number;
}
