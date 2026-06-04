/**
 * CPython: tuple.__eq__ uses rich eq() per element (plan 622).
 */
import { describe, it, expect } from "vitest";
import {
  contains,
  eq,
  instantiate,
  makeClass,
  NotImplemented,
  objectType,
  PyObject,
  pyInt,
  pyTuple,
} from "../../src/index.js";
import { Slot } from "../../src/runtime/core/slots.js";

function equalKeyPair(): [PyObject, PyObject] {
  const Key = makeClass({
    name: "Key",
    bases: [objectType],
    dict: new Map<string | symbol, unknown>([
      [Slot.hash, () => 56],
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

describe("tuple __eq__ hash+eq elements", () => {
  it("equal tuples with equal-but-distinct elements", () => {
    const [k1, k2] = equalKeyPair();
    expect(eq(pyTuple([k1]), pyTuple([k2]))).toBe(true);
    expect(
      eq(pyTuple([k1, pyInt(3)]), pyTuple([k2, pyInt(3)])),
    ).toBe(true);
  });

  it("false when element values differ or lengths differ", () => {
    const [k1, k2] = equalKeyPair();
    expect(eq(pyTuple([k1, pyInt(1)]), pyTuple([k2, pyInt(2)]))).toBe(false);
    expect(eq(pyTuple([k1]), pyTuple([]))).toBe(false);
  });

  it("returns false for non-tuple rhs", () => {
    expect(eq(pyTuple([pyInt(1)]), pyInt(1))).toBe(false);
  });

  it("__contains__ matches equal-but-distinct elements", () => {
    const [k1, k2] = equalKeyPair();
    const t = pyTuple([k1, pyInt(9)]);
    expect(contains(t, k2)).toBe(true);
    expect(contains(t, pyInt(9))).toBe(true);
    expect(contains(t, pyInt(0))).toBe(false);
  });
});
