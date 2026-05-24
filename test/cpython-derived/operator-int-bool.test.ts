/**
 * Vitest ports of CPython int↔bool cross-type cases (bool subclasses int).
 * Source: vendor/cpython/Lib/test/test_operator.py (numeric tower spirit).
 */
import { describe, it, expect } from "vitest";
import {
  PyObject,
  add,
  mul,
  sub,
  lt,
  le,
  eq,
  ne,
  gt,
  ge,
  pyInt,
  pyTrue,
  pyFalse,
  unwrap,
} from "../../src/index.js";
import { intType } from "../../src/runtime/builtins/int.js";

type CompareFn = (a: PyObject, b: PyObject) => unknown;

function checkIntBool(
  op: CompareFn,
  intVal: number,
  boolVal: boolean,
  expected: boolean,
  boolLeft = false,
) {
  const left = boolLeft ? (boolVal ? pyTrue : pyFalse) : pyInt(intVal);
  const right = boolLeft ? pyInt(intVal) : boolVal ? pyTrue : pyFalse;
  expect(op(left, right)).toBe(expected);
}

describe("cpython-derived int/bool comparisons", () => {
  it("eq treats True as 1 and False as 0", () => {
    expect(eq(pyInt(1), pyTrue)).toBe(true);
    expect(eq(pyTrue, pyInt(1))).toBe(true);
    expect(eq(pyInt(0), pyFalse)).toBe(true);
    expect(eq(pyFalse, pyInt(0))).toBe(true);
    expect(eq(pyInt(1), pyFalse)).toBe(false);
  });

  it("ordering uses numeric values", () => {
    checkIntBool(lt, 0, true, true);
    checkIntBool(lt, 1, true, false);
    checkIntBool(lt, 2, true, true, true);
    checkIntBool(le, 1, true, true);
    checkIntBool(gt, 2, true, true);
    checkIntBool(ge, 1, true, true);
    checkIntBool(ne, 1, false, true);
  });
});

describe("cpython-derived int/bool arithmetic", () => {
  it("add int + bool stays int", () => {
    expect(unwrap<number>(add(pyInt(1), pyTrue) as PyObject)).toBe(2);
    expect((add(pyInt(1), pyTrue) as PyObject).type).toBe(intType);
  });

  it("add bool + int via reflected path stays int", () => {
    expect(unwrap<number>(add(pyTrue, pyInt(1)) as PyObject)).toBe(2);
    expect((add(pyTrue, pyInt(1)) as PyObject).type).toBe(intType);
  });

  it("mul int * bool", () => {
    expect(unwrap<number>(mul(pyInt(3), pyTrue) as PyObject)).toBe(3);
  });

  it("sub int - bool", () => {
    expect(unwrap<number>(sub(pyInt(2), pyTrue) as PyObject)).toBe(1);
    expect(unwrap<number>(sub(pyTrue, pyInt(1)) as PyObject)).toBe(0);
  });
});
