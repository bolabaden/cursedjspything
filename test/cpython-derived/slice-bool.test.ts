/**
 * CPython: slice objects are always truthy (no falsy slice values).
 */
import { describe, it, expect } from "vitest";
import { bool, pySlice } from "../../src/index.js";

describe("slice __bool__", () => {
  it("full slice is truthy", () => {
    expect(bool(pySlice())).toBe(true);
  });

  it("empty-range slice is truthy", () => {
    expect(bool(pySlice(0, 0))).toBe(true);
  });

  it("zero-step slice object is truthy", () => {
    expect(bool(pySlice(0, 0, 0))).toBe(true);
  });

  it("bounded slice is truthy", () => {
    expect(bool(pySlice(1, 2, 3))).toBe(true);
  });
});
