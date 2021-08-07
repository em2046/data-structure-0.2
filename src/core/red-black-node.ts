// Copied from
// https://www.cs.princeton.edu/~rs/talks/LLRB/LLRB.pdf
// https://www.cs.princeton.edu/~rs/talks/LLRB/RedBlack.pdf

export enum Color {
  Red = "RED",
  Black = "BLACK",
}

export class Node<Key, Value> {
  key: Key;
  value: Value;
  left: Node<Key, Value> | null = null;
  right: Node<Key, Value> | null = null;
  color: Color;

  constructor(key: Key, value: Value, color: Color = Color.Red) {
    this.key = key;
    this.value = value;
    this.color = color;
  }
}
