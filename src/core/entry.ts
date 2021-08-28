import { equality, Equatable } from "./equatable";

export class Entry<Key, Value> implements Equatable {
  readonly key: Key;
  value: Value;

  constructor(key: Key, value: Value) {
    this.key = key;
    this.value = value;
  }

  equality(rhs: Entry<Key, Value>): boolean {
    return equality(this.key, rhs.key);
  }
}
