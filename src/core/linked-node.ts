// Copied from
// https://github.com/rust-lang/rust/blob/2b4196e97736ffe75433235bf586989cdb4221c4/library/alloc/src/collections/linked_list.rs

export class Node<T> {
  next: Node<T> | null = null;
  prev: Node<T> | null = null;
  element: T;

  constructor(element: T) {
    this.element = element;
  }
}
