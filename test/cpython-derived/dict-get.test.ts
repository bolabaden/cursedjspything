/**
 * CPython: dict.get(key[, default]) (plan 598).
 */
import { describe, it, expect } from "vitest";
import {
  eq,
  getAttr,
  instantiate,
  is,
  makeClass,
  NotImplemented,
  objectType,
  PyObject,
  pyDict,
  pyInt,
  pyList,
  pyNone,
  pyStr,
} from "../../src/index.js";
import { Slot } from "../../src/runtime/core/slots.js";
import { PyTypeError } from "../../src/runtime/core/errors.js";

type DictGetFn = (self: PyObject, key: unknown, defaultArg?: unknown) => unknown;

function equalKeyPair(): [PyObject, PyObject] {
  const Key = makeClass({
    name: "Key",
    bases: [objectType],
    dict: new Map<string | symbol, unknown>([
      [Slot.hash, () => 11],
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

describe("dict.get", () => {
  function call(
    self: PyObject,
    key: unknown,
    defaultArg?: unknown,
  ): unknown {
    const fn = getAttr(self, "get") as DictGetFn;
    return fn(self, key, defaultArg);
  }

  it("returns value for present key", () => {
    const k = pyStr("a");
    const v = pyInt(1);
    expect(call(pyDict([[k, v]]), k)).toBe(v);
  });

  it("returns None when key missing and no default", () => {
    const result = call(pyDict([[pyStr("a"), pyInt(1)]]), pyStr("missing"));
    expect(is(result as PyObject, pyNone)).toBe(true);
  });

  it("returns default when key missing", () => {
    const fallback = pyStr("fallback");
    expect(call(pyDict([]), pyStr("x"), fallback)).toBe(fallback);
  });

  it("finds values by hash+eq for equal-but-distinct keys", () => {
    const [k1, k2] = equalKeyPair();
    const v = pyInt(99);
    expect(eq(call(pyDict([[k1, v]]), k2), v)).toBe(true);
  });

  it("propagates TypeError for unhashable probe keys", () => {
    expect(() => call(pyDict([[pyInt(0), pyInt(1)]]), pyList([]))).toThrow(
      PyTypeError,
    );
  });
});
