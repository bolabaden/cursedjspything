/**
 * Thin Vitest ports of CPython Lib/test/test_operator.py OperatorTestCase
 * int/float comparison and arithmetic cases (v3.14.0).
 * Source: vendor/cpython/Lib/test/test_operator.py
 */
import { describe, it, expect } from "vitest";
import {
  PyObject,
  add,
  mul,
  lt,
  le,
  eq,
  ne,
  gt,
  ge,
  pyInt,
  pyFloat,
  unwrap,
} from "../../src/index.js";
import { intType } from "../../src/runtime/builtins/int.js";
import { floatType } from "../../src/runtime/builtins/float.js";

type CompareFn = (a: PyObject, b: PyObject) => unknown;

/** Mirrors test_operator check tables for int vs int and int vs float. */
function checkCompare(
  op: CompareFn,
  a: number,
  b: number,
  expected: boolean,
  useFloatRhs = false,
) {
  const left = pyInt(a);
  const right = useFloatRhs ? pyFloat(b) : pyInt(b);
  expect(op(left, right)).toBe(expected);
}

describe("cpython-derived test_operator int/float comparisons", () => {
  it("test_lt matrix", () => {
    checkCompare(lt, 1, 0, false);
    checkCompare(lt, 1, 0, false, true);
    checkCompare(lt, 1, 1, false);
    checkCompare(lt, 1, 1, false, true);
    checkCompare(lt, 1, 2, true);
    checkCompare(lt, 1, 2, true, true);
  });

  it("test_le matrix", () => {
    checkCompare(le, 1, 0, false);
    checkCompare(le, 1, 0, false, true);
    checkCompare(le, 1, 1, true);
    checkCompare(le, 1, 1, true, true);
    checkCompare(le, 1, 2, true);
    checkCompare(le, 1, 2, true, true);
  });

  it("test_eq matrix", () => {
    checkCompare(eq, 1, 0, false);
    checkCompare(eq, 1, 0, false, true);
    checkCompare(eq, 1, 1, true);
    checkCompare(eq, 1, 1, true, true);
    checkCompare(eq, 1, 2, false);
    checkCompare(eq, 1, 2, false, true);
  });

  it("test_ne matrix", () => {
    checkCompare(ne, 1, 0, true);
    checkCompare(ne, 1, 0, true, true);
    checkCompare(ne, 1, 1, false);
    checkCompare(ne, 1, 1, false, true);
    checkCompare(ne, 1, 2, true);
    checkCompare(ne, 1, 2, true, true);
  });

  it("test_ge matrix", () => {
    checkCompare(ge, 1, 0, true);
    checkCompare(ge, 1, 0, true, true);
    checkCompare(ge, 1, 1, true);
    checkCompare(ge, 1, 1, true, true);
    checkCompare(ge, 1, 2, false);
    checkCompare(ge, 1, 2, false, true);
  });

  it("test_gt matrix", () => {
    checkCompare(gt, 1, 0, true);
    checkCompare(gt, 1, 0, true, true);
    checkCompare(gt, 1, 1, false);
    checkCompare(gt, 1, 1, false, true);
    checkCompare(gt, 1, 2, false);
    checkCompare(gt, 1, 2, false, true);
  });
});

describe("cpython-derived test_operator int/float arithmetic", () => {
  it("test_add int + int stays int", () => {
    const result = add(pyInt(3), pyInt(4)) as PyObject;
    expect(result.type).toBe(intType);
    expect(unwrap<number>(result)).toBe(7);
  });

  it("test_add int + float promotes to float", () => {
    const result = add(pyInt(3), pyFloat(4)) as PyObject;
    expect(result.type).toBe(floatType);
    expect(unwrap<number>(result)).toBe(7);
  });

  it("test_mul int * float promotes to float", () => {
    const result = mul(pyInt(3), pyFloat(4)) as PyObject;
    expect(result.type).toBe(floatType);
    expect(unwrap<number>(result)).toBe(12);
  });
});
