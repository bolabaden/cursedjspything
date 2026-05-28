/**
 * CPython: set and frozenset issubset, issuperset, isdisjoint methods.
 */
import { describe, it, expect } from "vitest";
import {
  PyObject,
  getAttr,
  pyFrozenSet,
  pyInt,
  pySet,
} from "../../src/index.js";
import { PyTypeError } from "../../src/runtime/core/errors.js";

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
});
