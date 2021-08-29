import { Hashable } from "./hashable";

// Copied from
// https://github.com/openjdk/jdk/blob/1fb798d320c708dfcbc0bb157511a2937fafb9e6/src/java.base/share/classes/java/lang/StringUTF16.java
// https://github.com/apple/swift/blob/3616872c286685f60a462bcc3eb993930313ff70/stdlib/public/core/Hasher.swift

function stringHashCode(value: string) {
  let hashValue = 0;
  const size = value.length;

  for (let i = 0; i < size; i++) {
    hashValue = 31 * hashValue + value.charCodeAt(i);
    hashValue |= 0;
  }

  return hashValue;
}

export class Hasher {
  hash = 0;

  combine(thing: unknown): void {
    let thingHash;
    const thingHashable = thing as Hashable;

    if (typeof thingHashable.hashValue === "number") {
      thingHash = thingHashable.hashValue;
    } else if (typeof thingHashable.hash === "function") {
      thingHash = thingHashable.hash(new Hasher());
    } else {
      thingHash = stringHashCode(String(thing));
    }

    let hashValue = this.hash;

    hashValue = 31 * hashValue + thingHash;
    this.hash = hashValue | 0;
  }

  finalize(): number {
    return this.hash;
  }
}

export function hash(thing: unknown): number {
  const hasher = new Hasher();

  hasher.combine(thing);

  return hasher.finalize();
}
