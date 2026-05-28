/**
 * CPython: int 0 is falsy; any non-zero int is truthy.
 */
import { describe, it, expect } from "vitest";
import { bool, pyInt } from "../../src/index.js";

describe("int __bool__", () => {
  it("zero is falsy", () => {
    expect(bool(pyInt(0))).toBe(false);
  });

  it("positive non-zero is truthy", () => {
    expect(bool(pyInt(42))).toBe(true);
  });

  it("negative non-zero is truthy", () => {
    expect(bool(pyInt(-1))).toBe(true);
  });
});
