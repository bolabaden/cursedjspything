/**
 * CPython: tuple is hashable; empty tuple uses fixed seed; order matters.
 */
import { describe, it, expect } from "vitest";
import {
  hash,
  instantiate,
  makeClass,
  objectType,
  pyInt,
  pyList,
  pyNone,
  pyTuple,
  PyObject,
} from "../../src/index.js";
import { Slot } from "../../src/runtime/core/slots.js";
import { PyTypeError } from "../../src/runtime/core/errors.js";

function badHashElement(): PyObject {
  const BadHash = makeClass({
    name: "BadHash",
    bases: [objectType],
    dict: new Map([[Slot.hash, () => "nope"]]),
  });
  return instantiate(BadHash);
}

describe("tuple __hash__", () => {
  it("empty tuple hash is stable across instances", () => {
    const a = pyTuple([]);
    const b = pyTuple([]);
    expect(hash(a)).toBe(hash(b));
    expect(hash(a)).toBe(hash(a));
  });

  it("empty tuple hash matches None sentinel seed", () => {
    expect(hash(pyTuple([]))).toBe(hash(pyNone));
  });

  it("returns a stable hash for the same object", () => {
    const t = pyTuple([pyInt(1), pyInt(2)]);
    expect(hash(t)).toBe(hash(t));
  });

  it("matches for equal tuples built separately", () => {
    const a = pyTuple([pyInt(1), pyInt(2)]);
    const b = pyTuple([pyInt(1), pyInt(2)]);
    expect(hash(a)).toBe(hash(b));
  });

  it("differs for different tuples", () => {
    expect(hash(pyTuple([pyInt(1)]))).not.toBe(hash(pyTuple([pyInt(2)])));
  });

  it("is order-dependent", () => {
    const ab = pyTuple([pyInt(1), pyInt(2)]);
    const ba = pyTuple([pyInt(2), pyInt(1)]);
    expect(hash(ab)).not.toBe(hash(ba));
  });

  it("rejects unhashable elements when hashing tuple", () => {
    expect(() => hash(pyTuple([pyList([])]))).toThrow(PyTypeError);
    expect(() => hash(pyTuple([pyList([])]))).toThrow(/unhashable type: 'list'/);
  });

  it("rejects invalid __hash__ elements when hashing tuple", () => {
    expect(() => hash(pyTuple([badHashElement()]))).toThrow(PyTypeError);
    expect(() => hash(pyTuple([badHashElement()]))).toThrow(
      /__hash__ method should return an integer/,
    );
  });
});
