/**
 * CPython: builtin int constructor.
 */
import { describe, it, expect } from "vitest";
import {
  int,
  intProtocol,
  intType,
  pyBytes,
  pyFloat,
  pyInt,
  pyList,
  pyStr,
  pyTrue,
  unwrap,
} from "../../src/index.js";
import { PyTypeError, PyValueError } from "../../src/runtime/core/errors.js";

describe("cpython-derived int builtin", () => {
  it("int() returns zero", () => {
    const n = int();
    expect(n.type).toBe(intType);
    expect(unwrap(n)).toBe(0);
  });

  it("int(number) converts via __int__", () => {
    expect(unwrap(int(pyInt(5)))).toBe(5);
    expect(unwrap(int(pyFloat(3.7)))).toBe(3);
    expect(unwrap(int(pyTrue))).toBe(1);
    expect(intProtocol(pyFloat(3.7))).toBe(3);
  });

  it("int(str) parses base-10 literals", () => {
    expect(unwrap(int(pyStr("42")))).toBe(42);
    expect(unwrap(int(pyStr(" 42 ")))).toBe(42);
    expect(unwrap(int(pyStr("1_000")))).toBe(1000);
  });

  it("int(bytes) parses base-10 ASCII bytes", () => {
    expect(unwrap(int(pyBytes(new Uint8Array([52, 50]))))).toBe(42);
  });

  it("int(str|bytes, base) supports explicit and auto bases", () => {
    expect(unwrap(int(pyStr("0xff"), pyInt(0)))).toBe(255);
    expect(unwrap(int(pyStr("0x_ff"), pyInt(0)))).toBe(255);
    expect(unwrap(int(pyStr("0b101"), pyInt(0)))).toBe(5);
    expect(unwrap(int(pyStr("0b_1_0_1"), pyInt(0)))).toBe(5);
    expect(unwrap(int(pyStr("0o17"), pyInt(0)))).toBe(15);
    expect(unwrap(int(pyStr("ff"), pyInt(16)))).toBe(255);
    expect(unwrap(int(pyStr("Z"), pyInt(36)))).toBe(35);
    expect(unwrap(int(pyBytes(new Uint8Array([48, 120, 102, 102])), pyInt(0)))).toBe(
      255,
    );
    expect(unwrap(int(pyStr("00"), pyInt(0)))).toBe(0);
  });

  it("rejects non-string with explicit base", () => {
    expect(() => int(pyInt(1), pyInt(2))).toThrow(PyTypeError);
    expect(() => int(pyInt(1), pyInt(2))).toThrow(
      /can't convert non-string with explicit base/,
    );
  });

  it("rejects invalid base values", () => {
    expect(() => int(pyStr("1"), pyInt(1))).toThrow(PyValueError);
    expect(() => int(pyStr("1"), pyInt(1))).toThrow(
      /base must be >= 2 and <= 36, or 0/,
    );
    expect(() => int(pyStr("1"), pyInt(37))).toThrow(PyValueError);
    expect(() => int(pyStr("1"), pyInt(37))).toThrow(
      /base must be >= 2 and <= 36, or 0/,
    );
  });

  it("rejects bad base types", () => {
    expect(() => int(pyStr("1"), pyStr("2"))).toThrow(PyTypeError);
    expect(() => int(pyStr("1"), pyStr("2"))).toThrow(
      /'str' object cannot be interpreted as an integer/,
    );
  });

  it("rejects invalid literals", () => {
    expect(() => int(pyStr("abc"))).toThrow(PyValueError);
    expect(() => int(pyStr("abc"))).toThrow(
      /invalid literal for int\(\) with base 10: 'abc'/,
    );
    expect(() => int(pyStr("xyz"), pyInt(16))).toThrow(PyValueError);
    expect(() => int(pyStr("xyz"), pyInt(16))).toThrow(
      /invalid literal for int\(\) with base 16: 'xyz'/,
    );
    expect(() => int(pyStr("1_2_3_"))).toThrow(PyValueError);
    expect(() => int(pyBytes(new Uint8Array([255, 52, 50])))).toThrow(PyValueError);
    expect(() => int(pyStr("08"), pyInt(0))).toThrow(PyValueError);
    expect(() => int(pyStr("08"), pyInt(0))).toThrow(
      /invalid literal for int\(\) with base 0: '08'/,
    );
    expect(() => int(pyStr("0x"), pyInt(0))).toThrow(PyValueError);
    expect(() => int(pyStr("0x"), pyInt(0))).toThrow(
      /invalid literal for int\(\) with base 0: '0x'/,
    );
  });

  it("rejects non-finite float conversion", () => {
    expect(() => int(pyFloat(Number.POSITIVE_INFINITY))).toThrow(PyValueError);
    expect(() => int(pyFloat(Number.POSITIVE_INFINITY))).toThrow(
      /cannot convert float infinity to integer/,
    );
    expect(() => int(pyFloat(Number.NaN))).toThrow(PyValueError);
    expect(() => int(pyFloat(Number.NaN))).toThrow(
      /cannot convert float NaN to integer/,
    );
  });

  it("rejects too many arguments", () => {
    expect(() => int(pyInt(1), pyInt(2), pyInt(3))).toThrow(PyTypeError);
    expect(() => int(pyInt(1), pyInt(2), pyInt(3))).toThrow(
      /expected at most 2 arguments, got 3/,
    );
  });

  it("rejects list without __int__", () => {
    expect(() => int(pyList([]))).toThrow(PyTypeError);
    expect(() => int(pyList([]))).toThrow(
      /int\(\) argument must be a string or a real number, not 'list'/,
    );
  });
});
