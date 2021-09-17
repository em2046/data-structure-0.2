import { Node } from "./linked-node";
import { equality } from "./equatable";
import { assert } from "../shared";

// Copied from
// https://github.com/rust-lang/rust/blob/2b4196e97736ffe75433235bf586989cdb4221c4/library/alloc/src/collections/linked_list.rs

/**
 * @public
 *
 * A doubly-linked list with owned nodes.
 */
export class LinkedList<T> implements Iterable<T> {
  #head: Node<T> | null = null;
  #tail: Node<T> | null = null;
  #size = 0;

  /**
   * Creates a new linked list.
   */
  constructor();

  /**
   * Creates a new, shallow-copied linked list instance from an iterable object.
   *
   * @param iterable - An iterable object to convert to a linked list.
   */
  constructor(iterable: Iterable<T>);

  constructor(iterable: Iterable<T> = []) {
    for (const element of iterable) {
      this.pushBack(element);
    }
  }

  /**
   * Returns the size of the linked list.
   */
  get size(): number {
    return this.#size;
  }

  /**
   * Creates a new, shallow-copied linked list instance from an iterable object.
   *
   * @param iterable - An iterable object to convert to a linked list.
   */
  static from<T>(iterable: Iterable<T> = []): LinkedList<T> {
    return new LinkedList(iterable);
  }

  /**
   * An iterator over the elements of a linked list.
   */
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

  /**
   * Moves all elements from `other` to the end of the list.
   *
   * @param other - Other linked list to append.
   */
  append(other: LinkedList<T>): LinkedList<T> {
    const otherHead = other.#head;

    if (otherHead === null) {
      return this;
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

    return this;
  }

  /**
   * Removes all elements from the linked list.
   */
  clear(): void {
    const size = this.#size;

    for (let i = 0; i < size; i++) {
      this.#popBack();
    }
  }

  /**
   * Provides a reference to the front element, or `undefined` if the list is
   * empty.
   */
  front(): T | undefined {
    const head = this.#head;

    if (head === null) {
      return undefined;
    }

    return head.element;
  }

  /**
   * Provides a reference to the back element, or `undefined` if the list is
   * empty.
   */
  back(): T | undefined {
    const tail = this.#tail;

    if (tail === null) {
      return undefined;
    }

    return tail.element;
  }

  /**
   * Adds an element first in the list.
   *
   * @param element - The element to push to the linked list.
   */
  pushFront(element: T): LinkedList<T> {
    this.#pushFront(new Node<T>(element));

    return this;
  }

  /**
   * Removes the first element and returns it, or `undefined` if the list is
   * empty.
   */
  popFront(): T | undefined {
    const node = this.#popFront();

    if (node === null) {
      return undefined;
    } else {
      return node.element;
    }
  }

  /**
   * Appends an element to the back of a list.
   *
   * @param element - The element to push to the linked list.
   */
  pushBack(element: T): LinkedList<T> {
    this.#pushBack(new Node<T>(element));

    return this;
  }

  /**
   * Removes the last element from a list and returns it, or `undefined` if
   * it is empty.
   */
  popBack(): T | undefined {
    const node = this.#popBack();

    if (node === null) {
      return undefined;
    } else {
      return node.element;
    }
  }

  /**
   * Returns a boolean indicating whether an element with the specified value
   * exists in a linked list or not.
   *
   * @param element - The value to test for presence in the linked list.
   */
  has(element: T): boolean {
    return this.#get(element) !== null;
  }

  /**
   * Appends a new element with a specified value to the end of a linked list.
   *
   * @param element - The value of the element to add to the linked list.
   */
  add(element: T): LinkedList<T> {
    this.delete(element);
    this.pushBack(element);

    return this;
  }

  /**
   * Removes a specified value from a linked list, if it is in the linked list.
   *
   * @param element - The value to remove from the linked list.
   */
  delete(element: T): boolean {
    let node = this.#head;
    const size = this.#size;

    for (let i = 0; i < size; i++) {
      assert(node !== null);

      if (equality(element, node.element)) {
        if (i === 0) {
          this.#popFront();
        } else if (i === size - 1) {
          this.#popBack();
        } else {
          this.#deleteInternal(node);
        }

        return true;
      }

      node = node.next;
    }

    return false;
  }

  #get(element: T): Node<T> | null {
    let node = this.#head;
    const size = this.#size;

    for (let i = 0; i < size; i++) {
      assert(node !== null);

      if (equality(element, node.element)) {
        return node;
      }

      node = node.next;
    }

    return null;
  }

  #pushFront(node: Node<T>): void {
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

  #popFront(): Node<T> | null {
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

  #pushBack(node: Node<T>): void {
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

  #popBack(): Node<T> | null {
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

  #deleteInternal(node: Node<T>): void {
    const next = node.next;
    const prev = node.prev;

    assert(next !== null);
    assert(prev !== null);

    next.prev = prev;
    prev.next = next;

    this.#size -= 1;
  }
}
