/**
 * CPython: set/frozenset algebra uses hash+eq membership (plan 592).
 */
import { describe, it, expect } from "vitest";
import {
  bitwiseAnd,
  bitwiseOr,
  bitwiseXor,
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
  sub,
} from "../../src/index.js";
import { Slot } from "../../src/runtime/core/slots.js";

function equalKeyPair(): [PyObject, PyObject] {
  const Key = makeClass({
    name: "Key",
    bases: [objectType],
    dict: new Map<string | symbol, unknown>([
      [Slot.hash, () => 77],
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

type SetMethod = (self: PyObject, other: PyObject) => PyObject;

describe("set/frozenset algebra hash+eq membership", () => {
  it("union dedupes equal keys (| and union)", () => {
    const [k1, k2] = equalKeyPair();
    const u = bitwiseOr(pySet([k1]), pySet([k2])) as PyObject;
    expect(len(u)).toBe(1);

    const fs = bitwiseOr(pyFrozenSet([k1]), pyFrozenSet([k2])) as PyObject;
    expect(len(fs)).toBe(1);

    const named = getAttr(pySet([k1]), "union") as SetMethod;
    expect(len(named(pySet([k1]), pySet([k2])))).toBe(1);
  });

  it("intersection finds equal keys (& and intersection)", () => {
    const [k1, k2] = equalKeyPair();
    const three = pyInt(3);
    const a = pySet([k1, three]);
    const b = pySet([k2]);

    const inter = bitwiseAnd(a, b) as PyObject;
    expect(len(inter)).toBe(1);
    expect(eq(inter, pySet([k1]))).toBe(true);

    const named = getAttr(a, "intersection") as SetMethod;
    expect(len(named(a, b))).toBe(1);
  });

  it("difference and symmetric_difference use hash+eq", () => {
    const [k1, k2] = equalKeyPair();
    const three = pyInt(3);
    const a = pySet([k1, three]);
    const b = pySet([k2]);

    const diff = sub(a, b) as PyObject;
    expect(eq(diff, pySet([three]))).toBe(true);

    const sym = bitwiseXor(pySet([k1]), pySet([k2])) as PyObject;
    expect(len(sym)).toBe(0);

    const symMixed = bitwiseXor(a, b) as PyObject;
    expect(eq(symMixed, pySet([three]))).toBe(true);

    const namedDiff = getAttr(a, "difference") as SetMethod;
    expect(eq(namedDiff(a, b), pySet([three]))).toBe(true);

    const namedSym = getAttr(a, "symmetric_difference") as SetMethod;
    expect(eq(namedSym(a, b), pySet([three]))).toBe(true);
  });
});
