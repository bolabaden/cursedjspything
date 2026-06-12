/**
 * CPython: int.as_integer_ratio.
 */
import { describe, it, expect } from "vitest";
import {
  PyObject,
  getAttr,
  getItem,
  intType,
  pyInt,
  tupleType,
  unwrap,
} from "../../src/index.js";
import { pyIntFromSafeInteger } from "../../src/runtime/builtins/int.js";

describe("cpython-derived int as_integer_ratio", () => {
  function asIntegerRatio(v: number): [number, number] {
    const self = pyInt(v);
    const fn = getAttr(self, "as_integer_ratio") as (self: PyObject) => PyObject;
    const tup = fn(self);
    expect(tup.type).toBe(tupleType);
    return [
      unwrap(getItem(tup, 0) as ReturnType<typeof pyInt>),
      unwrap(getItem(tup, 1) as ReturnType<typeof pyInt>),
    ];
  }

  it("returns (n, 1) for positive, negative, and zero", () => {
    expect(asIntegerRatio(42)).toEqual([42, 1]);
    expect(asIntegerRatio(-7)).toEqual([-7, 1]);
    expect(asIntegerRatio(0)).toEqual([0, 1]);
  });

  it("preserves large safe integers stored without truncation", () => {
    const max = Number.MAX_SAFE_INTEGER;
    const fn = getAttr(pyIntFromSafeInteger(max), "as_integer_ratio") as (
      self: PyObject,
    ) => PyObject;
    const tup = fn(pyIntFromSafeInteger(max));
    expect(unwrap(getItem(tup, 0))).toBe(max);
    expect(unwrap(getItem(tup, 1))).toBe(1);
    const negFn = getAttr(pyIntFromSafeInteger(-max), "as_integer_ratio") as (
      self: PyObject,
    ) => PyObject;
    const negTup = negFn(pyIntFromSafeInteger(-max));
    expect(unwrap(getItem(negTup, 0))).toBe(-max);
    expect(unwrap(getItem(negTup, 1))).toBe(1);
  });

  it("numerator values are int instances", () => {
    const self = pyInt(5);
    const fn = getAttr(self, "as_integer_ratio") as (self: PyObject) => PyObject;
    const tup = fn(self);
    expect(getItem(tup, 0).type).toBe(intType);
    expect(getItem(tup, 1).type).toBe(intType);
  });
});
