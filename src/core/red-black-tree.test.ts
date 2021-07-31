import { RedBlackTree } from "./red-black-tree";

describe("red-black-tree", () => {
  test("basic", () => {
    const redBlackTree = new RedBlackTree<number, number>();
    const origin = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

    origin.forEach((element) => {
      redBlackTree.put(element, element);

      expect(redBlackTree.get(element)).toBe(element);
    });
  });
});
