/**
 * CPython: False is falsy; True is truthy.
 */
import { describe, it, expect } from "vitest";
import { bool, pyFalse, pyTrue } from "../../src/index.js";

describe("bool __bool__", () => {
  it("False is falsy", () => {
    expect(bool(pyFalse)).toBe(false);
  });

  it("True is truthy", () => {
    expect(bool(pyTrue)).toBe(true);
  });
});
