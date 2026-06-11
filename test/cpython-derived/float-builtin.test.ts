/**
 * CPython: builtin float constructor.
 */
import { describe, it, expect } from "vitest";
import {
  float,
  floatProtocol,
  floatType,
  pyBytes,
  pyFloat,
  pyInt,
  pyList,
  pyStr,
  pyTrue,
  unwrap,
} from "../../src/index.js";
import { PyTypeError, PyValueError } from "../../src/runtime/core/errors.js";

describe("cpython-derived float builtin", () => {
  it("float() returns zero", () => {
    const n = float();
    expect(n.type).toBe(floatType);
    expect(unwrap(n)).toBe(0);
  });

  it("float(number) converts via __float__", () => {
    expect(unwrap(float(pyInt(5)))).toBe(5);
    const existing = pyFloat(3.7);
    expect(unwrap(float(existing))).toBe(3.7);
    expect(unwrap(float(pyTrue))).toBe(1);
    expect(float(existing)).toBe(existing);
    expect(floatProtocol(pyInt(5))).toBe(5);
  });

  it("float(str) parses literals with whitespace and underscores", () => {
    expect(unwrap(float(pyStr("3.14")))).toBe(3.14);
    expect(unwrap(float(pyStr(" 1e2 ")))).toBe(100);
    expect(unwrap(float(pyStr("1_000.5")))).toBe(1000.5);
    expect(unwrap(float(pyStr(".5")))).toBe(0.5);
    expect(unwrap(float(pyStr("1.")))).toBe(1);
  });

  it("float(str) parses inf and nan", () => {
    expect(unwrap(float(pyStr("inf")))).toBe(Infinity);
    expect(unwrap(float(pyStr("-infinity")))).toBe(-Infinity);
    expect(Number.isNaN(unwrap(float(pyStr("nan"))))).toBe(true);
  });

  it("float(bytes) parses ASCII float bytes", () => {
    expect(unwrap(float(pyBytes(new Uint8Array([50, 46, 53]))))).toBe(2.5);
  });

  it("rejects invalid literals", () => {
    expect(() => float(pyStr("abc"))).toThrow(PyValueError);
    expect(() => float(pyStr("abc"))).toThrow(
      /could not convert string to float: 'abc'/,
    );
    expect(() => float(pyStr("1_2_3_"))).toThrow(PyValueError);
    expect(() => float(pyStr("1_.5"))).toThrow(PyValueError);
    expect(() => float(pyStr("1._5"))).toThrow(PyValueError);
    expect(() => float(pyStr("1_e10"))).toThrow(PyValueError);
  });

  it("rejects too many arguments", () => {
    expect(() => float(pyInt(1), pyInt(2))).toThrow(PyTypeError);
    expect(() => float(pyInt(1), pyInt(2))).toThrow(
      /expected at most 1 argument, got 2/,
    );
  });

  it("rejects list without __float__", () => {
    expect(() => float(pyList([]))).toThrow(PyTypeError);
    expect(() => float(pyList([]))).toThrow(
      /float\(\) argument must be a string or a real number, not 'list'/,
    );
  });
});
