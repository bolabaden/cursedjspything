/**
 * CPython: @ matmul rejects builtins without __matmul__.
 */
import { describe, it, expect } from "vitest";
import { matmul, pyInt, pyList, pyStr } from "../../src/index.js";
import { PyTypeError } from "../../src/runtime/core/errors.js";

describe("cpython-derived matmul on builtins without __matmul__", () => {
  it("int @ int raises TypeError", () => {
    expect(() => matmul(pyInt(1), pyInt(2))).toThrow(PyTypeError);
    expect(() => matmul(pyInt(1), pyInt(2))).toThrow(
      /unsupported operand type\(s\) for @: 'int' and 'int'/,
    );
  });

  it("list @ list raises TypeError", () => {
    expect(() => matmul(pyList([]), pyList([]))).toThrow(PyTypeError);
    expect(() => matmul(pyList([]), pyList([]))).toThrow(
      /unsupported operand type\(s\) for @: 'list' and 'list'/,
    );
  });

  it("int @ str raises TypeError", () => {
    expect(() => matmul(pyInt(1), pyStr("a"))).toThrow(PyTypeError);
    expect(() => matmul(pyInt(1), pyStr("a"))).toThrow(
      /unsupported operand type\(s\) for @: 'int' and 'str'/,
    );
  });
});
