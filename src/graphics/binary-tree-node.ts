import { assert } from "../shared";

export type BinNode<T> = BinaryTreeNode<T>;

export enum Direction {
  UNKNOWN = "unknown",
  ROOT = "root",
  LEFT = "left",
  RIGHT = "right",
}

export enum NodeColor {
  RED = "red",
  BLACK = "black",
}

export function hasLeftChild<T>(node: BinNode<T>): boolean {
  return node.leftChild !== null;
}

export function hasRightChild<T>(node: BinNode<T>): boolean {
  return node.rightChild !== null;
}

export function isRoot<T>(node: BinNode<T>): boolean {
  return node.parent === null;
}

export function isLeftChild<T>(node: BinNode<T>): boolean {
  if (isRoot(node)) {
    return false;
  }

  const parent = node.parent;

  assert(parent !== null);

  return node === parent.leftChild;
}

export function isRightChild<T>(node: BinNode<T>): boolean {
  if (isRoot(node)) {
    return false;
  }

  const parent = node.parent;

  assert(parent !== null);

  return node === parent.rightChild;
}

export function isBlack<T>(node: BinNode<T> | null): boolean {
  if (node === null) {
    return true;
  }

  return node.color === NodeColor.BLACK;
}

export function isRed<T>(node: BinNode<T> | null): boolean {
  return !isBlack(node);
}

export function getUncle<T>(node: BinNode<T>): BinNode<T> | null {
  const parent = node.parent;

  assert(parent !== null);

  const grandparent = parent.parent;

  assert(grandparent !== null);

  if (isLeftChild(parent)) {
    return grandparent.rightChild;
  } else {
    return grandparent.leftChild;
  }
}

export function getDirection<T>(node: BinNode<T>): Direction {
  if (isRoot(node)) {
    return Direction.ROOT;
  }

  if (isLeftChild(node)) {
    return Direction.LEFT;
  } else {
    return Direction.RIGHT;
  }
}

export function getHeight<T>(node: BinNode<T> | null): number {
  if (node !== null) {
    return node.height;
  }

  return -1;
}

export function isBalanced<T>(node: BinNode<T>): boolean {
  const leftHeight = getHeight(node.leftChild);
  const rightHeight = getHeight(node.rightChild);
  const expectedHeight = isRed(node) ? leftHeight : leftHeight + 1;

  return leftHeight === rightHeight && node.height === expectedHeight;
}

function saveLeftBranch<T>(
  node: BinNode<T> | null,
  stack: Array<BinNode<T>>
): void {
  while (node !== null) {
    stack.push(node);
    node = node.leftChild;
  }
}

export class BinaryTreeNode<T> {
  element: T;
  parent: BinNode<T> | null = null;
  leftChild: BinNode<T> | null = null;
  rightChild: BinNode<T> | null = null;
  height = 0;
  color: NodeColor = NodeColor.RED;

  constructor(
    element: T,
    parent: BinNode<T> | null = null,
    leftChild: BinNode<T> | null = null,
    rightChild: BinNode<T> | null = null,
    height = 0,
    color = NodeColor.RED
  ) {
    this.element = element;
    this.parent = parent;
    this.leftChild = leftChild;
    this.rightChild = rightChild;
    this.height = height;
    this.color = color;
  }

  getNext(): BinNode<T> | null {
    let node: BinNode<T> | null;

    if (this.rightChild !== null) {
      node = this.rightChild;

      while (hasLeftChild(node)) {
        assert(node.leftChild !== null);

        node = node.leftChild;
      }
    } else {
      node = this;

      while (isRightChild(node)) {
        assert(node.parent !== null);

        node = node.parent;
      }

      node = node.parent;
    }

    return node;
  }

  getPrevious(): BinNode<T> | null {
    let node: BinNode<T> | null;

    if (this.leftChild !== null) {
      node = this.leftChild;

      while (hasRightChild(node)) {
        assert(node.rightChild !== null);

        node = node.rightChild;
      }
    } else {
      node = this;

      while (isLeftChild(node)) {
        assert(node.parent !== null);

        node = node.parent;
      }

      node = node.parent;
    }

    return node;
  }

  levelTraversal(visit: (element: T) => void): void {
    const queue: Array<BinNode<T>> = [];

    queue.push(this);

    while (queue.length > 0) {
      const node = queue.shift();

      assert(node !== undefined);

      visit(node.element);

      if (hasLeftChild(node)) {
        assert(node.leftChild !== null);

        queue.push(node.leftChild);
      }

      if (hasRightChild(node)) {
        assert(node.rightChild !== null);

        queue.push(node.rightChild);
      }
    }
  }

  inorderTraversal(visit: (element: T) => void): void {
    let current: BinNode<T> | null;
    const stack: Array<BinNode<T>> = [];

    current = this;

    for (let i = 0; i < Number.MAX_SAFE_INTEGER; i++) {
      saveLeftBranch(current, stack);

      if (stack.length === 0) {
        break;
      }

      const node = stack.pop();

      assert(node !== undefined);

      current = node;
      visit(current.element);
      current = current.rightChild;
    }
  }
}
