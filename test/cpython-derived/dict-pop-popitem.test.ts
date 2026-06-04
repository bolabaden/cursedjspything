/**
 * CPython: dict.pop and dict.popitem (plan 604).
 */
import { describe, it, expect } from "vitest";
import {
  eq,
  getAttr,
  instantiate,
  len,
  makeClass,
  NotImplemented,
  objectType,
  PyKeyError,
  PyObject,
  pyDict,
  pyInt,
  pyStr,
  pyTuple,
} from "../../src/index.js";
import { Slot } from "../../src/runtime/core/slots.js";

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

describe("dict.pop and dict.popitem", () => {
  it("pop removes and returns value", () => {
    const k = pyStr("a");
    const v = pyInt(1);
    const d = pyDict([[k, v]]);
    const pop = getAttr(d, "pop") as (
      self: PyObject,
      key: unknown,
      defaultArg?: unknown,
    ) => unknown;
    expect(pop(d, k)).toBe(v);
    expect(len(d)).toBe(0);
  });

  it("pop raises KeyError without default", () => {
    const d = pyDict([]);
    const pop = getAttr(d, "pop") as (
      self: PyObject,
      key: unknown,
      defaultArg?: unknown,
    ) => unknown;
    expect(() => pop(d, pyStr("missing"))).toThrow(PyKeyError);
  });

  it("pop returns default when key absent", () => {
    const d = pyDict([]);
    const fallback = pyInt(9);
    const pop = getAttr(d, "pop") as (
      self: PyObject,
      key: unknown,
      defaultArg?: unknown,
    ) => unknown;
    expect(pop(d, pyStr("x"), fallback)).toBe(fallback);
    expect(len(d)).toBe(0);
  });

  it("pop finds equal-but-distinct keys", () => {
    const [k1, k2] = equalKeyPair();
    const v = pyInt(3);
    const d = pyDict([[k1, v]]);
    const pop = getAttr(d, "pop") as (
      self: PyObject,
      key: unknown,
      defaultArg?: unknown,
    ) => unknown;
    expect(pop(d, k2)).toBe(v);
    expect(len(d)).toBe(0);
  });

  it("popitem removes last inserted pair", () => {
    const d = pyDict([
      [pyStr("first"), pyInt(1)],
      [pyStr("second"), pyInt(2)],
    ]);
    const popitem = getAttr(d, "popitem") as (self: PyObject) => PyObject;
    const pair = popitem(d);
    expect(eq(pair, pyTuple([pyStr("second"), pyInt(2)]))).toBe(true);
    expect(len(d)).toBe(1);
    expect(eq(popitem(d), pyTuple([pyStr("first"), pyInt(1)]))).toBe(true);
    expect(len(d)).toBe(0);
  });

  it("popitem on empty dict raises KeyError", () => {
    const popitem = getAttr(pyDict([]), "popitem") as (self: PyObject) => unknown;
    expect(() => popitem(pyDict([]))).toThrow(PyKeyError);
  });
});
