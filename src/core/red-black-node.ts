// Copied from
// https://www.cs.princeton.edu/~rs/talks/LLRB/LLRB.pdf
// https://www.cs.princeton.edu/~rs/talks/LLRB/RedBlack.pdf
// https://github.com/kevin-wayne/algs4/blob/2a3d7f7a36d76fbf5222c26b3d71fcca85d82fc1/src/main/java/edu/princeton/cs/algs4/RedBlackBST.java

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
