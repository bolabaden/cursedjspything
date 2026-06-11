/**
 * CPython: empty dict is falsy; any non-empty dict is truthy.
 */
import { describe, it, expect } from "vitest";
import { boolProtocol, pyDict, pyInt, pyStr } from "../../src/index.js";

describe("dict __bool__", () => {
  it("empty dict is falsy", () => {
    expect(boolProtocol(pyDict([]))).toBe(false);
  });

  it("non-empty dict is truthy", () => {
    expect(
      boolProtocol(
        pyDict([
          [pyStr("a"), pyInt(1)],
          [pyStr("b"), pyInt(2)],
        ]),
      ),
    ).toBe(true);
  });

  it("single-entry dict is truthy even when value is zero", () => {
    expect(boolProtocol(pyDict([[pyStr("k"), pyInt(0)]]))).toBe(true);
  });
});
