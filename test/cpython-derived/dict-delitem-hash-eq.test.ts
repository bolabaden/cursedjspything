/**
 * CPython: dict __delitem__ uses hash+eq key lookup (plan 632).
 */
import { describe, it, expect } from "vitest";
import {
  delItem,
  instantiate,
  len,
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
      [Slot.hash, () => 61],
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

describe("dict __delitem__ hash+eq keys", () => {
  it("deletes entry found by equal-but-distinct key", () => {
    const [k1, k2] = equalKeyPair();
    const d = pyDict([[k1, pyInt(1)]]);
    delItem(d, k2);
    expect(len(d)).toBe(0);
  });

  it("raises KeyError when no equal key present", () => {
    const [k1] = equalKeyPair();
    const d = pyDict([[k1, pyInt(1)]]);
    expect(() => delItem(d, pyInt(0))).toThrow(PyKeyError);
  });
});
