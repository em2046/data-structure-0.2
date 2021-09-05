import { equality, Equatable } from "./equatable";

export class Entry<K, V> implements Equatable {
  readonly key: K;
  value: V;

  constructor(key: K, value: V) {
    this.key = key;
    this.value = value;
  }

  equality(rhs: Entry<K, V>): boolean {
    return equality(this.key, rhs.key);
  }
}
