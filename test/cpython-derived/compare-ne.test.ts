/**
 * Ported from CPython Lib/test/test_compare.py (ComparisonSimpleTest, v3.14.0).
 * Source: vendor/cpython/Lib/test/test_compare.py
 */
import { describe, it, expect } from "vitest";
import {
  PyObject,
  makeClass,
  Slot,
  NotImplemented,
  ne,
  eq,
} from "../../src/index.js";

describe("cpython-derived test_compare ne delegation", () => {
  it("ne_defaults: eq True implies ne False (Cmp pattern)", () => {
    const Cmp = makeClass({
      name: "Cmp",
      dict: new Map<string | symbol, unknown>([
        [
          Slot.eq,
          (self: PyObject, other: PyObject) =>
            (self as PyObject & { arg: number }).arg ===
            (other as PyObject & { arg: number }).arg,
        ],
        [
          Slot.ne,
          (self: PyObject, other: PyObject) =>
            (self as PyObject & { arg: number }).arg !==
            (other as PyObject & { arg: number }).arg,
        ],
      ]),
    });
    const mk = (n: number) => {
      const o = new PyObject(Cmp) as PyObject & { arg: number };
      o.arg = n;
      return o;
    };
    const a = mk(1);
    const b = mk(1);
    const c = mk(2);
    expect(eq(a, b)).toBe(true);
    expect(ne(a, b)).toBe(false);
    expect(ne(a, c)).toBe(true);
  });

  it("ne_high_priority: Left.__eq__ then Right.__ne__ when eq is NotImplemented", () => {
    const calls: string[] = [];
    const Left = makeClass({
      name: "Left",
      dict: new Map([
        [
          Slot.eq,
          () => {
            calls.push("Left.__eq__");
            return NotImplemented;
          },
        ],
      ]),
    });
    const Right = makeClass({
      name: "Right",
      dict: new Map([
        [
          Slot.eq,
          () => {
            calls.push("Right.__eq__");
            return NotImplemented;
          },
        ],
        [
          Slot.ne,
          () => {
            calls.push("Right.__ne__");
            return NotImplemented;
          },
        ],
      ]),
    });
    expect(ne(new PyObject(Left), new PyObject(Right))).toBe(true);
    expect(calls).toEqual(["Left.__eq__", "Right.__ne__"]);
  });

  it("ne_low_priority: subclass __ne__ before base __eq__", () => {
    const calls: string[] = [];
    const Base = makeClass({
      name: "Base",
      dict: new Map([
        [
          Slot.eq,
          () => {
            calls.push("Base.__eq__");
            return NotImplemented;
          },
        ],
      ]),
    });
    const Derived = makeClass({
      name: "Derived",
      bases: [Base],
      dict: new Map([
        [
          Slot.eq,
          () => {
            calls.push("Derived.__eq__");
            return NotImplemented;
          },
        ],
        [
          Slot.ne,
          () => {
            calls.push("Derived.__ne__");
            return NotImplemented;
          },
        ],
      ]),
    });
    expect(ne(new PyObject(Base), new PyObject(Derived))).toBe(true);
    expect(calls).toEqual(["Derived.__ne__", "Base.__eq__"]);
  });
});
