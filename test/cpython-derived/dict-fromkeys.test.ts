/**
 * CPython: dict.fromkeys (plan 608).
 */
import { describe, it, expect } from "vitest";
import {
  dictType,
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
  pyList,
  pyNone,
  pyStr,
} from "../../src/index.js";
import { Slot } from "../../src/runtime/core/slots.js";
import { PyTypeError } from "../../src/runtime/core/errors.js";

type FromKeysFn = (
  cls: PyObject,
  iterable: unknown,
  defaultArg?: unknown,
) => PyObject;

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

describe("dict.fromkeys", () => {
  function fromkeys(
    iterable: unknown,
    defaultArg?: unknown,
  ): PyObject {
    const fn = getAttr(dictType, "fromkeys") as FromKeysFn;
    return fn(dictType, iterable, defaultArg);
  }

  it("builds dict with None default", () => {
    const a = pyStr("a");
    const b = pyStr("b");
    const d = fromkeys(pyList([a, b]));
    expect(len(d)).toBe(2);
    expect(is(getAttr(d, "get")(d, a) as PyObject, pyNone)).toBe(true);
    expect(is(getAttr(d, "get")(d, b) as PyObject, pyNone)).toBe(true);
  });

  it("uses explicit default value", () => {
    const k = pyStr("x");
    const zero = pyInt(0);
    const d = fromkeys(pyList([k]), zero);
    expect(eq(d, pyDict([[k, zero]]))).toBe(true);
  });

  it("dedupes equal-but-distinct keys", () => {
    const [k1, k2] = equalKeyPair();
    const d = fromkeys(pyList([k1, k2]), pyInt(1));
    expect(len(d)).toBe(1);
  });

  it("rejects non-iterable", () => {
    expect(() => fromkeys(pyInt(1))).toThrow(PyTypeError);
  });
});
