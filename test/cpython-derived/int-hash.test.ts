/**
 * CPython: int is hashable; zero hashes to 0.
 */
import { describe, it, expect } from "vitest";
import { hash, pyInt } from "../../src/index.js";

describe("int __hash__", () => {
  it("zero int hash to 0", () => {
    expect(hash(pyInt(0))).toBe(0);
  });

  it("returns a stable hash for the same object", () => {
    const n = pyInt(42);
    expect(hash(n)).toBe(hash(n));
  });

  it("matches for equal ints built separately", () => {
    const a = pyInt(7);
    const b = pyInt(7);
    expect(hash(a)).toBe(hash(b));
  });

  it("differs for different ints", () => {
    const a = pyInt(1);
    const b = pyInt(2);
    expect(hash(a)).not.toBe(hash(b));
  });
});
