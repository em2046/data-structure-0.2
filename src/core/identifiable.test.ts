import { Identifiable } from "./identifiable";

// Copied from
// https://github.com/apple/swift/blob/392ba002c88346bc8d5cf8e19cb233d17794e844/test/stdlib/Identifiable.swift

describe("identifiable", () => {
  test("type check", () => {
    class IdentifiableClass implements Identifiable {
      id = 42;
    }

    const instance = new IdentifiableClass();

    expect(instance.id).toBe(42);
  });
});
