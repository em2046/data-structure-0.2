import { assert } from "../../src/shared";

describe("assert", () => {
  test("throw", () => {
    expect(() => {
      assert(false);
    }).toThrowError();
  });
});
