/**
 * CPython: empty set is falsy; any non-empty set is truthy.
 */
import { describe, it, expect } from "vitest";
import { bool, pyInt, pySet } from "../../src/index.js";

describe("set __bool__", () => {
  it("empty set is falsy", () => {
    expect(bool(pySet([]))).toBe(false);
  });

  it("non-empty set is truthy", () => {
    expect(bool(pySet([pyInt(1), pyInt(2)]))).toBe(true);
  });

  it("single-element set is truthy even when element is zero", () => {
    expect(bool(pySet([pyInt(0)]))).toBe(true);
  });
});
