/**
 * Ported from CPython Lib/test/test_richcmp.py (NumberTest, v3.14.0).
 * Source: vendor/cpython/Lib/test/test_richcmp.py
 *
 * These are Vitest rewrites of applicable unittest methods — not a runner
 * for CPython's test file. Golden harness remains authoritative for
 * cross-runtime JSON parity.
 */
import { describe, it, expect } from "vitest";
import {
  PyObject,
  PyType,
  makeClass,
  Slot,
  eq,
  lt,
  le,
  gt,
  ge,
  ne,
  pyInt,
  unwrap,
} from "../../src/index.js";
import { setNative, nativeVal } from "../../src/runtime/builtins/native.js";

/** Mirrors test_richcmp.Number */
function makeNumberType() {
  return makeClass({
    name: "Number",
    dict: new Map<string | symbol, unknown>([
      [
        Slot.lt,
        (self: PyObject, other: PyObject) =>
          nativeVal<number>(self) < unwrapNumber(other),
      ],
      [
        Slot.le,
        (self: PyObject, other: PyObject) =>
          nativeVal<number>(self) <= unwrapNumber(other),
      ],
      [
        Slot.eq,
        (self: PyObject, other: PyObject) =>
          nativeVal<number>(self) === unwrapNumber(other),
      ],
      [
        Slot.ne,
        (self: PyObject, other: PyObject) =>
          nativeVal<number>(self) !== unwrapNumber(other),
      ],
      [
        Slot.gt,
        (self: PyObject, other: PyObject) =>
          nativeVal<number>(self) > unwrapNumber(other),
      ],
      [
        Slot.ge,
        (self: PyObject, other: PyObject) =>
          nativeVal<number>(self) >= unwrapNumber(other),
      ],
    ]),
  });
}

function unwrapNumber(other: PyObject): number {
  if (other.type.name === "int") return unwrap<number>(other);
  return nativeVal<number>(other);
}

function number(type: PyType, x: number): PyObject {
  const o = new PyObject(type);
  setNative(o, x);
  return o;
}

/** NumberTest.checkvalue — subset from test_richcmp.py */
describe("cpython-derived test_richcmp NumberTest", () => {
  const NumberType = makeNumberType();

  const checkvalue = (
    op: (a: PyObject, b: PyObject) => unknown,
    a: number,
    b: number,
    exp: boolean,
  ) => {
    expect(op(number(NumberType, a), number(NumberType, b))).toBe(exp);
    expect(op(pyInt(a), number(NumberType, b))).toBe(exp);
    expect(op(number(NumberType, a), pyInt(b))).toBe(exp);
  };

  it("checkvalue 0,0 (test_values)", () => {
    checkvalue(lt, 0, 0, false);
    checkvalue(le, 0, 0, true);
    checkvalue(eq, 0, 0, true);
    checkvalue(ne, 0, 0, false);
    checkvalue(gt, 0, 0, false);
    checkvalue(ge, 0, 0, true);
  });

  it("checkvalue 0,1 (test_values)", () => {
    checkvalue(lt, 0, 1, true);
    checkvalue(le, 0, 1, true);
    checkvalue(eq, 0, 1, false);
    checkvalue(ne, 0, 1, true);
    checkvalue(gt, 0, 1, false);
    checkvalue(ge, 0, 1, false);
  });

  it("checkvalue 1,0 (test_values)", () => {
    checkvalue(lt, 1, 0, false);
    checkvalue(le, 1, 0, false);
    checkvalue(eq, 1, 0, false);
    checkvalue(ne, 1, 0, true);
    checkvalue(gt, 1, 0, true);
    checkvalue(ge, 1, 0, true);
  });
});
