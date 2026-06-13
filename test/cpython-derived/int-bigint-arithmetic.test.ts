/**
 * CPython: bigint-stored int comparison and arithmetic from float.as_integer_ratio().
 * Plan 926 — extends plan 915/917 ratio storage with int↔int and int↔bool parity.
 */
import { describe, it, expect } from "vitest";
import {
  PyObject,
  add,
  sub,
  mul,
  lt,
  le,
  eq,
  ne,
  gt,
  ge,
  pyFloat,
  pyTrue,
  pyFalse,
  repr,
  unwrap,
  getAttr,
  getItem,
} from "../../src/index.js";
import {
  intObjectFromBigInt,
  intType,
  pyIntFromSafeInteger,
} from "../../src/runtime/builtins/int.js";

function ratioComponents(v: number): [PyObject, PyObject] {
  const self = pyFloat(v);
  const fn = getAttr(self, "as_integer_ratio") as (self: PyObject) => PyObject;
  const tup = fn(self);
  return [getItem(tup, 0) as PyObject, getItem(tup, 1) as PyObject];
}

function expectBigInt(obj: PyObject, expected: bigint) {
  expect(unwrap(obj)).toBe(expected);
}

describe("cpython-derived bigint int from as_integer_ratio", () => {
  const [num, den] = ratioComponents(0.1);

  it("repr matches CPython decimal strings", () => {
    expect(repr(num)).toBe("3602879701896397");
    expect(repr(den)).toBe("36028797018963968");
  });

  it("eq compares bigint denominator to intObjectFromBigInt literal", () => {
    const literal = intObjectFromBigInt(36028797018963968n);
    expect(eq(den, literal)).toBe(true);
    expect(eq(literal, den)).toBe(true);
    expect(ne(den, literal)).toBe(false);
  });

  it("eq compares safe-integer numerator to pyIntFromSafeInteger", () => {
    const literal = pyIntFromSafeInteger(3602879701896397);
    expect(eq(num, literal)).toBe(true);
    expect(eq(literal, num)).toBe(true);
  });

  it("ordering places numerator below denominator", () => {
    expect(lt(num, den)).toBe(true);
    expect(le(num, den)).toBe(true);
    expect(gt(den, num)).toBe(true);
    expect(ge(den, num)).toBe(true);
    expect(ne(num, den)).toBe(true);
  });

  it("eq with exact integer float matches denominator", () => {
    expect(eq(den, pyFloat(36028797018963968))).toBe(true);
    expect(eq(pyFloat(36028797018963968), den)).toBe(true);
  });

  it("bool promotion compares zero numerator to False", () => {
    expect(eq(intObjectFromBigInt(0n), pyFalse)).toBe(true);
    expect(eq(pyFalse, intObjectFromBigInt(0n))).toBe(true);
    expect(eq(num, pyTrue)).toBe(false);
  });

  it("add and sub preserve bigint when result exceeds MAX_SAFE_INTEGER", () => {
    const plusOne = add(den, pyIntFromSafeInteger(1)) as PyObject;
    expectBigInt(plusOne, 36028797018963969n);
    expect((plusOne as PyObject).type).toBe(intType);

    const minusOne = sub(den, pyIntFromSafeInteger(1)) as PyObject;
    expectBigInt(minusOne, 36028797018963967n);
  });

  it("mul with small int stays bigint", () => {
    const doubled = mul(den, pyIntFromSafeInteger(2)) as PyObject;
    expectBigInt(doubled, 72057594037927936n);
    expect((doubled as PyObject).type).toBe(intType);
  });
});
