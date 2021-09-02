// Copied from
// https://www.cs.princeton.edu/~rs/talks/LLRB/LLRB.pdf
// https://www.cs.princeton.edu/~rs/talks/LLRB/RedBlack.pdf

export enum Color {
  Red = "RED",
  Black = "BLACK",
}

export class Node<K, V> {
  key: K;
  value: V;
  left: Node<K, V> | null = null;
  right: Node<K, V> | null = null;
  color: Color;

  constructor(key: K, value: V, color: Color = Color.Red) {
    this.key = key;
    this.value = value;
    this.color = color;
  }
}
