/**
 * CPython: empty tuple is falsy; any non-empty tuple is truthy.
 */
import { describe, it, expect } from "vitest";
import { bool, pyInt, pyTuple } from "../../src/index.js";

describe("tuple __bool__", () => {
  it("empty tuple is falsy", () => {
    expect(bool(pyTuple([]))).toBe(false);
  });

  it("non-empty tuple is truthy", () => {
    expect(bool(pyTuple([pyInt(1), pyInt(2)]))).toBe(true);
  });

  it("single-element tuple is truthy", () => {
    expect(bool(pyTuple([pyInt(0)]))).toBe(true);
  });
});
