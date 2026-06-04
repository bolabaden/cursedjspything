/**
 * CPython: set and frozenset union, intersection, difference, symmetric_difference methods.
 */
import { describe, it, expect } from "vitest";
import {
  eq,
  getAttr,
  instantiate,
  len,
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
      [Slot.hash, () => 63],
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

  it("named algebra uses hash+eq with cross-type lhs", () => {
    const [k1, k2] = equalKeyPair();
    const three = pyInt(3);

    const froUnion = call(pyFrozenSet([k1]), "union", pySet([k2]));
    expect(froUnion.type.name).toBe("frozenset");
    expect(len(froUnion)).toBe(1);

    const setUnion = call(pySet([k1]), "union", pyFrozenSet([k2, three]));
    expect(setUnion.type.name).toBe("set");
    expect(len(setUnion)).toBe(2);
    expect(eq(setUnion, pySet([k1, three]))).toBe(true);

    const inter = call(pyFrozenSet([k1, three]), "intersection", pySet([k2]));
    expect(inter.type.name).toBe("frozenset");
    expect(eq(inter, pyFrozenSet([k1]))).toBe(true);

    const diff = call(pySet([k1, three]), "difference", pyFrozenSet([k2]));
    expect(diff.type.name).toBe("set");
    expect(eq(diff, pySet([three]))).toBe(true);

    const sym = call(
      pyFrozenSet([k1]),
      "symmetric_difference",
      pySet([k2, three]),
    );
    expect(sym.type.name).toBe("frozenset");
    expect(eq(sym, pyFrozenSet([three]))).toBe(true);
  });
});
