/**
 * CPython: builtin dict constructor.
 */
import { describe, it, expect } from "vitest";
import {
  dict,
  dictType,
  eq,
  getItem,
  instantiate,
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
  setItem,
} from "../../src/index.js";
import { Slot } from "../../src/runtime/core/slots.js";
import { PyTypeError, PyValueError } from "../../src/runtime/core/errors.js";

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

describe("cpython-derived dict builtin", () => {
  it("dict() returns an empty dict", () => {
    const out = dict();
    expect(len(out)).toBe(0);
    expect(out.type).toBe(dictType);
  });

  it("dict(mapping) shallow-copies an existing dict", () => {
    const k = pyStr("a");
    const src = pyDict([[k, pyInt(1)]]);
    const out = dict(src);
    expect(out).not.toBe(src);
    expect(eq(out, src)).toBe(true);
    setItem(src, pyStr("b"), pyInt(2));
    expect(len(out)).toBe(1);
    expect(eq(getItem(out, k), pyInt(1))).toBe(true);
  });

  it("dict(iterable) builds from key/value pairs", () => {
    const a = pyStr("a");
    const b = pyStr("b");
    const out = dict(
      pyList([
        pyTuple([a, pyInt(1)]),
        pyTuple([b, pyInt(2)]),
      ]),
    );
    expect(eq(out, pyDict([[a, pyInt(1)], [b, pyInt(2)]]))).toBe(true);
  });

  it("dedupes equal-but-distinct keys from iterable pairs", () => {
    const [k1, k2] = equalKeyPair();
    const out = dict(pyList([pyTuple([k1, pyInt(1)]), pyTuple([k2, pyInt(9)])]));
    expect(len(out)).toBe(1);
    expect(eq(getItem(out, k1), pyInt(9))).toBe(true);
  });

  it("raises TypeError with too many arguments", () => {
    expect(() => dict(pyDict([]), pyInt(1))).toThrow(PyTypeError);
    expect(() => dict(pyDict([]), pyInt(1))).toThrow(/expected at most 1 argument/);
  });

  it("raises TypeError for non-iterable argument", () => {
    expect(() => dict(pyInt(1))).toThrow(PyTypeError);
  });

  it("rejects invalid pair shapes", () => {
    expect(() => dict(pyList([pyTuple([pyInt(1)])]))).toThrow(PyValueError);
    expect(() => dict(pyList([pyInt(1)]))).toThrow(PyTypeError);
    expect(() => dict(pyList([pyInt(1)]))).toThrow(/is not a sequence/);
  });

  it("rejects unhashable keys", () => {
    expect(() => dict(pyList([pyTuple([pyList([]), pyInt(1)])]))).toThrow(
      PyTypeError,
    );
    expect(() => dict(pyList([pyTuple([pyList([]), pyInt(1)])]))).toThrow(
      /unhashable type: 'list'/,
    );
  });
});
