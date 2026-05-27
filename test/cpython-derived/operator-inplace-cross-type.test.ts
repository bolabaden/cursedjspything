/**
 * CPython: in-place ops fall back to binary dispatch and reject incompatible types.
 */
import { describe, it, expect } from "vitest";
import {
  iadd,
  isub,
  pyInt,
  pyList,
  pyStr,
  pyTrue,
} from "../../src/index.js";
import { PyTypeError } from "../../src/runtime/core/errors.js";

describe("cpython-derived inplace cross-type TypeError", () => {
  it("iadd rejects int and str", () => {
    expect(() => iadd(pyInt(1), pyStr("a"))).toThrow(PyTypeError);
    expect(() => iadd(pyInt(1), pyStr("a"))).toThrow(
      /unsupported operand type\(s\) for \+=: 'int' and 'str'/,
    );
  });

  it("isub rejects int and str", () => {
    expect(() => isub(pyInt(1), pyStr("a"))).toThrow(PyTypeError);
    expect(() => isub(pyInt(1), pyStr("a"))).toThrow(
      /unsupported operand type\(s\) for -=: 'int' and 'str'/,
    );
  });

  it("iadd rejects str and int", () => {
    expect(() => iadd(pyStr("a"), pyInt(1))).toThrow(PyTypeError);
    expect(() => iadd(pyStr("a"), pyInt(1))).toThrow(
      /unsupported operand type\(s\) for \+=: 'str' and 'int'/,
    );
  });

  it("iadd rejects list and int", () => {
    expect(() => iadd(pyList([pyInt(1)]), pyInt(2))).toThrow(PyTypeError);
    expect(() => iadd(pyList([pyInt(1)]), pyInt(2))).toThrow(
      /unsupported operand type\(s\) for \+=: 'list' and 'int'/,
    );
  });

  it("iadd rejects str and bool", () => {
    expect(() => iadd(pyStr("a"), pyTrue)).toThrow(PyTypeError);
    expect(() => iadd(pyStr("a"), pyTrue)).toThrow(
      /unsupported operand type\(s\) for \+=: 'str' and 'bool'/,
    );
  });
});
