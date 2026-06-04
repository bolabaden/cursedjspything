/**
 * CPython: set/frozenset membership uses hash + equality, not JS identity.
 */
import { describe, it, expect } from "vitest";
import {
  contains,
  getAttr,
  iand,
  instantiate,
  isub,
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
import { PyKeyError } from "../../src/runtime/core/errors.js";

function equalKeyPair(): [PyObject, PyObject] {
  const Key = makeClass({
    name: "Key",
    bases: [objectType],
    dict: new Map<string | symbol, unknown>([
      [Slot.hash, () => 99],
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

type SetMutFn = (self: PyObject, ...args: unknown[]) => unknown;

describe("set/frozenset hash+eq membership", () => {
  it("pySet and pyFrozenSet dedupe equal keys on construction", () => {
    const [k1, k2] = equalKeyPair();
    expect(len(pySet([k1, k2]))).toBe(1);
    expect(len(pyFrozenSet([k1, k2]))).toBe(1);
  });

  it("__contains__ matches equal but distinct keys", () => {
    const [k1, k2] = equalKeyPair();
    const s = pySet([k1]);
    expect(contains(s, k2)).toBe(true);
    expect(contains(pyFrozenSet([k1]), k2)).toBe(true);
  });

  it("add does not duplicate equal keys", () => {
    const [k1, k2] = equalKeyPair();
    const s = pySet([]);
    const add = getAttr(s, "add") as SetMutFn;
    add(s, k1);
    add(s, k2);
    expect(len(s)).toBe(1);
  });

  it("remove and discard find members by equality", () => {
    const [k1, k2] = equalKeyPair();
    const s = pySet([k1]);
    const remove = getAttr(s, "remove") as SetMutFn;
    const discard = getAttr(s, "discard") as SetMutFn;

    remove(s, k2);
    expect(len(s)).toBe(0);

    const s2 = pySet([k1]);
    discard(s2, k2);
    expect(len(s2)).toBe(0);
  });

  it("remove raises KeyError only when no equal member", () => {
    const [k1] = equalKeyPair();
    const s = pySet([k1]);
    const remove = getAttr(s, "remove") as SetMutFn;
    expect(() => remove(s, pyInt(0))).toThrow(PyKeyError);
  });

  it("inplace &= and -= use hash+eq membership", () => {
    const [k1, k2] = equalKeyPair();
    const other = pySet([k2]);
    const a = pySet([k1, pyInt(9)]);
    iand(a, other);
    expect(len(a)).toBe(1);
    expect(contains(a, k1)).toBe(true);

    const b = pySet([k1, pyInt(9)]);
    isub(b, other);
    expect(len(b)).toBe(1);
    expect(contains(b, pyInt(9))).toBe(true);
  });
});
