/**
 * CPython: set and frozenset union, intersection, difference, symmetric_difference methods.
 */
import { describe, it, expect } from "vitest";
import {
  PyObject,
  eq,
  getAttr,
  pyFrozenSet,
  pyInt,
  pySet,
} from "../../src/index.js";
import { PyTypeError } from "../../src/runtime/core/errors.js";

type AlgebraMethodFn = (self: PyObject, other: PyObject) => PyObject;

describe("set and frozenset named algebra methods", () => {
  function call(
    self: PyObject,
    name: "union" | "intersection" | "difference" | "symmetric_difference",
    other: PyObject,
  ): PyObject {
    const fn = getAttr(self, name) as AlgebraMethodFn;
    return fn(self, other);
  }

  it("union preserves lhs result type cross-type", () => {
    const one = pyInt(1);
    const two = pyInt(2);
    const froUnion = call(pyFrozenSet([one]), "union", pySet([two]));
    expect(froUnion.type.name).toBe("frozenset");
    expect(eq(froUnion, pyFrozenSet([one, two]))).toBe(true);

    const setUnion = call(pySet([one]), "union", pyFrozenSet([two]));
    expect(setUnion.type.name).toBe("set");
    expect(eq(setUnion, pySet([one, two]))).toBe(true);
  });

  it("intersection and difference cross-type", () => {
    const one = pyInt(1);
    const two = pyInt(2);
    const inter = call(pySet([one, two]), "intersection", pyFrozenSet([two]));
    expect(inter.type.name).toBe("set");
    expect(eq(inter, pySet([two]))).toBe(true);

    const diff = call(pyFrozenSet([one, two]), "difference", pySet([two]));
    expect(diff.type.name).toBe("frozenset");
    expect(eq(diff, pyFrozenSet([one]))).toBe(true);
  });

  it("symmetric_difference cross-type", () => {
    const one = pyInt(1);
    const two = pyInt(2);
    const sym = call(pySet([one]), "symmetric_difference", pyFrozenSet([two]));
    expect(sym.type.name).toBe("set");
    expect(eq(sym, pySet([one, two]))).toBe(true);
  });

  it("rejects non-set-like rhs", () => {
    expect(() => call(pySet([pyInt(1)]), "union", pyInt(2))).toThrow(
      PyTypeError,
    );
    expect(() =>
      call(pyFrozenSet([pyInt(1)]), "intersection", pyInt(2)),
    ).toThrow(PyTypeError);
  });
});
