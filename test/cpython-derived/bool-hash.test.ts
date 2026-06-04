/**
 * CPython: bool is hashable; False hashes to 0, True to 1.
 */
import { describe, it, expect } from "vitest";
import { hash, pyFalse, pyTrue } from "../../src/index.js";

describe("bool __hash__", () => {
  it("False hashes to 0 and True hashes to 1", () => {
    expect(hash(pyFalse)).toBe(0);
    expect(hash(pyTrue)).toBe(1);
  });

  it("returns a stable hash for the same object", () => {
    expect(hash(pyTrue)).toBe(hash(pyTrue));
    expect(hash(pyFalse)).toBe(hash(pyFalse));
  });

  it("matches for repeated singleton references", () => {
    expect(hash(pyFalse)).toBe(hash(pyFalse));
    expect(hash(pyTrue)).toBe(hash(pyTrue));
  });

  it("differs for False and True", () => {
    expect(hash(pyFalse)).not.toBe(hash(pyTrue));
  });
});
