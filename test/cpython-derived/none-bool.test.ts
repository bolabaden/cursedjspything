/**
 * CPython: None is always falsy.
 */
import { describe, it, expect } from "vitest";
import { boolProtocol, pyNone } from "../../src/index.js";

describe("NoneType __bool__", () => {
  it("None is falsy", () => {
    expect(boolProtocol(pyNone)).toBe(false);
  });
});
