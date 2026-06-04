/**
 * CPython: set inplace |=, &=, -=, ^= mutate in place; accept frozenset operands.
 */
import { describe, it, expect } from "vitest";
import {
  contains,
  eq,
  iand,
  instantiate,
  ior,
  isub,
  ixor,
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
      [Slot.hash, () => 64],
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

describe("set inplace ops with frozenset operands", () => {
  it("ior mutates set in place with frozenset rhs", () => {
    const one = pyInt(1);
    const two = pyInt(2);
    const s = pySet([one]);
    const result = ior(s, pyFrozenSet([two])) as PyObject;
    expect(result).toBe(s);
    expect(eq(s, pySet([one, two]))).toBe(true);
  });

  it("iand mutates set in place cross-type", () => {
    const one = pyInt(1);
    const two = pyInt(2);
    const s = pySet([one, two]);
    iand(s, pyFrozenSet([two]));
    expect(eq(s, pySet([two]))).toBe(true);
  });

  it("isub and ixor mutate set in place", () => {
    const one = pyInt(1);
    const two = pyInt(2);
    const s = pySet([one, two]);
    isub(s, pyFrozenSet([two]));
    expect(eq(s, pySet([one]))).toBe(true);

    const t = pySet([one]);
    ixor(t, pySet([two]));
    expect(eq(t, pySet([one, two]))).toBe(true);
    ixor(t, pyFrozenSet([one]));
    expect(eq(t, pySet([two]))).toBe(true);
  });

  it("rejects non-set-like rhs", () => {
    expect(() => ior(pySet([pyInt(1)]), pyInt(2))).toThrow(PyTypeError);
    expect(() => iand(pySet([pyInt(1)]), pyInt(2))).toThrow(PyTypeError);
  });

  it("inplace ops use hash+eq with frozenset operands", () => {
    const [k1, k2] = equalKeyPair();
    const three = pyInt(3);

    const u = pySet([k1]);
    ior(u, pyFrozenSet([k2, three]));
    expect(len(u)).toBe(2);
    expect(contains(u, k1)).toBe(true);
    expect(contains(u, three)).toBe(true);

    const a = pySet([k1, three]);
    iand(a, pyFrozenSet([k2]));
    expect(len(a)).toBe(1);
    expect(contains(a, k1)).toBe(true);

    const d = pySet([k1, three]);
    isub(d, pyFrozenSet([k2]));
    expect(eq(d, pySet([three]))).toBe(true);

    const x = pySet([k1]);
    ixor(x, pyFrozenSet([k2, three]));
    expect(eq(x, pySet([three]))).toBe(true);
    ixor(x, pyFrozenSet([k1]));
    expect(eq(x, pySet([k1, three]))).toBe(true);
  });
});
