/**
 * CPython: float 0.0 is falsy; any non-zero float is truthy.
 */
import { describe, it, expect } from "vitest";
import { boolProtocol, pyFloat } from "../../src/index.js";

describe("float __bool__", () => {
  it("0.0 is falsy", () => {
    expect(boolProtocol(pyFloat(0))).toBe(false);
  });

  it("positive non-zero is truthy", () => {
    expect(boolProtocol(pyFloat(1.5))).toBe(true);
  });

  it("negative non-zero is truthy", () => {
    expect(boolProtocol(pyFloat(-0.5))).toBe(true);
  });
});
