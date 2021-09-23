import { hash } from "../../src";

describe("hasher", () => {
  function testInt32(value: number): void {
    expect(value >= -0x8000_0000).toBe(true);
    expect(value <= 0x7fff_ffff).toBe(true);
    expect(Number.isSafeInteger(value)).toBe(true);
  }

  test("bigint", () => {
    for (let i = 0n; i < 8n; i++) {
      testInt32(hash(2n << (2n << i)));
    }
  });

  test("symbol", () => {
    testInt32(hash(Symbol()));
    testInt32(hash(Symbol("foo")));
  });

  test("const", () => {
    testInt32(hash(Number.EPSILON));
    testInt32(hash(Number.MAX_SAFE_INTEGER));
    testInt32(hash(Number.MAX_VALUE));
    testInt32(hash(Number.MIN_SAFE_INTEGER));
    testInt32(hash(Number.MIN_VALUE));
    testInt32(hash(Number.NaN));
    testInt32(hash(Number.NEGATIVE_INFINITY));
    testInt32(hash(Number.POSITIVE_INFINITY));

    testInt32(hash(Math.E));
    testInt32(hash(Math.LN10));
    testInt32(hash(Math.LN2));
    testInt32(hash(Math.LOG10E));
    testInt32(hash(Math.LOG2E));
    testInt32(hash(Math.PI));
    testInt32(hash(Math.SQRT1_2));
    testInt32(hash(Math.SQRT2));
  });

  test("string", () => {
    const text =
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";

    for (const word of text.split(" ")) {
      testInt32(hash(word));
    }

    for (let i = 0; i < 256; i++) {
      const char = String.fromCharCode(i);

      testInt32(hash(char));
    }

    const emojis = ["😃", "🧘🏻‍♂️", "🌍", "🍞", "🚗", "📞", "🎉", "❤️", "🍆", "🏁"];

    for (const emoji of emojis) {
      testInt32(hash(emoji));
    }
  });
});
