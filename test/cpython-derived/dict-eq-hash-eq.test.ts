/**
 * CPython: dict.__eq__ uses hash+eq key matching (plan 620).
 */
import { describe, it, expect } from "vitest";
import {
  eq,
  ne,
  instantiate,
  len,
  makeClass,
  NotImplemented,
  objectType,
  PyObject,
  pyDict,
  pyInt,
  pyStr,
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

describe("dict __eq__ hash+eq keys", () => {
  it("equal dicts with equal-but-distinct keys and same values", () => {
    const [k1, k2] = equalKeyPair();
    const v = pyInt(1);
    expect(eq(pyDict([[k1, v]]), pyDict([[k2, v]]))).toBe(true);
  });

  it("false when equal keys map to different values", () => {
    const [k1, k2] = equalKeyPair();
    expect(
      eq(pyDict([[k1, pyInt(1)]]), pyDict([[k2, pyInt(2)]])),
    ).toBe(false);
  });

  it("false when sizes differ under equal-key collapse", () => {
    const [k1, k2] = equalKeyPair();
    expect(eq(pyDict([[k1, pyInt(1)]]), pyDict([]))).toBe(false);
    expect(
      eq(pyDict([[k1, pyInt(1)], [pyStr("x"), pyInt(2)]]), pyDict([[k2, pyInt(1)]])),
    ).toBe(false);
  });

  it("returns false for non-dict rhs", () => {
    const d = pyDict([[pyStr("a"), pyInt(1)]]);
    expect(eq(d, pyInt(1))).toBe(false);
    expect(len(d)).toBe(1);
  });

  it("ne negates eq for equal-but-distinct keys", () => {
    const [k1, k2] = equalKeyPair();
    const v = pyInt(1);
    const a = pyDict([[k1, v]]);
    const b = pyDict([[k2, v]]);
    expect(ne(a, b)).toBe(false);
    expect(ne(a, pyDict([[k1, pyInt(2)]]))).toBe(true);
    expect(ne(a, pyDict([]))).toBe(true);
  });
});
