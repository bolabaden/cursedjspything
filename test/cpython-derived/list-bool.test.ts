/**
 * CPython: empty list is falsy; any non-empty list is truthy.
 */
import { describe, it, expect } from "vitest";
import { boolProtocol, pyInt, pyList } from "../../src/index.js";

describe("list __bool__", () => {
  it("empty list is falsy", () => {
    expect(boolProtocol(pyList([]))).toBe(false);
  });

  it("non-empty list is truthy", () => {
    expect(boolProtocol(pyList([pyInt(1), pyInt(2)]))).toBe(true);
  });

  it("single-element list is truthy", () => {
    expect(boolProtocol(pyList([pyInt(0)]))).toBe(true);
  });
});
