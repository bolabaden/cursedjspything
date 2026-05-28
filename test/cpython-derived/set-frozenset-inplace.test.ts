/**
 * CPython: set inplace |=, &=, -=, ^= mutate in place; accept frozenset operands.
 */
import { describe, it, expect } from "vitest";
import {
  PyObject,
  eq,
  iand,
  ior,
  isub,
  ixor,
  pyFrozenSet,
  pyInt,
  pySet,
} from "../../src/index.js";
import { PyTypeError } from "../../src/runtime/core/errors.js";

describe("set inplace ops with frozenset operands", () => {
  it("ior mutates set in place with frozenset rhs", () => {
    const one = pyInt(1);
    const two = pyInt(2);
    const s = pySet([one]);
    const result = ior(s, pyFrozenSet([two])) as PyObject;
    expect(result).toBe(s);
    expect(eq(s, pySet([one, two]))).toBe(true);
  });

  it("iand mutates set in place cross-type", () => {
    const one = pyInt(1);
    const two = pyInt(2);
    const s = pySet([one, two]);
    iand(s, pyFrozenSet([two]));
    expect(eq(s, pySet([two]))).toBe(true);
  });

  it("isub and ixor mutate set in place", () => {
    const one = pyInt(1);
    const two = pyInt(2);
    const s = pySet([one, two]);
    isub(s, pyFrozenSet([two]));
    expect(eq(s, pySet([one]))).toBe(true);

    const t = pySet([one]);
    ixor(t, pySet([two]));
    expect(eq(t, pySet([one, two]))).toBe(true);
    ixor(t, pyFrozenSet([one]));
    expect(eq(t, pySet([two]))).toBe(true);
  });

  it("rejects non-set-like rhs", () => {
    expect(() => ior(pySet([pyInt(1)]), pyInt(2))).toThrow(PyTypeError);
    expect(() => iand(pySet([pyInt(1)]), pyInt(2))).toThrow(PyTypeError);
  });
});
