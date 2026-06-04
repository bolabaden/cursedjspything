/**
 * CPython 3.9+: dict union | and |= (plan 596).
 */
import { describe, it, expect } from "vitest";
import {
  bitwiseOr,
  eq,
  getItem,
  instantiate,
  ior,
  len,
  makeClass,
  NotImplemented,
  objectType,
  PyObject,
  pyDict,
  pyInt,
  pyList,
  pyStr,
} from "../../src/index.js";
import { Slot } from "../../src/runtime/core/slots.js";
import { PyTypeError } from "../../src/runtime/core/errors.js";

function equalKeyPair(): [PyObject, PyObject] {
  const Key = makeClass({
    name: "Key",
    bases: [objectType],
    dict: new Map<string | symbol, unknown>([
      [Slot.hash, () => 42],
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

describe("dict union operators", () => {
  it("| returns new dict with rhs overwriting", () => {
    const a = pyStr("a");
    const b = pyStr("b");
    const d1 = pyDict([[a, pyInt(1)]]);
    const d2 = pyDict([[a, pyInt(2)], [b, pyInt(3)]]);
    const merged = bitwiseOr(d1, d2) as PyObject;
    expect(merged).not.toBe(d1);
    expect(merged).not.toBe(d2);
    expect(eq(merged, pyDict([[a, pyInt(2)], [b, pyInt(3)]]))).toBe(true);
  });

  it("|= mutates left-hand dict in place", () => {
    const k = pyStr("x");
    const d1 = pyDict([[k, pyInt(1)]]);
    const d2 = pyDict([[k, pyInt(9)]]);
    const result = ior(d1, d2) as PyObject;
    expect(result).toBe(d1);
    expect(eq(d1, pyDict([[k, pyInt(9)]]))).toBe(true);
  });

  it("| merges equal-but-distinct keys without duplicates", () => {
    const [k1, k2] = equalKeyPair();
    const d1 = pyDict([[k1, pyInt(1)]]);
    const d2 = pyDict([[k2, pyInt(2)]]);
    const merged = bitwiseOr(d1, d2) as PyObject;
    expect(len(merged)).toBe(1);
    expect(eq(getItem(merged, k1), pyInt(2))).toBe(true);
  });

  it("rejects non-dict rhs for | and |=", () => {
    const d = pyDict([[pyStr("a"), pyInt(1)]]);
    expect(() => bitwiseOr(d, pyList([pyInt(1)]))).toThrow(PyTypeError);
    expect(() => ior(d, pyList([pyInt(1)]))).toThrow(PyTypeError);
    expect(() => bitwiseOr(pyList([pyInt(1)]), d)).toThrow(PyTypeError);
  });
});
