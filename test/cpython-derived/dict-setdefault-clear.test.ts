/**
 * CPython: dict.setdefault and dict.clear (plan 602).
 */
import { describe, it, expect } from "vitest";
import {
  eq,
  getAttr,
  instantiate,
  is,
  len,
  makeClass,
  NotImplemented,
  objectType,
  PyObject,
  pyDict,
  pyInt,
  pyNone,
  pyStr,
} from "../../src/index.js";
import { Slot } from "../../src/runtime/core/slots.js";

function equalKeyPair(): [PyObject, PyObject] {
  const Key = makeClass({
    name: "Key",
    bases: [objectType],
    dict: new Map<string | symbol, unknown>([
      [Slot.hash, () => 88],
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

describe("dict.setdefault and dict.clear", () => {
  it("setdefault returns existing value without insert", () => {
    const k = pyStr("a");
    const v = pyInt(1);
    const d = pyDict([[k, v]]);
    const fn = getAttr(d, "setdefault") as (
      self: PyObject,
      key: unknown,
      defaultArg?: unknown,
    ) => unknown;
    expect(fn(d, k, pyInt(99))).toBe(v);
    expect(len(d)).toBe(1);
  });

  it("setdefault inserts None or provided default", () => {
    const k = pyStr("new");
    const d = pyDict([]);
    const fn = getAttr(d, "setdefault") as (
      self: PyObject,
      key: unknown,
      defaultArg?: unknown,
    ) => unknown;
    const noneResult = fn(d, pyStr("x"));
    expect(is(noneResult as PyObject, pyNone)).toBe(true);
    expect(len(d)).toBe(1);

    const d2 = pyDict([]);
    const fallback = pyInt(5);
    expect(fn(d2, k, fallback)).toBe(fallback);
    expect(eq(d2, pyDict([[k, fallback]]))).toBe(true);
  });

  it("setdefault finds equal-but-distinct keys", () => {
    const [k1, k2] = equalKeyPair();
    const v = pyInt(7);
    const d = pyDict([[k1, v]]);
    const fn = getAttr(d, "setdefault") as (
      self: PyObject,
      key: unknown,
      defaultArg?: unknown,
    ) => unknown;
    expect(fn(d, k2, pyInt(0))).toBe(v);
    expect(len(d)).toBe(1);
  });

  it("clear removes all items", () => {
    const d = pyDict([[pyStr("a"), pyInt(1)]]);
    const clear = getAttr(d, "clear") as (self: PyObject) => undefined;
    clear(d);
    expect(len(d)).toBe(0);
  });
});
