/**
 * CPython: in-place ops fall back to binary dispatch and reject incompatible types.
 */
import { describe, it, expect } from "vitest";
import {
  iadd,
  ifloordiv,
  imatmul,
  imod,
  ipow,
  isub,
  itruediv,
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

  it("isub rejects str and int", () => {
    expect(() => isub(pyStr("a"), pyInt(1))).toThrow(PyTypeError);
    expect(() => isub(pyStr("a"), pyInt(1))).toThrow(
      /unsupported operand type\(s\) for -=: 'str' and 'int'/,
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

  it("iadd rejects int and list", () => {
    expect(() => iadd(pyInt(2), pyList([pyInt(1)]))).toThrow(PyTypeError);
    expect(() => iadd(pyInt(2), pyList([pyInt(1)]))).toThrow(
      /unsupported operand type\(s\) for \+=: 'int' and 'list'/,
    );
  });

  it("iadd rejects str and bool", () => {
    expect(() => iadd(pyStr("a"), pyTrue)).toThrow(PyTypeError);
    expect(() => iadd(pyStr("a"), pyTrue)).toThrow(
      /unsupported operand type\(s\) for \+=: 'str' and 'bool'/,
    );
  });

  it("iadd rejects bool and str", () => {
    expect(() => iadd(pyTrue, pyStr("a"))).toThrow(PyTypeError);
    expect(() => iadd(pyTrue, pyStr("a"))).toThrow(
      /unsupported operand type\(s\) for \+=: 'bool' and 'str'/,
    );
  });
});

describe("cpython-derived inplace int/str remaining ops", () => {
  const i = () => pyInt(1);
  const s = () => pyStr("a");

  it("imatmul rejects int and str in both orders", () => {
    expect(() => imatmul(i(), s())).toThrow(PyTypeError);
    expect(() => imatmul(i(), s())).toThrow(
      /unsupported operand type\(s\) for @=: 'int' and 'str'/,
    );
    expect(() => imatmul(s(), i())).toThrow(PyTypeError);
    expect(() => imatmul(s(), i())).toThrow(
      /unsupported operand type\(s\) for @=: 'str' and 'int'/,
    );
  });

  it("itruediv rejects int and str in both orders", () => {
    expect(() => itruediv(i(), s())).toThrow(PyTypeError);
    expect(() => itruediv(i(), s())).toThrow(
      /unsupported operand type\(s\) for \/=: 'int' and 'str'/,
    );
    expect(() => itruediv(s(), i())).toThrow(PyTypeError);
    expect(() => itruediv(s(), i())).toThrow(
      /unsupported operand type\(s\) for \/=: 'str' and 'int'/,
    );
  });

  it("ifloordiv rejects int and str in both orders", () => {
    expect(() => ifloordiv(i(), s())).toThrow(PyTypeError);
    expect(() => ifloordiv(i(), s())).toThrow(
      /unsupported operand type\(s\) for \/\/=: 'int' and 'str'/,
    );
    expect(() => ifloordiv(s(), i())).toThrow(PyTypeError);
    expect(() => ifloordiv(s(), i())).toThrow(
      /unsupported operand type\(s\) for \/\/=: 'str' and 'int'/,
    );
  });

  it("imod rejects int and str in both orders", () => {
    expect(() => imod(i(), s())).toThrow(PyTypeError);
    expect(() => imod(i(), s())).toThrow(
      /unsupported operand type\(s\) for %=: 'int' and 'str'/,
    );
    expect(() => imod(s(), i())).toThrow(PyTypeError);
    expect(() => imod(s(), i())).toThrow(
      /unsupported operand type\(s\) for %=: 'str' and 'int'/,
    );
  });

  it("ipow rejects int and str in both orders", () => {
    expect(() => ipow(i(), s())).toThrow(PyTypeError);
    expect(() => ipow(i(), s())).toThrow(
      /unsupported operand type\(s\) for \*\*=: 'int' and 'str'/,
    );
    expect(() => ipow(s(), i())).toThrow(PyTypeError);
    expect(() => ipow(s(), i())).toThrow(
      /unsupported operand type\(s\) for \*\*=: 'str' and 'int'/,
    );
  });
});
