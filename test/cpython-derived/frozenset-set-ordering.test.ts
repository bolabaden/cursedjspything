/**
 * CPython: frozenset and set support subset/superset ordering comparisons.
 */
import { describe, it, expect } from "vitest";
import {
  ge,
  gt,
  le,
  lt,
  pyFrozenSet,
  pyInt,
  pySet,
} from "../../src/index.js";
import { PyTypeError } from "../../src/runtime/core/errors.js";

describe("frozenset and set ordering comparisons", () => {
  it("frozenset <= frozenset for subset and equality", () => {
    const one = pyInt(1);
    const two = pyInt(2);
    expect(le(pyFrozenSet([one]), pyFrozenSet([one, two]))).toBe(true);
    expect(le(pyFrozenSet([one, two]), pyFrozenSet([one, two]))).toBe(true);
    expect(le(pyFrozenSet([one, two]), pyFrozenSet([one]))).toBe(false);
  });

  it("frozenset < frozenset for proper subset", () => {
    const one = pyInt(1);
    const two = pyInt(2);
    expect(lt(pyFrozenSet([one]), pyFrozenSet([one, two]))).toBe(true);
    expect(lt(pyFrozenSet([one, two]), pyFrozenSet([one, two]))).toBe(false);
  });

  it("frozenset <= set and set <= frozenset cross-type", () => {
    const one = pyInt(1);
    const two = pyInt(2);
    expect(le(pyFrozenSet([one]), pySet([one, two]))).toBe(true);
    expect(le(pySet([one]), pyFrozenSet([one, two]))).toBe(true);
  });

  it("frozenset >= and > frozenset and cross-type", () => {
    const one = pyInt(1);
    const two = pyInt(2);
    expect(ge(pyFrozenSet([one, two]), pyFrozenSet([one]))).toBe(true);
    expect(gt(pyFrozenSet([one, two]), pyFrozenSet([one]))).toBe(true);
    expect(ge(pySet([one, two]), pyFrozenSet([one]))).toBe(true);
    expect(gt(pyFrozenSet([one, two]), pySet([one]))).toBe(true);
  });

  it("rejects non-set-like rhs", () => {
    expect(() => lt(pyFrozenSet([pyInt(1)]), pyInt(2))).toThrow(PyTypeError);
    expect(() => le(pySet([pyInt(1)]), pyInt(2))).toThrow(PyTypeError);
  });
});
