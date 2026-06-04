/**
 * CPython: set and frozenset issubset, issuperset, isdisjoint methods.
 */
import { describe, it, expect } from "vitest";
import {
  getAttr,
  instantiate,
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
      [Slot.hash, () => 61],
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

type SetMethodFn = (self: PyObject, other: PyObject) => unknown;

describe("set and frozenset subset methods", () => {
  function call(
    self: PyObject,
    name: "issubset" | "issuperset" | "isdisjoint",
    other: PyObject,
  ): unknown {
    const fn = getAttr(self, name) as SetMethodFn;
    return fn(self, other);
  }

  it("issubset and issuperset cross-type", () => {
    const one = pyInt(1);
    const two = pyInt(2);
    expect(call(pyFrozenSet([one]), "issubset", pySet([one, two]))).toBe(true);
    expect(call(pySet([one, two]), "issuperset", pyFrozenSet([one]))).toBe(
      true,
    );
    expect(call(pyFrozenSet([one, two]), "issubset", pySet([one]))).toBe(false);
  });

  it("isdisjoint detects overlap", () => {
    const one = pyInt(1);
    const two = pyInt(2);
    expect(call(pyFrozenSet([one]), "isdisjoint", pySet([two]))).toBe(true);
    expect(call(pySet([one]), "isdisjoint", pyFrozenSet([one, two]))).toBe(
      false,
    );
    expect(call(pyFrozenSet([]), "isdisjoint", pySet([]))).toBe(true);
  });

  it("rejects non-set-like rhs", () => {
    expect(() => call(pyFrozenSet([pyInt(1)]), "issubset", pyInt(2))).toThrow(
      PyTypeError,
    );
    expect(() => call(pySet([pyInt(1)]), "isdisjoint", pyInt(2))).toThrow(
      PyTypeError,
    );
  });

  it("issubset and issuperset use hash+eq membership", () => {
    const [k1, k2] = equalKeyPair();
    const three = pyInt(3);
    expect(call(pyFrozenSet([k1]), "issubset", pySet([k2, three]))).toBe(true);
    expect(call(pySet([k2, three]), "issuperset", pyFrozenSet([k1]))).toBe(
      true,
    );
    expect(call(pySet([k1, three]), "issubset", pyFrozenSet([k2]))).toBe(false);
  });

  it("isdisjoint is false when equal keys overlap", () => {
    const [k1, k2] = equalKeyPair();
    expect(call(pySet([k1]), "isdisjoint", pyFrozenSet([k2]))).toBe(false);
    expect(call(pyFrozenSet([k1]), "isdisjoint", pySet([pyInt(9)]))).toBe(true);
  });
});
