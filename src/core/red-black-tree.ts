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

function fixUp<Key, Value>(node: Node<Key, Value>): Node<Key, Value> {
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

function moveRedLeft<Key, Value>(node: Node<Key, Value>): Node<Key, Value> {
  flipColors(node);

  assert(node.right !== null);

  if (isRed(node.right.left)) {
    node.right = rotateRight(node.right);
    node = rotateLeft(node);
    flipColors(node);
  }

  return node;
}

function moveRedRight<Key, Value>(node: Node<Key, Value>): Node<Key, Value> {
  flipColors(node);

  assert(node.left !== null);

  if (isRed(node.left.left)) {
    node = rotateRight(node);
    flipColors(node);
  }

  return node;
}

export class RedBlackTree<Key, Value> {
  #root: Node<Key, Value> | null = null;

  get(key: Key): Value | undefined {
    if (this.#root === null) {
      return undefined;
    }

    return this.#get(this.#root, key);
  }

  min(): Key | undefined {
    if (this.#root === null) {
      return undefined;
    }

    return this.#min(this.#root);
  }

  put(key: Key, value: Value): void {
    this.#root = this.#put(this.#root, key, value);
    this.#root.color = Color.BLACK;
  }

  deleteMin(): void {
    if (this.#root === null) {
      return;
    }

    this.#root = this.#deleteMin(this.#root);

    if (this.#root === null) {
      return;
    }

    this.#root.color = Color.BLACK;
  }

  deleteMax(): void {
    if (this.#root === null) {
      return;
    }

    this.#root = this.#deleteMax(this.#root);

    if (this.#root === null) {
      return;
    }

    this.#root.color = Color.BLACK;
  }

  delete(key: Key): void {
    if (this.#root === null) {
      return;
    }

    this.#root = this.#delete(this.#root, key);

    if (this.#root === null) {
      return;
    }

    this.#root.color = Color.BLACK;
  }

  #get(node: Node<Key, Value> | null, key: Key): Value | undefined {
    if (node === null) {
      return undefined;
    }

    if (equality(key, node.key)) {
      return node.value;
    }

    if (lessThan(key, node.key)) {
      return this.#get(node.left, key);
    } else {
      return this.#get(node.right, key);
    }
  }

  #min(node: Node<Key, Value>): Key {
    if (node.left === null) {
      return node.key;
    }

    return this.#min(node.left);
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
    } else if (lessThan(key, node.key)) {
      node.left = this.#put(node.left, key, value);
    } else {
      node.right = this.#put(node.right, key, value);
    }

    return fixUp(node);
  }

  #deleteMin(node: Node<Key, Value>): Node<Key, Value> | null {
    if (node.left === null) {
      return null;
    }

    if (!isRed(node.left) && !isRed(node.left.left)) {
      node = moveRedLeft(node);
    }

    if (node.left === null) {
      return null;
    }

    node.left = this.#deleteMin(node.left);

    return fixUp(node);
  }

  #deleteMax(node: Node<Key, Value>): Node<Key, Value> | null {
    if (isRed(node.left)) {
      node = rotateRight(node);
    }

    if (node.right === null) {
      return null;
    }

    if (!isRed(node.right) && !isRed(node.right.left)) {
      node = moveRedRight(node);
    }

    if (node.right === null) {
      return null;
    }

    node.right = this.#deleteMax(node.right);

    return fixUp(node);
  }

  #delete(node: Node<Key, Value>, key: Key): Node<Key, Value> | null {
    if (lessThan(key, node.key)) {
      if (!isRed(node.left)) {
        assert(node.left !== null);

        if (!isRed(node.left.left)) {
          node = moveRedLeft(node);
        }
      }

      assert(node.left !== null);
      node.left = this.#delete(node.left, key);
    } else {
      if (isRed(node.left)) {
        node = rotateRight(node);
      }

      if (equality(key, node.key) && node.right === null) {
        return null;
      }

      if (!isRed(node.right)) {
        assert(node.right !== null);

        if (!isRed(node.right.left)) {
          node = moveRedRight(node);
        }
      }

      if (equality(key, node.key)) {
        assert(node.right !== null);
        const value = this.#get(node.right, this.#min(node.right));

        assert(value !== undefined);
        node.value = value;
        node.key = this.#min(node.right);
        node.right = this.#deleteMin(node.right);
      } else {
        assert(node.right !== null);
        node.right = this.#delete(node.right, key);
      }
    }

    return fixUp(node);
  }
}
