/**
 * CPython: False is falsy; True is truthy.
 */
import { describe, it, expect } from "vitest";
import { boolProtocol, pyFalse, pyTrue } from "../../src/index.js";

describe("bool __bool__", () => {
  it("False is falsy", () => {
    expect(boolProtocol(pyFalse)).toBe(false);
  });

  it("True is truthy", () => {
    expect(boolProtocol(pyTrue)).toBe(true);
  });
});
