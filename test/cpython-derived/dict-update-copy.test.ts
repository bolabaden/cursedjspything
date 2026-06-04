/**
 * CPython: dict.update and dict.copy (plan 600).
 */
import { describe, it, expect } from "vitest";
import {
  eq,
  getAttr,
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
  pyTuple,
} from "../../src/index.js";
import { Slot } from "../../src/runtime/core/slots.js";
import { PyTypeError, PyValueError } from "../../src/runtime/core/errors.js";

type DictMethodFn = (self: PyObject, other: unknown) => undefined;

function equalKeyPair(): [PyObject, PyObject] {
  const Key = makeClass({
    name: "Key",
    bases: [objectType],
    dict: new Map<string | symbol, unknown>([
      [Slot.hash, () => 33],
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

describe("dict.update and dict.copy", () => {
  function update(self: PyObject, other: unknown): void {
    const fn = getAttr(self, "update") as DictMethodFn;
    fn(self, other);
  }

  it("update merges another dict in place", () => {
    const a = pyStr("a");
    const b = pyStr("b");
    const d = pyDict([[a, pyInt(1)]]);
    update(d, pyDict([[b, pyInt(2)]]));
    expect(eq(d, pyDict([[a, pyInt(1)], [b, pyInt(2)]]))).toBe(true);
  });

  it("update accepts iterable of pairs", () => {
    const k = pyStr("x");
    const d = pyDict([]);
    update(d, pyList([pyTuple([k, pyInt(7)])]));
    expect(eq(d, pyDict([[k, pyInt(7)]]))).toBe(true);
  });

  it("copy returns equal independent dict", () => {
    const d = pyDict([[pyStr("k"), pyInt(1)]]);
    const copied = getAttr(d, "copy") as (self: PyObject) => PyObject;
    const c = copied(d);
    expect(c).not.toBe(d);
    expect(eq(c, d)).toBe(true);
  });

  it("update overwrites equal-but-distinct keys", () => {
    const [k1, k2] = equalKeyPair();
    const d = pyDict([[k1, pyInt(1)]]);
    update(d, pyDict([[k2, pyInt(9)]]));
    expect(len(d)).toBe(1);
    expect(eq(getItem(d, k1), pyInt(9))).toBe(true);
  });

  it("|= accepts iterable of pairs like update", () => {
    const k = pyStr("y");
    const d = pyDict([]);
    ior(d, pyList([pyTuple([k, pyInt(3)])]));
    expect(eq(d, pyDict([[k, pyInt(3)]]))).toBe(true);
  });

  it("rejects invalid update operands", () => {
    expect(() => update(pyDict([]), pyInt(1))).toThrow(PyTypeError);
    expect(() => update(pyDict([]), pyList([pyTuple([pyInt(1)])]))).toThrow(
      PyValueError,
    );
  });
});
