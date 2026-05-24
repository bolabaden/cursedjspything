/**
 * Vitest ports of test_richcmp-style Rev / Incomparable fixtures (v3.14.0 patterns).
 * Mirrors golden harness classes in scripts/golden/cases.py.
 * Source reference: vendor/cpython/Lib/test/test_richcmp.py (Tier A)
 */
import { describe, it, expect } from "vitest";
import {
  PyObject,
  makeClass,
  instantiate,
  objectType,
  Slot,
  NotImplemented,
  lt,
  le,
  gt,
  ge,
  eq,
  ne,
  pyInt,
} from "../../src/index.js";
import { PyTypeError } from "../../src/runtime/core/errors.js";

function makeRevType() {
  return makeClass({
    name: "Rev",
    bases: [objectType],
    dict: new Map([[Slot.gt, () => true]]),
  });
}

function makeIncomparableType() {
  return makeClass({
    name: "Incomparable",
    bases: [objectType],
    dict: new Map([
      [Slot.lt, () => NotImplemented],
      [Slot.gt, () => NotImplemented],
    ]),
  });
}

describe("cpython-derived test_richcmp Rev (reflected ordering)", () => {
  const Rev = makeRevType();
  const rev = instantiate(Rev);

  it("int < Rev via reflected __gt__", () => {
    expect(lt(pyInt(1), rev)).toBe(true);
  });

  it("Rev > int via __gt__", () => {
    expect(gt(rev, pyInt(1))).toBe(true);
  });
});

describe("cpython-derived test_richcmp Incomparable (both NotImplemented)", () => {
  const Incomparable = makeIncomparableType();

  const pair = () => {
    const a = instantiate(Incomparable);
    const b = instantiate(Incomparable);
    return { a, b };
  };

  for (const [name, op] of [
    ["lt", lt],
    ["le", le],
    ["gt", gt],
    ["ge", ge],
  ] as const) {
    it(`${name} raises TypeError for two Incomparable instances`, () => {
      const { a, b } = pair();
      expect(() => op(a, b)).toThrow(PyTypeError);
    });
  }

  it("eq uses identity fallback (distinct instances unequal)", () => {
    const { a, b } = pair();
    expect(eq(a, b)).toBe(false);
    expect(ne(a, b)).toBe(true);
  });

  it("eq is true for same instance", () => {
    const a = instantiate(Incomparable);
    expect(eq(a, a)).toBe(true);
    expect(ne(a, a)).toBe(false);
  });

  it("int vs Incomparable ordering raises TypeError", () => {
    const inc = instantiate(Incomparable);
    expect(() => lt(pyInt(1), inc)).toThrow(PyTypeError);
    expect(() => lt(inc, pyInt(1))).toThrow(PyTypeError);
  });
});
