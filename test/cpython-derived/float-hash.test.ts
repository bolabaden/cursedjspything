/**
 * CPython: float is hashable; integral floats match int hash.
 */
import { describe, it, expect } from "vitest";
import { hash, pyFloat, pyInt } from "../../src/index.js";

describe("float __hash__", () => {
  it("zero float hash to 0", () => {
    expect(hash(pyFloat(0))).toBe(0);
    expect(hash(pyFloat(-0))).toBe(0);
  });

  it("integral floats match int hash", () => {
    expect(hash(pyFloat(1))).toBe(1);
    expect(hash(pyFloat(42))).toBe(hash(pyInt(42)));
  });

  it("returns a stable hash for the same object", () => {
    const f = pyFloat(3.14);
    expect(hash(f)).toBe(hash(f));
  });

  it("matches for equal floats built separately", () => {
    const a = pyFloat(2.5);
    const b = pyFloat(2.5);
    expect(hash(a)).toBe(hash(b));
  });

  it("differs for different floats", () => {
    expect(hash(pyFloat(3.14))).not.toBe(hash(pyFloat(3.15)));
  });
});
