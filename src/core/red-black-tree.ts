/***
 * https://www.cs.princeton.edu/~rs/talks/LLRB/RedBlack.pdf
 */

import { Color, isRed, Node } from "./red-black-node";
import { lessThan } from "./comparable";
import { equality } from "./equatable";
import { assert } from "../shared";

function rotateLeft<Key, Value>(node: Node<Key, Value>) {
  const temp = node.right;

  assert(temp !== null);
  node.right = temp.left;
  temp.left = node;
  temp.color = temp.left.color;
  temp.left.color = Color.RED;

  return temp;
}

function rotateRight<Key, Value>(node: Node<Key, Value>) {
  const temp = node.left;

  assert(temp !== null);
  node.left = temp.right;
  temp.right = node;
  temp.color = temp.right.color;
  temp.right.color = Color.RED;

  return temp;
}

function colorFlip<Key, Value>(node: Node<Key, Value>): Node<Key, Value> {
  node.color = isRed(node) ? Color.BLACK : Color.RED;

  assert(node.left !== null);
  node.left.color = isRed(node.left) ? Color.BLACK : Color.RED;

  assert(node.right !== null);
  node.right.color = isRed(node.right) ? Color.BLACK : Color.RED;

  return node;
}

export class RedBlackTree<Key, Value> {
  root: Node<Key, Value> | null = null;

  get(key: Key): Value | undefined {
    let node = this.root;

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
    this.insert(this.root, key, value);
  }

  insert(
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
      node.left = this.insert(node.left, key, value);
    } else {
      node.left = this.insert(node.right, key, value);
    }

    if (isRed(node.right)) {
      node = rotateLeft(node);
    }

    if (isRed(node.left)) {
      assert(node.left !== null);

      if (isRed(node.left.left)) {
        node = rotateRight(node);
      }
    }

    if (isRed(node.left) && isRed(node.right)) {
      colorFlip(node);
    }

    return node;
  }
}
