/**
 * CPython: int.bit_count.
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

describe("cpython-derived int bit_count", () => {
  function bitCount(v: number): number {
    const self = pyInt(v);
    const fn = getAttr(self, "bit_count") as (self: PyObject) => PyObject;
    const result = fn(self);
    expect(result.type).toBe(intType);
    return unwrap(result);
  }

  it("zero has bit count zero", () => {
    expect(bitCount(0)).toBe(0);
  });

  it("counts ones in positive values", () => {
    expect(bitCount(1)).toBe(1);
    expect(bitCount(7)).toBe(3);
    expect(bitCount(255)).toBe(8);
    expect(bitCount(256)).toBe(1);
  });

  it("uses magnitude for negative values", () => {
    expect(bitCount(-1)).toBe(1);
    expect(bitCount(-7)).toBe(3);
    expect(bitCount(-255)).toBe(8);
  });

  it("matches CPython for large safe integers when stored without truncation", () => {
    const max = Number.MAX_SAFE_INTEGER;
    const fn = getAttr(pyIntFromSafeInteger(max), "bit_count") as (
      self: PyObject,
    ) => PyObject;
    expect(unwrap(fn(pyIntFromSafeInteger(max)))).toBe(53);
  });
});
