import { Hashable } from "./hashable";

// Copied from
// https://github.com/openjdk/jdk/blob/1fb798d320c708dfcbc0bb157511a2937fafb9e6/src/java.base/share/classes/java/lang/StringUTF16.java
// https://github.com/apple/swift/blob/3616872c286685f60a462bcc3eb993930313ff70/stdlib/public/core/Hasher.swift

function hashPrimitive(value: unknown): number {
  switch (typeof value) {
    case "bigint":
      return hashBigInt(value);
    case "number":
      return hashNumber(value);
    default:
      return hashString(String(value));
  }
}

function hashBigInt(value: bigint): number {
  return hashNumber(Number(value % 2n ** 32n));
}

function hashNumber(value: number): number {
  if (Number.isInteger(value)) {
    return value | 0;
  }

  return hashString(String(value));
}

function hashString(value: string) {
  const size = value.length;
  let hashValue = 0;

  for (let i = 0; i < size; i++) {
    hashValue = Math.imul(hashValue, value.charCodeAt(i));
    hashValue |= 0;
  }

  return hashValue;
}

/**
 * @public
 *
 * The universal hash function used by `Set` and `Map`.
 */
export class Hasher {
  #hashValue = 0;

  /**
   * Adds the given value to this hasher, mixing its essential parts into the
   * hasher state.
   *
   * @param value - A value to add to the hasher.
   */
  combine(value: unknown): void {
    let hashValue = this.#hashValue;

    hashValue = 31 * hashValue + hash(value);
    this.#hashValue = hashValue | 0;
  }

  /**
   * Finalizes the hasher state and returns the hash value.
   */
  finalize(): number {
    return this.#hashValue;
  }
}

/**
 * Hashes the essential components of this value by feeding them into the
 * given hasher.
 *
 * @param value - A value to add to the hasher.
 */
export function hash(value: unknown): number {
  const hashable = value as Hashable;

  if (typeof hashable.hashValue === "number") {
    return hashable.hashValue;
  }

  if (typeof hashable.hash === "function") {
    const hasher = new Hasher();

    hashable.hash(hasher);

    return hasher.finalize();
  }

  return hashPrimitive(value);
}
