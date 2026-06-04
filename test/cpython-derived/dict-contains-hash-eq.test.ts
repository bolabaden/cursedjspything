/**
 * CPython: dict __contains__ and __getitem__ use hash+eq keys (plan 628).
 */
import { describe, it, expect } from "vitest";
import {
  contains,
  eq,
  getItem,
  instantiate,
  makeClass,
  NotImplemented,
  objectType,
  PyKeyError,
  PyObject,
  pyDict,
  pyInt,
} from "../../src/index.js";
import { Slot } from "../../src/runtime/core/slots.js";

function equalKeyPair(): [PyObject, PyObject] {
  const Key = makeClass({
    name: "Key",
    bases: [objectType],
    dict: new Map<string | symbol, unknown>([
      [Slot.hash, () => 58],
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

describe("dict membership hash+eq keys", () => {
  it("__contains__ matches equal-but-distinct keys", () => {
    const [k1, k2] = equalKeyPair();
    const d = pyDict([[k1, pyInt(1)]]);
    expect(contains(d, k2)).toBe(true);
    expect(contains(d, pyInt(0))).toBe(false);
  });

  it("__getitem__ finds values by equal-but-distinct keys", () => {
    const [k1, k2] = equalKeyPair();
    const v = pyInt(42);
    const d = pyDict([[k1, v]]);
    expect(eq(getItem(d, k2), v)).toBe(true);
  });

  it("__getitem__ raises KeyError when no equal key", () => {
    const [k1] = equalKeyPair();
    const d = pyDict([[k1, pyInt(1)]]);
    expect(() => getItem(d, pyInt(0))).toThrow(PyKeyError);
  });
});
