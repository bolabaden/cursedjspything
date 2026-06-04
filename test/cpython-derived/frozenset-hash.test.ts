/**
 * CPython: frozenset is hashable; set is not.
 */
import { describe, it, expect } from "vitest";
import {
  contains,
  hash,
  instantiate,
  makeClass,
  NotImplemented,
  objectType,
  pyFrozenSet,
  pyInt,
  pyList,
  pySet,
  PyObject,
} from "../../src/index.js";
import { Slot } from "../../src/runtime/core/slots.js";
import { PyTypeError } from "../../src/runtime/core/errors.js";

function equalKeyPair(): [PyObject, PyObject] {
  const Key = makeClass({
    name: "Key",
    bases: [objectType],
    dict: new Map<string | symbol, unknown>([
      [Slot.hash, () => 60],
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

function badHashElement(): PyObject {
  const BadHash = makeClass({
    name: "BadHash",
    bases: [objectType],
    dict: new Map([[Slot.hash, () => "nope"]]),
  });
  return instantiate(BadHash);
}

describe("frozenset __hash__", () => {
  it("returns a stable hash for empty frozenset", () => {
    const empty = pyFrozenSet([]);
    expect(hash(empty)).toBe(hash(empty));
  });

  it("is order-independent for the same elements", () => {
    const a = pyFrozenSet([pyInt(1), pyInt(2)]);
    const b = pyFrozenSet([pyInt(2), pyInt(1)]);
    expect(hash(a)).toBe(hash(b));
  });

  it("matches for equal frozensets built separately", () => {
    expect(hash(pyFrozenSet([pyInt(1)]))).toBe(hash(pyFrozenSet([pyInt(1)])));
  });

  it("matches for frozensets with equal-but-distinct elements", () => {
    const [k1, k2] = equalKeyPair();
    expect(hash(pyFrozenSet([k1]))).toBe(hash(pyFrozenSet([k2])));
    const ab = pyFrozenSet([k1, k2]);
    const ba = pyFrozenSet([k2, k1]);
    expect(hash(ab)).toBe(hash(ba));
  });

  it("leaves set unhashable", () => {
    expect(() => hash(pySet([]))).toThrow(PyTypeError);
    expect(() => hash(pySet([]))).toThrow(/unhashable type: 'set'/);
  });

  it("rejects unhashable elements at construction and on contains", () => {
    expect(() => pyFrozenSet([pyList([])])).toThrow(PyTypeError);
    expect(() => pyFrozenSet([pyList([])])).toThrow(/unhashable type: 'list'/);
    const fs = pyFrozenSet([pyInt(1)]);
    expect(() => contains(fs, pyList([]))).toThrow(/unhashable type: 'list'/);
  });

  it("rejects invalid __hash__ at construction and on contains", () => {
    const bad = badHashElement();
    expect(() => pyFrozenSet([bad])).toThrow(
      /__hash__ method should return an integer/,
    );
    const fs = pyFrozenSet([pyInt(1)]);
    expect(() => contains(fs, bad)).toThrow(
      /__hash__ method should return an integer/,
    );
  });
});
