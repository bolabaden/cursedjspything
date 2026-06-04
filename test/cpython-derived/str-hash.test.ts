/**
 * CPython: str is hashable; empty str hash to 0.
 */
import { describe, it, expect } from "vitest";
import { hash, pyStr } from "../../src/index.js";

describe("str __hash__", () => {
  it("empty str hash to 0", () => {
    expect(hash(pyStr(""))).toBe(0);
  });

  it("returns a stable hash for the same object", () => {
    const s = pyStr("abc");
    expect(hash(s)).toBe(hash(s));
  });

  it("matches for equal strings built separately", () => {
    const a = pyStr("hello");
    const b = pyStr("hello");
    expect(hash(a)).toBe(hash(b));
  });

  it("differs for different strings", () => {
    const a = pyStr("abc");
    const b = pyStr("abd");
    expect(hash(a)).not.toBe(hash(b));
  });
});
