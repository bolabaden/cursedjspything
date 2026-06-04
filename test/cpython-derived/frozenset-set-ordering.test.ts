/**
 * CPython: frozenset and set support subset/superset ordering comparisons.
 */
import { describe, it, expect } from "vitest";
import {
  ge,
  gt,
  instantiate,
  le,
  lt,
  makeClass,
  NotImplemented,
  objectType,
  PyObject,
  pyFrozenSet,
  pyInt,
  pySet,
} from "../../src/index.js";
import { Slot } from "../../src/runtime/core/slots.js";
import { PyTypeError } from "../../src/runtime/core/errors.js";

function equalKeyPair(): [PyObject, PyObject] {
  const Key = makeClass({
    name: "Key",
    bases: [objectType],
    dict: new Map<string | symbol, unknown>([
      [Slot.hash, () => 62],
      [
        Slot.eq,
        (_self: PyObject, other: PyObject) => {
          if (other.type.name === "Key") return true;
          return NotImplemented;
        },
      ],
    ]),
  });
  return [instantiate(Key), instantiate(Key)];
}

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

  it("ordering uses hash+eq for subset and superset", () => {
    const [k1, k2] = equalKeyPair();
    const three = pyInt(3);
    expect(le(pyFrozenSet([k1]), pySet([k2, three]))).toBe(true);
    expect(lt(pyFrozenSet([k1]), pySet([k2, three]))).toBe(true);
    expect(le(pySet([k1, three]), pyFrozenSet([k2]))).toBe(false);
    expect(ge(pySet([k2, three]), pyFrozenSet([k1]))).toBe(true);
    expect(gt(pyFrozenSet([k2, three]), pySet([k1]))).toBe(true);
  });
});
