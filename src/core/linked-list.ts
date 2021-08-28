import { Node } from "./linked-node";

// Copied from
// https://github.com/rust-lang/rust/blob/2b4196e97736ffe75433235bf586989cdb4221c4/library/alloc/src/collections/linked_list.rs

export class LinkedList<T> {
  #head: Node<T> | null = null;
  #tail: Node<T> | null = null;
  #size = 0;

  constructor();

  constructor(iterable: Iterable<T>);

  constructor(iterable: Iterable<T> = []) {
    for (const element of iterable) {
      this.pushBack(element);
    }
  }

  get size(): number {
    return this.#size;
  }

  static from<T>(iterable: Iterable<T>): LinkedList<T> {
    return new LinkedList(iterable);
  }

  [Symbol.iterator](): IterableIterator<T> {
    let node = this.#head;

    return {
      [Symbol.iterator](): IterableIterator<T> {
        return this;
      },
      next(): IteratorResult<T> {
        if (node === null) {
          return {
            done: true,
            value: undefined,
          };
        }

        const element = node.element;

        node = node.next;

        return {
          done: false,
          value: element,
        };
      },
    };
  }

  append(other: LinkedList<T>): void {
    const otherHead = other.#head;

    if (otherHead === null) {
      return;
    }

    if (this.#tail === null) {
      this.#head = other.#head;
      this.#tail = other.#tail;
      this.#size = other.#size;
    } else {
      this.#tail.next = otherHead;
      otherHead.prev = this.#tail;
      this.#tail = other.#tail;
      this.#size += other.#size;
    }

    other.#head = null;
    other.#tail = null;
    other.#size = 0;
  }

  clear(): void {
    const size = this.#size;

    for (let i = 0; i < size; i++) {
      this.#popBackNode();
    }
  }

  front(): T | undefined {
    const head = this.#head;

    if (head === null) {
      return undefined;
    }

    return head.element;
  }

  back(): T | undefined {
    const tail = this.#tail;

    if (tail === null) {
      return undefined;
    }

    return tail.element;
  }

  pushFront(element: T): LinkedList<T> {
    this.#pushFrontNode(new Node<T>(element));

    return this;
  }

  popFront(): T | undefined {
    const node = this.#popFrontNode();

    if (node === null) {
      return undefined;
    } else {
      return node.element;
    }
  }

  pushBack(element: T): LinkedList<T> {
    this.#pushBackNode(new Node<T>(element));

    return this;
  }

  popBack(): T | undefined {
    const node = this.#popBackNode();

    if (node === null) {
      return undefined;
    } else {
      return node.element;
    }
  }

  #pushFrontNode(node: Node<T>): void {
    node.next = this.#head;
    node.prev = null;

    if (this.#head === null) {
      this.#tail = node;
    } else {
      this.#head.prev = node;
    }

    this.#head = node;
    this.#size += 1;
  }

  #popFrontNode(): Node<T> | null {
    const node = this.#head;

    if (node === null) {
      return null;
    }

    this.#head = node.next;

    if (this.#head === null) {
      this.#tail = null;
    } else {
      this.#head.prev = null;
    }

    this.#size -= 1;

    return node;
  }

  #pushBackNode(node: Node<T>): void {
    node.prev = this.#tail;
    node.next = null;

    if (this.#tail === null) {
      this.#head = node;
    } else {
      this.#tail.next = node;
    }

    this.#tail = node;
    this.#size += 1;
  }

  #popBackNode(): Node<T> | null {
    const node = this.#tail;

    if (node === null) {
      return null;
    }

    this.#tail = node.prev;

    if (this.#tail === null) {
      this.#head = null;
    } else {
      this.#tail.next = null;
    }

    this.#size -= 1;

    return node;
  }
}
