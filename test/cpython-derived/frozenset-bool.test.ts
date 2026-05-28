/**
 * CPython: empty frozenset is falsy; any non-empty frozenset is truthy.
 */
import { describe, it, expect } from "vitest";
import { bool, pyFrozenSet, pyInt } from "../../src/index.js";

describe("frozenset __bool__", () => {
  it("empty frozenset is falsy", () => {
    expect(bool(pyFrozenSet([]))).toBe(false);
  });

  it("non-empty frozenset is truthy", () => {
    expect(bool(pyFrozenSet([pyInt(1), pyInt(2)]))).toBe(true);
  });

  it("single-element frozenset is truthy even when element is zero", () => {
    expect(bool(pyFrozenSet([pyInt(0)]))).toBe(true);
  });
});
