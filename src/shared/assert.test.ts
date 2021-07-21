import { assert } from "./assert";

describe("assert", () => {
  test("basic", () => {
    expect(() => {
      assert(false);
    }).toThrowError();
  });
});
