/**
 * CPython: empty list is falsy; any non-empty list is truthy.
 */
import { describe, it, expect } from "vitest";
import { bool, pyInt, pyList } from "../../src/index.js";

describe("list __bool__", () => {
  it("empty list is falsy", () => {
    expect(bool(pyList([]))).toBe(false);
  });

  it("non-empty list is truthy", () => {
    expect(bool(pyList([pyInt(1), pyInt(2)]))).toBe(true);
  });

  it("single-element list is truthy", () => {
    expect(bool(pyList([pyInt(0)]))).toBe(true);
  });
});
