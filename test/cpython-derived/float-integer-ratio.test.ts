/**
 * CPython: float.is_integer and float.as_integer_ratio.
 */
import { describe, it, expect } from "vitest";
import {
  PyObject,
  getAttr,
  getItem,
  pyFloat,
  pyInt,
  tupleType,
  unwrap,
} from "../../src/index.js";
import { PyOverflowError, PyValueError } from "../../src/runtime/core/errors.js";

describe("cpython-derived float integer methods", () => {
  function isInteger(v: number): boolean {
    const self = pyFloat(v);
    const fn = getAttr(self, "is_integer") as (self: PyObject) => boolean;
    return fn(self);
  }

  function asIntegerRatio(v: number): [bigint, bigint] {
    const self = pyFloat(v);
    const fn = getAttr(self, "as_integer_ratio") as (self: PyObject) => PyObject;
    const tup = fn(self);
    expect(tup.type).toBe(tupleType);
    const toBig = (item: PyObject) => {
      const raw = unwrap(item);
      return typeof raw === "bigint" ? raw : BigInt(raw as number);
    };
    return [toBig(getItem(tup, 0) as PyObject), toBig(getItem(tup, 1) as PyObject)];
  }

  it("is_integer distinguishes integral and fractional finite values", () => {
    expect(isInteger(2)).toBe(true);
    expect(isInteger(2.5)).toBe(false);
    expect(isInteger(-3)).toBe(true);
    expect(isInteger(0)).toBe(true);
  });

  it("is_integer is false for nan and infinity", () => {
    expect(isInteger(Number.NaN)).toBe(false);
    expect(isInteger(Number.POSITIVE_INFINITY)).toBe(false);
    expect(isInteger(Number.NEGATIVE_INFINITY)).toBe(false);
  });

  it("as_integer_ratio returns reduced numerator and denominator", () => {
    expect(asIntegerRatio(2)).toEqual([2n, 1n]);
    expect(asIntegerRatio(2.5)).toEqual([5n, 2n]);
    expect(asIntegerRatio(-3)).toEqual([-3n, 1n]);
    expect(asIntegerRatio(0)).toEqual([0n, 1n]);
    expect(asIntegerRatio(1e10)).toEqual([10_000_000_000n, 1n]);
  });

  it("as_integer_ratio returns bigint components beyond MAX_SAFE_INTEGER", () => {
    expect(asIntegerRatio(0.1)).toEqual([
      3602879701896397n,
      36028797018963968n,
    ]);
  });

  it("as_integer_ratio rejects nan and infinity", () => {
    expect(() => asIntegerRatio(Number.NaN)).toThrow(PyValueError);
    expect(() => asIntegerRatio(Number.NaN)).toThrow(/cannot convert NaN to integer ratio/);
    expect(() => asIntegerRatio(Number.POSITIVE_INFINITY)).toThrow(PyOverflowError);
    expect(() => asIntegerRatio(Number.POSITIVE_INFINITY)).toThrow(
      /cannot convert Infinity to integer ratio/,
    );
  });
});
