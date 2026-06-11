/**
 * CPython: int.bit_length.
 */
import { describe, it, expect } from "vitest";
import {
  PyObject,
  getAttr,
  intType,
  pyInt,
  unwrap,
} from "../../src/index.js";
import { pyIntFromSafeInteger } from "../../src/runtime/builtins/int.js";

describe("cpython-derived int bit_length", () => {
  function bitLength(v: number): number {
    const self = pyInt(v);
    const fn = getAttr(self, "bit_length") as (self: PyObject) => PyObject;
    const result = fn(self);
    expect(result.type).toBe(intType);
    return unwrap(result);
  }

  it("zero has bit length zero", () => {
    expect(bitLength(0)).toBe(0);
  });

  it("positive powers of two and boundaries", () => {
    expect(bitLength(1)).toBe(1);
    expect(bitLength(2)).toBe(2);
    expect(bitLength(3)).toBe(2);
    expect(bitLength(7)).toBe(3);
    expect(bitLength(8)).toBe(4);
    expect(bitLength(255)).toBe(8);
    expect(bitLength(256)).toBe(9);
  });

  it("uses magnitude for negative values", () => {
    expect(bitLength(-1)).toBe(1);
    expect(bitLength(-7)).toBe(3);
    expect(bitLength(-255)).toBe(8);
    expect(bitLength(-256)).toBe(9);
  });

  it("matches CPython for large safe integers when stored without truncation", () => {
    const max = Number.MAX_SAFE_INTEGER;
    const fn = getAttr(pyIntFromSafeInteger(max), "bit_length") as (
      self: PyObject,
    ) => PyObject;
    expect(unwrap(fn(pyIntFromSafeInteger(max)))).toBe(53);
    const neg = getAttr(pyIntFromSafeInteger(-max), "bit_length") as (
      self: PyObject,
    ) => PyObject;
    expect(unwrap(neg(pyIntFromSafeInteger(-max)))).toBe(53);
  });
});
