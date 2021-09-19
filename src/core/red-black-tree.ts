import { Color, Node } from "./red-black-node";
import { greaterThanOrEqual, lessThan, lessThanOrEqual } from "./comparable";
import { equality } from "./equatable";
import { assert } from "../shared";
import { AbstractMap } from "./abstract-map";

// Copied from
// https://www.cs.princeton.edu/~rs/talks/LLRB/LLRB.pdf
// https://www.cs.princeton.edu/~rs/talks/LLRB/RedBlack.pdf
// https://github.com/kevin-wayne/algs4/blob/2a3d7f7a36d76fbf5222c26b3d71fcca85d82fc1/src/main/java/edu/princeton/cs/algs4/RedBlackBST.java

function isRed<K, V>(node: Node<K, V> | null): boolean {
  if (node === null) {
    return false;
  }

  return node.color === Color.Red;
}

function flipColor<K, V>(node: Node<K, V>): void {
  node.color = isRed(node) ? Color.Black : Color.Red;
}

function flipColors<K, V>(node: Node<K, V>): void {
  flipColor(node);

  assert(node.left !== null);
  flipColor(node.left);

  assert(node.right !== null);
  flipColor(node.right);
}

function rotateLeft<K, V>(node: Node<K, V>): Node<K, V> {
  // Make a right-leaning 3-node lean to the left.
  const right = node.right;

  assert(right !== null);
  node.right = right.left;
  right.left = node;
  right.color = node.color;
  node.color = Color.Red;

  return right;
}

function rotateRight<K, V>(node: Node<K, V>): Node<K, V> {
  // Make a left-leaning 3-node lean to the right.
  const left = node.left;

  assert(left !== null);
  node.left = left.right;
  left.right = node;
  left.color = node.color;
  node.color = Color.Red;

  return left;
}

function moveRedLeft<K, V>(node: Node<K, V>): Node<K, V> {
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

function moveRedRight<K, V>(node: Node<K, V>): Node<K, V> {
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

function balance<K, V>(node: Node<K, V>): Node<K, V> {
  if (isRed(node.right) && !isRed(node.left)) {
    node = rotateLeft(node);
  }

  if (node.left !== null) {
    if (isRed(node.left) && isRed(node.left.left)) {
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
export class RedBlackTree<K, V> implements AbstractMap<K, V> {
  #root: Node<K, V> | null = null;
  #size = 0;

  /**
   * Returns the number of elements in a red black tree.
   */
  get size(): number {
    return this.#size;
  }

  /**
   * Creates a new, shallow-copied red black tree instance from an iterable
   * object.
   *
   * @param iterable - An `Array` or other iterable object whose elements are
   * key-value pairs. (For example, arrays with two elements, such as
   * `[[ 1, 'one' ],[ 2, 'two' ]]`.) Each key-value pair is added to the new
   * red black tree.
   */
  static from<K, V>(iterable: Iterable<[K, V]>): RedBlackTree<K, V> {
    const map = new RedBlackTree<K, V>();

    for (const [key, value] of iterable) {
      map.set(key, value);
    }

    return map;
  }

  /**
   * Returns a new iterator object that contains an **array of `[key, value]`**
   * for each element in the red black tree in in-order.
   */
  [Symbol.iterator](): IterableIterator<[K, V]> {
    return this.entries();
  }

  /**
   * Returns a new iterator object that contains an **array of `[key, value]`**
   * for each element in the red black tree in in-order.
   */
  entries(): IterableIterator<[K, V]> {
    let node = this.#root;
    const stack: Node<K, V>[] = [];

    return {
      [Symbol.iterator](): IterableIterator<[K, V]> {
        return this;
      },
      next(): IteratorResult<[K, V]> {
        while (node !== null || stack.length > 0) {
          if (node !== null) {
            stack.push(node);
            node = node.left;
          } else {
            const last = stack.pop();

            assert(last !== undefined);

            const { key, value } = last;

            node = last.right;

            return {
              done: false,
              value: [key, value],
            };
          }
        }

        return {
          done: true,
          value: undefined,
        };
      },
    };
  }

  /**
   * Returns a new iterator object that contains the **keys** for each element
   * in the red black tree in in-order.
   */
  keys(): IterableIterator<K> {
    const iterator = this.entries();

    return {
      [Symbol.iterator](): IterableIterator<K> {
        return this;
      },
      next(): IteratorResult<K> {
        const next = iterator.next();

        if (next.done) {
          return {
            done: true,
            value: undefined,
          };
        }

        const [key] = next.value;

        return {
          done: false,
          value: key,
        };
      },
    };
  }

  /**
   * Returns a new iterator object that contains the **values** for each
   * element in the red black tree in in-order.
   */
  values(): IterableIterator<V> {
    const iterator = this.entries();

    return {
      [Symbol.iterator](): IterableIterator<V> {
        return this;
      },
      next(): IteratorResult<V> {
        const next = iterator.next();

        if (next.done) {
          return {
            done: true,
            value: undefined,
          };
        }

        const [, value] = next.value;

        return {
          done: false,
          value: value,
        };
      },
    };
  }

  /**
   * Calls `callback` once for each key-value pair present in the red black
   * tree.
   * If a `thisArg` parameter is provided to `forEach`, it will be used as the
   * `this` value for each callback.
   *
   * @param callback - Function to execute for each entry in the map.
   * @param thisArg - Value to use as `this` when executing `callback`.
   */
  forEach(
    callback: (value: V, key: K, map: RedBlackTree<K, V>) => void,
    thisArg?: any
  ): void {
    for (const [key, value] of this.entries()) {
      callback.call(thisArg, value, key, this);
    }
  }

  /**
   * Returns a specified element from a red black tree.
   *
   * @param key - The key of the element to return from the red black tree.
   */
  get(key: K): V | undefined {
    const node = this.#get(this.#root, key);

    if (node === null) {
      return undefined;
    }

    return node.value;
  }

  /**
   * Returns a boolean asserting whether a value has been associated to the key
   * in the red black tree or not.
   *
   * @param key - The key of the element to test for presence in the red black
   * tree.
   */
  has(key: K): boolean {
    return this.get(key) !== undefined;
  }

  /**
   * Adds or updates an element with a specified key and a value to a red black
   * tree.
   *
   * @param key - The key of the element to add to the red black tree.
   * @param value - The value of the element to add to the red black tree.
   */
  set(key: K, value: V): this {
    // Make sure the value is not undefined.
    if (value === undefined) {
      throw new TypeError(`Illegal value: undefined`);
    }

    this.#root = this.#set(this.#root, key, value);
    this.#root.color = Color.Black;

    return this;
  }

  /**
   * Removes the smallest element from a red black tree.
   */
  deleteMin(): boolean {
    if (this.#root === null) {
      return false;
    }

    const size = this.#size;

    // If both children of root are black, set root to red.
    if (!isRed(this.#root.left) && !isRed(this.#root.right)) {
      this.#root.color = Color.Red;
    }

    this.#root = this.#deleteMin(this.#root);

    if (this.#root !== null) {
      this.#root.color = Color.Black;
    }

    return this.#size < size;
  }

  /**
   * Removes the largest element from a red black tree.
   */
  deleteMax(): boolean {
    if (this.#root === null) {
      return false;
    }

    const size = this.#size;

    // If both children of root are black, set root to red.
    if (!isRed(this.#root.left) && !isRed(this.#root.right)) {
      this.#root.color = Color.Red;
    }

    this.#root = this.#deleteMax(this.#root);

    if (this.#root !== null) {
      this.#root.color = Color.Black;
    }

    return this.#size < size;
  }

  /**
   * Removes the specified element from a red black tree by key.
   *
   * @param key - The key of the element to remove from the red black tree.
   */
  delete(key: K): boolean {
    if (this.#root === null) {
      return false;
    }

    const size = this.#size;

    // If both children of root are black, set root to red.
    if (!isRed(this.#root.left) && !isRed(this.#root.right)) {
      this.#root.color = Color.Red;
    }

    this.#root = this.#delete(this.#root, key);

    if (this.#root !== null) {
      this.#root.color = Color.Black;
    }

    return this.#size < size;
  }

  /**
   * Removes all elements from a red black tree.
   */
  clear(): void {
    this.#root = null;
    this.#size = 0;
  }

  /**
   * Returns the key-value pair of the smallest element from a red black tree.
   */
  min(): [K, V] | null {
    if (this.#root === null) {
      return null;
    }

    const node = this.#min(this.#root);

    return [node.key, node.value];
  }

  /**
   * Returns the key-value pair of the largest element from a red black tree.
   */
  max(): [K, V] | null {
    if (this.#root === null) {
      return null;
    }

    const node = this.#max(this.#root);

    return [node.key, node.value];
  }

  /**
   * Returns the key-value pair of the largest element less than to the given
   * key.
   *
   * @param key - The given key.
   */
  previous(key: K): [K, V] | null {
    const node = this.#previous(this.#root, key);

    if (node === null) {
      return null;
    }

    return [node.key, node.value];
  }

  /**
   * Returns the key-value pair of the smallest element greater than to the
   * given key.
   *
   * @param key - The given key.
   */
  next(key: K): [K, V] | null {
    const node = this.#next(this.#root, key);

    if (node === null) {
      return null;
    }

    return [node.key, node.value];
  }

  #get(node: Node<K, V> | null, key: K): Node<K, V> | null {
    if (node === null) {
      return null;
    }

    if (equality(key, node.key)) {
      return node;
    } else if (lessThan(key, node.key)) {
      return this.#get(node.left, key);
    } else {
      return this.#get(node.right, key);
    }
  }

  #set(node: Node<K, V> | null, key: K, value: V): Node<K, V> {
    if (node === null) {
      this.#size += 1;

      return new Node(key, value);
    }

    if (equality(key, node.key)) {
      node.value = value;
    } else if (lessThan(key, node.key)) {
      node.left = this.#set(node.left, key, value);
    } else {
      node.right = this.#set(node.right, key, value);
    }

    // Fix-up any right-leaning links.
    return balance(node);
  }

  #deleteMin(node: Node<K, V>): Node<K, V> | null {
    if (node.left === null) {
      this.#size -= 1;

      return null;
    }

    if (!isRed(node.left) && !isRed(node.left.left)) {
      node = moveRedLeft(node);
    }

    assert(node.left !== null);
    node.left = this.#deleteMin(node.left);

    return balance(node);
  }

  #deleteMax(node: Node<K, V>): Node<K, V> | null {
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

    return balance(node);
  }

  #delete(node: Node<K, V>, key: K): Node<K, V> | null {
    if (lessThan(key, node.key)) {
      if (node.left !== null) {
        if (!isRed(node.left) && !isRed(node.left.left)) {
          node = moveRedLeft(node);
        }
      }

      if (node.left !== null) {
        node.left = this.#delete(node.left, key);
      }
    } else {
      if (isRed(node.left)) {
        node = rotateRight(node);
      }

      if (equality(key, node.key) && node.right === null) {
        this.#size -= 1;

        return null;
      }

      if (node.right !== null) {
        if (!isRed(node.right) && !isRed(node.right.left)) {
          node = moveRedRight(node);
        }
      }

      if (node.right !== null) {
        if (equality(key, node.key)) {
          const min = this.#min(node.right);

          node.key = min.key;
          node.value = min.value;
          node.right = this.#deleteMin(node.right);
        } else {
          node.right = this.#delete(node.right, key);
        }
      }
    }

    return balance(node);
  }

  #min(node: Node<K, V>): Node<K, V> {
    if (node.left === null) {
      return node;
    }

    return this.#min(node.left);
  }

  #max(node: Node<K, V>): Node<K, V> {
    if (node.right === null) {
      return node;
    }

    return this.#max(node.right);
  }

  #previous(node: Node<K, V> | null, key: K): Node<K, V> | null {
    if (node === null) {
      return null;
    }

    if (lessThanOrEqual(key, node.key)) {
      return this.#previous(node.left, key);
    } else {
      const previous = this.#previous(node.right, key);

      if (previous !== null) {
        return previous;
      } else {
        return node;
      }
    }
  }

  #next(node: Node<K, V> | null, key: K): Node<K, V> | null {
    if (node === null) {
      return null;
    }

    if (greaterThanOrEqual(key, node.key)) {
      return this.#next(node.right, key);
    } else {
      const next = this.#next(node.left, key);

      if (next !== null) {
        return next;
      } else {
        return node;
      }
    }
  }
}
