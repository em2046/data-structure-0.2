/***
 * https://www.cs.princeton.edu/~rs/talks/LLRB/LLRB.pdf
 * https://www.cs.princeton.edu/~rs/talks/LLRB/RedBlack.pdf
 */

import { Color, isRed, Node } from "./red-black-node";
import { lessThan } from "./comparable";
import { equality } from "./equatable";
import { assert } from "../shared";

function rotateLeft<Key, Value>(node: Node<Key, Value>) {
  const right = node.right;

  assert(right !== null);
  node.right = right.left;
  right.left = node;
  right.color = node.color;
  node.color = Color.RED;

  return right;
}

function rotateRight<Key, Value>(node: Node<Key, Value>) {
  const left = node.left;

  assert(left !== null);
  node.left = left.right;
  left.right = node;
  left.color = node.color;
  node.color = Color.RED;

  return left;
}

function flipColor<Key, Value>(node: Node<Key, Value>): void {
  node.color = isRed(node) ? Color.BLACK : Color.RED;
}

function flipColors<Key, Value>(node: Node<Key, Value>): Node<Key, Value> {
  flipColor(node);

  assert(node.left !== null);
  flipColor(node.left);

  assert(node.right !== null);
  flipColor(node.right);

  return node;
}

export class RedBlackTree<Key, Value> {
  #root: Node<Key, Value> | null = null;

  get(key: Key): Value | undefined {
    let node = this.#root;

    while (node !== null) {
      if (equality(key, node.key)) {
        return node.value;
      }

      if (lessThan(key, node.key)) {
        node = node.left;
      } else {
        node = node.right;
      }
    }

    return undefined;
  }

  put(key: Key, value: Value): void {
    this.#root = this.#put(this.#root, key, value);
    this.#root.color = Color.BLACK;
  }

  #put(
    node: Node<Key, Value> | null,
    key: Key,
    value: Value
  ): Node<Key, Value> {
    if (node === null) {
      return new Node(key, value);
    }

    if (equality(key, node.key)) {
      node.value = value;
    }

    if (lessThan(key, node.key)) {
      node.left = this.#put(node.left, key, value);
    } else {
      node.right = this.#put(node.right, key, value);
    }

    if (isRed(node.right) && !isRed(node.left)) {
      node = rotateLeft(node);
    }

    if (isRed(node.left)) {
      assert(node.left !== null);

      if (isRed(node.left.left)) {
        node = rotateRight(node);
      }
    }

    if (isRed(node.left) && isRed(node.right)) {
      flipColors(node);
    }

    return node;
  }
}
