/**
 * CPython: set intersection_update, difference_update, symmetric_difference_update.
 */
import { describe, it, expect } from "vitest";
import {
  contains,
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
  pyList,
  pySet,
} from "../../src/index.js";
import { Slot } from "../../src/runtime/core/slots.js";
import { PyTypeError } from "../../src/runtime/core/errors.js";

type UpdateMethodFn = (self: PyObject, other: unknown) => undefined;

function equalKeyPair(): [PyObject, PyObject] {
  const Key = makeClass({
    name: "Key",
    bases: [objectType],
    dict: new Map<string | symbol, unknown>([
      [Slot.hash, () => 55],
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

describe("set named inplace update methods", () => {
  function call(
    self: PyObject,
    name:
      | "intersection_update"
      | "difference_update"
      | "symmetric_difference_update",
    other: unknown,
  ): void {
    const fn = getAttr(self, name) as UpdateMethodFn;
    fn(self, other);
  }

  it("intersection_update mutates in place with set-like or iterable", () => {
    const one = pyInt(1);
    const two = pyInt(2);
    const three = pyInt(3);
    const s = pySet([one, two, three]);
    call(s, "intersection_update", pyFrozenSet([two, pyInt(99)]));
    expect(eq(s, pySet([two]))).toBe(true);

    const t = pySet([one, two]);
    call(t, "intersection_update", pyList([two]));
    expect(eq(t, pySet([two]))).toBe(true);
  });

  it("difference_update removes members in operand", () => {
    const one = pyInt(1);
    const two = pyInt(2);
    const s = pySet([one, two]);
    call(s, "difference_update", pyFrozenSet([two]));
    expect(eq(s, pySet([one]))).toBe(true);
  });

  it("symmetric_difference_update toggles membership", () => {
    const one = pyInt(1);
    const two = pyInt(2);
    const s = pySet([one]);
    call(s, "symmetric_difference_update", pySet([two]));
    expect(eq(s, pySet([one, two]))).toBe(true);
    call(s, "symmetric_difference_update", pyFrozenSet([one]));
    expect(eq(s, pySet([two]))).toBe(true);
  });

  it("intersection_update uses hash+eq membership", () => {
    const [k1, k2] = equalKeyPair();
    const three = pyInt(3);
    const s = pySet([k1, three]);
    call(s, "intersection_update", pySet([k2]));
    expect(len(s)).toBe(1);
    expect(contains(s, k1)).toBe(true);
  });

  it("difference_update removes equal-but-distinct keys", () => {
    const [k1, k2] = equalKeyPair();
    const three = pyInt(3);
    const s = pySet([k1, three]);
    call(s, "difference_update", pySet([k2]));
    expect(eq(s, pySet([three]))).toBe(true);
  });

  it("rejects non-iterable operand", () => {
    expect(() =>
      call(pySet([]), "intersection_update", pyInt(1)),
    ).toThrow(PyTypeError);
    expect(() =>
      call(pySet([]), "intersection_update", pyInt(1)),
    ).toThrow(/intersection_update/);
  });
});
