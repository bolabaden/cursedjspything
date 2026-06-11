/**
 * CPython: empty frozenset is falsy; any non-empty frozenset is truthy.
 */
import { describe, it, expect } from "vitest";
import { boolProtocol, pyFrozenSet, pyInt } from "../../src/index.js";

describe("frozenset __bool__", () => {
  it("empty frozenset is falsy", () => {
    expect(boolProtocol(pyFrozenSet([]))).toBe(false);
  });

  it("non-empty frozenset is truthy", () => {
    expect(boolProtocol(pyFrozenSet([pyInt(1), pyInt(2)]))).toBe(true);
  });

  it("single-element frozenset is truthy even when element is zero", () => {
    expect(boolProtocol(pyFrozenSet([pyInt(0)]))).toBe(true);
  });
});
