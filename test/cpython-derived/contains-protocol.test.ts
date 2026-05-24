/**
 * Vitest ports of CPython Lib/test/test_contains.py (thin cases, v3.14.0).
 * Golden harness remains authoritative for cross-version JSON parity.
 * Source: vendor/cpython/Lib/test/test_contains.py
 */
import { describe, it, expect } from "vitest";
import {
  PyObject,
  makeClass,
  objectType,
  Slot,
  contains,
  eq,
  pyInt,
  pyStr,
  pyList,
  pyTuple,
  PyTypeError,
} from "../../src/index.js";

type WithEl = PyObject & { el: unknown };

function baseSet(el: unknown): WithEl {
  const BaseSet = makeClass({
    name: "base_set",
    bases: [objectType],
    dict: new Map(),
  });
  const o = new PyObject(BaseSet) as WithEl;
  o.el = el;
  return o;
}

describe("cpython-derived test_contains protocol", () => {
  it("common: myset __contains__ and seq __getitem__ fallback", () => {
    const BaseSet = makeClass({
      name: "base_set",
      bases: [objectType],
      dict: new Map(),
    });
    const MySet = makeClass({
      name: "myset",
      bases: [BaseSet],
      dict: new Map([
        [
          Slot.contains,
          (self: PyObject, el: unknown) => {
            const sel = (self as WithEl).el;
            if (sel instanceof PyObject && el instanceof PyObject) {
              return eq(sel, el);
            }
            return sel === el;
          },
        ],
      ]),
    });
    const Seq = makeClass({
      name: "seq",
      bases: [BaseSet],
      dict: new Map([
        [
          Slot.getitem,
          (self: PyObject, n: unknown) => {
            const idx =
              typeof n === "number"
                ? n
                : n instanceof PyObject
                  ? (n as PyObject & { value?: number }).value ?? 0
                  : 0;
            if (idx !== 0) throw new Error("IndexError");
            return (self as WithEl).el;
          },
        ],
      ]),
    });

    const b = new PyObject(MySet) as WithEl;
    b.el = pyInt(1);
    const c = new PyObject(Seq) as WithEl;
    c.el = pyInt(1);

    expect(contains(b, pyInt(1))).toBe(true);
    expect(contains(b, pyInt(0))).toBe(false);
    expect(contains(c, pyInt(1))).toBe(true);
    expect(contains(c, pyInt(0))).toBe(false);
  });

  it("common: non-container base_set raises TypeError", () => {
    const a = baseSet(pyInt(1));
    expect(() => contains(a, pyInt(1))).toThrow(PyTypeError);
  });

  it("common: str substring membership", () => {
    expect(contains(pyStr("abc"), pyStr("c"))).toBe(true);
    expect(contains(pyStr("abc"), pyStr("d"))).toBe(false);
    expect(contains(pyStr(""), pyStr(""))).toBe(true);
    expect(contains(pyStr("abc"), pyStr(""))).toBe(true);
  });

  it("builtin_sequence_types: list and tuple int membership", () => {
    const nums = Array.from({ length: 10 }, (_, i) => pyInt(i));
    const lst = pyList(nums);
    for (let i = 0; i < 10; i++) {
      expect(contains(lst, pyInt(i))).toBe(true);
    }
    expect(contains(lst, pyInt(16))).toBe(false);
    expect(contains(lst, lst)).toBe(false);

    const tup = pyTuple(nums);
    for (let i = 0; i < 10; i++) {
      expect(contains(tup, pyInt(i))).toBe(true);
    }
    expect(contains(tup, pyInt(16))).toBe(false);
    expect(contains(tup, tup)).toBe(false);
  });

  it("block_fallback: __contains__ = None prevents iteration fallback", () => {
    const ByContains = makeClass({
      name: "ByContains",
      dict: new Map([[Slot.contains, () => false]]),
    });
    const BlockContains = makeClass({
      name: "BlockContains",
      bases: [ByContains],
      dict: new Map([
        [Slot.contains, null],
        [
          Slot.iter,
          () => {
            const It = makeClass({
              name: "empty_it",
              dict: new Map([
                [
                  Slot.next,
                  () => {
                    throw new Error("should not iterate");
                  },
                ],
              ]),
            });
            return new PyObject(It);
          },
        ],
      ]),
    });

    const c = new PyObject(ByContains);
    const bc = new PyObject(BlockContains);
    expect(contains(c, pyInt(0))).toBe(false);
    expect(() => contains(bc, pyInt(0))).toThrow(PyTypeError);
  });
});
