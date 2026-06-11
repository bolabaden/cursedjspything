/**
 * CPython: empty set is falsy; any non-empty set is truthy.
 */
import { describe, it, expect } from "vitest";
import { boolProtocol, pyInt, pySet } from "../../src/index.js";

describe("set __bool__", () => {
  it("empty set is falsy", () => {
    expect(boolProtocol(pySet([]))).toBe(false);
  });

  it("non-empty set is truthy", () => {
    expect(boolProtocol(pySet([pyInt(1), pyInt(2)]))).toBe(true);
  });

  it("single-element set is truthy even when element is zero", () => {
    expect(boolProtocol(pySet([pyInt(0)]))).toBe(true);
  });
});
