/**
 * CPython: list __sub__ same-type reject (plan 680).
 */
import { describe, it, expect } from "vitest";
import { pyInt, pyList, sub } from "../../src/index.js";
import { PyTypeError } from "../../src/runtime/core/errors.js";

describe("list __sub__", () => {
  it("sub rejects list and list", () => {
    const a = pyList([pyInt(1)]);
    const b = pyList([pyInt(2)]);
    expect(() => sub(a, b)).toThrow(PyTypeError);
    expect(() => sub(a, b)).toThrow(
      /unsupported operand type\(s\) for -: 'list' and 'list'/,
    );
  });
});
