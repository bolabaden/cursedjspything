/**
 * CPython: bigint-stored int comparison and arithmetic from float.as_integer_ratio().
 * Plan 926/927/928 — extends plan 915/917 ratio storage with int↔int and int↔bool parity.
 */
import { describe, it, expect } from "vitest";
import {
  PyObject,
  add,
  sub,
  mul,
  floordiv,
  mod,
  divmod,
  pow,
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
  PyZeroDivisionError,
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

function expectIntValue(obj: PyObject, expected: number | bigint) {
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

  it("floordiv and mod on bigint denominator match CPython", () => {
    expectBigInt(floordiv(den, pyIntFromSafeInteger(2)) as PyObject, 18014398509481984n);
    expectIntValue(mod(den, pyIntFromSafeInteger(3)) as PyObject, 2);
    expectBigInt(floordiv(den, pyTrue) as PyObject, 36028797018963968n);
    expectIntValue(mod(den, pyTrue) as PyObject, 0);
  });

  it("divmod on bigint operands matches CPython", () => {
    const pair = divmod(den, num) as PyObject;
    expectIntValue(getItem(pair, 0) as PyObject, 9);
    expectIntValue(getItem(pair, 1) as PyObject, 3602879701896395);

    const byOne = divmod(den, pyTrue) as PyObject;
    expectBigInt(getItem(byOne, 0) as PyObject, 36028797018963968n);
    expectIntValue(getItem(byOne, 1) as PyObject, 0);
  });

  it("negative bigint floor division uses Python semantics", () => {
    const negDen = sub(pyIntFromSafeInteger(0), den) as PyObject;
    expectBigInt(floordiv(negDen, pyIntFromSafeInteger(3)) as PyObject, -12009599006321323n);
    expectIntValue(mod(negDen, pyIntFromSafeInteger(3)) as PyObject, 1);

    const pair = divmod(negDen, pyIntFromSafeInteger(3)) as PyObject;
    expectBigInt(getItem(pair, 0) as PyObject, -12009599006321323n);
    expectIntValue(getItem(pair, 1) as PyObject, 1);
  });

  it("zero divisor raises ZeroDivisionError", () => {
    expect(() => mod(den, pyFalse)).toThrow(PyZeroDivisionError);
    expect(() => floordiv(den, pyFalse)).toThrow(PyZeroDivisionError);
    expect(() => divmod(den, pyFalse)).toThrow(PyZeroDivisionError);
  });

  it("pow on bigint operands matches CPython", () => {
    expectBigInt(pow(den, pyIntFromSafeInteger(2)) as PyObject, 1298074214633706907132624082305024n);
    expectIntValue(pow(den, pyIntFromSafeInteger(2), pyIntFromSafeInteger(7)) as PyObject, 4);
    expectIntValue(pow(den, pyIntFromSafeInteger(2), pyIntFromSafeInteger(1000)) as PyObject, 24);
    expectIntValue(pow(pyIntFromSafeInteger(2), pyIntFromSafeInteger(-1), pyIntFromSafeInteger(7)) as PyObject, 4);
    expectBigInt(pow(den, pyTrue) as PyObject, 36028797018963968n);
    expectIntValue(pow(den, pyFalse) as PyObject, 1);
    expectBigInt(
      pow(num, pyIntFromSafeInteger(3)) as PyObject,
      46768052394588901170963202449162931770298562773n,
    );
    expectIntValue(pow(den, pyIntFromSafeInteger(2), num) as PyObject, 4);
  });

  it("negative bigint exponent promotes to float", () => {
    const result = pow(den, pyIntFromSafeInteger(-1)) as PyObject;
    expect(result.type.name).toBe("float");
    expect(unwrap(result)).toBeCloseTo(2.7755575615628914e-17, 31);
  });

  it("zero to negative power raises ZeroDivisionError", () => {
    expect(() => pow(pyIntFromSafeInteger(2), pyIntFromSafeInteger(3), pyIntFromSafeInteger(0))).toThrow(
      /pow\(\) 3rd argument cannot be 0/,
    );
    expect(() => pow(intObjectFromBigInt(0n), pyIntFromSafeInteger(-1))).toThrow(
      PyZeroDivisionError,
    );
    expect(() => pow(intObjectFromBigInt(0n), pyIntFromSafeInteger(-1))).toThrow(
      /zero to a negative power/,
    );
  });
});
