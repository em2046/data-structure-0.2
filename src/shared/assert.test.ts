import { assert } from "./assert";

describe("assert", () => {
  test("throw", () => {
    expect(() => {
      assert(false);
    }).toThrowError();
  });
});
