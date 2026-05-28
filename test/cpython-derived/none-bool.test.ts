/**
 * CPython: None is always falsy.
 */
import { describe, it, expect } from "vitest";
import { bool, pyNone } from "../../src/index.js";

describe("NoneType __bool__", () => {
  it("None is falsy", () => {
    expect(bool(pyNone)).toBe(false);
  });
});
