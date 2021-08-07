import { Color, Node } from "./red-black-node";
import { lessThan } from "./comparable";
import { equality } from "./equatable";
import { assert } from "../shared";

// Copied from
// https://www.cs.princeton.edu/~rs/talks/LLRB/LLRB.pdf
// https://www.cs.princeton.edu/~rs/talks/LLRB/RedBlack.pdf

function isRed<Key, Value>(node: Node<Key, Value> | null): boolean {
  if (node === null) {
    return false;
  }

  return node.color === Color.Red;
}

function flipColor<Key, Value>(node: Node<Key, Value>): void {
  node.color = isRed(node) ? Color.Black : Color.Red;
}

function flipColors<Key, Value>(node: Node<Key, Value>): void {
  flipColor(node);

  assert(node.left !== null);
  flipColor(node.left);

  assert(node.right !== null);
  flipColor(node.right);
}

function rotateLeft<Key, Value>(node: Node<Key, Value>) {
  // Make a right-leaning 3-node lean to the left.
  const right = node.right;

  assert(right !== null);
  node.right = right.left;
  right.left = node;
  right.color = node.color;
  node.color = Color.Red;

  return right;
}

function rotateRight<Key, Value>(node: Node<Key, Value>) {
  // Make a left-leaning 3-node lean to the right.
  const left = node.left;

  assert(left !== null);
  node.left = left.right;
  left.right = node;
  left.color = node.color;
  node.color = Color.Red;

  return left;
}

function moveRedLeft<Key, Value>(node: Node<Key, Value>): Node<Key, Value> {
  // Assuming that node is red and both node.left and node.left.left
  // are black, make node.left or one of its children red.
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
  // Assuming that node is red and both node.right and node.right.left
  // are black, make node.right or one of its children red.
  flipColors(node);

  assert(node.left !== null);

  if (isRed(node.left.left)) {
    node = rotateRight(node);
    flipColors(node);
  }

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

/**
 * @public
 *
 * The red black tree holds key-value pairs.
 */
export class RedBlackTree<Key, Value> {
  #root: Node<Key, Value> | null = null;
  #size = 0;

  /**
   * Returns the number of elements in a red black tree.
   */
  get size(): number {
    return this.#size;
  }

  /**
   * Returns a specified element from a red black tree.
   *
   * @param key - The key of the element to return from the red black tree.
   */
  get(key: Key): Value | undefined {
    return this.#get(this.#root, key);
  }

  /**
   * Returns the key of the least element in the provided red black tree.
   */
  min(): Key | undefined {
    if (this.#root === null) {
      return undefined;
    }

    return this.#min(this.#root);
  }

  /**
   * Returns the key of the greatest element in the provided red black tree.
   */
  max(): Key | undefined {
    if (this.#root === null) {
      return undefined;
    }

    return this.#max(this.#root);
  }

  /**
   * Adds or updates an element with a specified key and a value to a red black
   * tree.
   *
   * @param key - The key of the element to add to the red black tree.
   * @param value - The value of the element to add to the red black tree.
   */
  put(key: Key, value: Value): void {
    this.#root = this.#put(this.#root, key, value);
    this.#root.color = Color.Black;
  }

  /**
   * Removes the least element from a red black tree.
   */
  deleteMin(): void {
    if (this.#root === null) {
      return;
    }

    this.#root = this.#deleteMin(this.#root);

    if (this.#root === null) {
      return;
    }

    this.#root.color = Color.Black;
  }

  /**
   * Removes the greatest element from a red black tree.
   */
  deleteMax(): void {
    if (this.#root === null) {
      return;
    }

    this.#root = this.#deleteMax(this.#root);

    if (this.#root === null) {
      return;
    }

    this.#root.color = Color.Black;
  }

  /**
   * Removes the specified element from a red black tree by key.
   *
   * @param key - The key of the element to remove from the red black tree.
   */
  delete(key: Key): void {
    if (this.#root === null) {
      return;
    }

    this.#root = this.#delete(this.#root, key);

    if (this.#root === null) {
      return;
    }

    this.#root.color = Color.Black;
  }

  #get(node: Node<Key, Value> | null, key: Key): Value | undefined {
    if (node === null) {
      return undefined;
    }

    if (equality(key, node.key)) {
      return node.value;
    } else if (lessThan(key, node.key)) {
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

  #max(node: Node<Key, Value>): Key {
    if (node.right === null) {
      return node.key;
    }

    return this.#max(node.right);
  }

  #put(
    node: Node<Key, Value> | null,
    key: Key,
    value: Value
  ): Node<Key, Value> {
    if (node === null) {
      this.#size += 1;

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
      this.#size -= 1;

      return null;
    }

    if (!isRed(node.left) && !isRed(node.left.left)) {
      node = moveRedLeft(node);
    }

    assert(node.left !== null);
    node.left = this.#deleteMin(node.left);

    return fixUp(node);
  }

  #deleteMax(node: Node<Key, Value>): Node<Key, Value> | null {
    if (isRed(node.left)) {
      node = rotateRight(node);
    }

    if (node.right === null) {
      this.#size -= 1;

      return null;
    }

    if (!isRed(node.right) && !isRed(node.right.left)) {
      node = moveRedRight(node);
    }

    assert(node.right !== null);
    node.right = this.#deleteMax(node.right);

    return fixUp(node);
  }

  #delete(node: Node<Key, Value>, key: Key): Node<Key, Value> | null {
    if (lessThan(key, node.key)) {
      assert(node.left !== null);

      if (!isRed(node.left)) {
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
        this.#size -= 1;

        return null;
      }

      if (!isRed(node.right)) {
        if (node.right !== null && !isRed(node.right.left)) {
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
        if (node.right !== null) {
          node.right = this.#delete(node.right, key);
        }
      }
    }

    return fixUp(node);
  }
}
