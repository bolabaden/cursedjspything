/**
 * CPython: bytes is hashable; empty bytes hash to 0.
 */
import { describe, it, expect } from "vitest";
import { hash, pyBytes } from "../../src/index.js";

describe("bytes __hash__", () => {
  it("empty bytes hash to 0", () => {
    expect(hash(pyBytes(new Uint8Array([])))).toBe(0);
  });

  it("returns a stable hash for the same object", () => {
    const b = pyBytes(new Uint8Array([97, 98, 99]));
    expect(hash(b)).toBe(hash(b));
  });

  it("matches for equal bytes built separately", () => {
    const a = pyBytes(new Uint8Array([1, 2, 3]));
    const b = pyBytes(new Uint8Array([1, 2, 3]));
    expect(hash(a)).toBe(hash(b));
  });

  it("differs for different byte sequences", () => {
    const a = pyBytes(new Uint8Array([1, 2, 3]));
    const b = pyBytes(new Uint8Array([1, 2, 4]));
    expect(hash(a)).not.toBe(hash(b));
  });
});
