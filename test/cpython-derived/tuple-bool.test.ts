/**
 * CPython: empty tuple is falsy; any non-empty tuple is truthy.
 */
import { describe, it, expect } from "vitest";
import { boolProtocol, pyInt, pyTuple } from "../../src/index.js";

describe("tuple __bool__", () => {
  it("empty tuple is falsy", () => {
    expect(boolProtocol(pyTuple([]))).toBe(false);
  });

  it("non-empty tuple is truthy", () => {
    expect(boolProtocol(pyTuple([pyInt(1), pyInt(2)]))).toBe(true);
  });

  it("single-element tuple is truthy", () => {
    expect(boolProtocol(pyTuple([pyInt(0)]))).toBe(true);
  });
});
