/**
 * CPython: str.index / str.rindex substring search.
 */
import { describe, it, expect } from "vitest";
import {
  PyObject,
  getAttr,
  pyBytes,
  pyInt,
  pyStr,
  unwrap,
} from "../../src/index.js";
import { PyTypeError, PyValueError } from "../../src/runtime/core/errors.js";

type IndexFn = (
  self: PyObject,
  sub: unknown,
  start?: unknown,
  end?: unknown,
) => unknown;

describe("cpython-derived str index rindex", () => {
  function index(
    text: string,
    sub: unknown,
    start?: unknown,
    end?: unknown,
  ): unknown {
    const self = pyStr(text);
    const fn = getAttr(self, "index") as IndexFn;
    if (end !== undefined) return fn(self, sub, start, end);
    if (start !== undefined) return fn(self, sub, start);
    return fn(self, sub);
  }

  function rindex(
    text: string,
    sub: unknown,
    start?: unknown,
    end?: unknown,
  ): unknown {
    const self = pyStr(text);
    const fn = getAttr(self, "rindex") as IndexFn;
    if (end !== undefined) return fn(self, sub, start, end);
    if (start !== undefined) return fn(self, sub, start);
    return fn(self, sub);
  }

  function asInt(v: unknown): number {
    return unwrap<number>(v as PyObject);
  }

  it("indexes substrings forward and backward", () => {
    expect(asInt(index("abcabc", pyStr("bc")))).toBe(1);
    expect(asInt(rindex("abcabc", pyStr("bc")))).toBe(4);
  });

  it("raises ValueError when substring is missing", () => {
    expect(() => index("abcabc", pyStr("x"))).toThrow(PyValueError);
    expect(() => index("abcabc", pyStr("x"))).toThrow(/substring not found/);
    expect(() => rindex("abcabc", pyStr("x"))).toThrow(PyValueError);
    expect(() => rindex("abcabc", pyStr("x"))).toThrow(/substring not found/);
  });

  it("respects start and end bounds", () => {
    expect(asInt(index("abcabc", pyStr("bc"), pyInt(0), pyInt(4)))).toBe(1);
    expect(asInt(rindex("abcabc", pyStr("bc"), pyInt(0), pyInt(4)))).toBe(1);
    expect(() => rindex("abcabc", pyStr("bc"), pyInt(0), pyInt(2))).toThrow(
      PyValueError,
    );
    expect(() => index("abcabc", pyStr("bc"), pyInt(0), pyInt(2))).toThrow(
      PyValueError,
    );
  });

  it("handles empty substring like find/rfind", () => {
    expect(asInt(index("abcabc", pyStr("")))).toBe(0);
    expect(asInt(rindex("abcabc", pyStr("")))).toBe(6);
    expect(asInt(rindex("abcabc", pyStr(""), pyInt(0), pyInt(3)))).toBe(3);
  });

  it("indexes Unicode substrings", () => {
    expect(asInt(index("café au lait", pyStr("é")))).toBe(3);
    expect(asInt(rindex("café au lait", pyStr("au")))).toBe(5);
  });

  it("rejects non-str sub", () => {
    expect(() => index("abcabc", pyBytes(new Uint8Array([98, 99])))).toThrow(
      PyTypeError,
    );
    expect(() => index("abcabc", pyBytes(new Uint8Array([98, 99])))).toThrow(
      /must be str, not bytes/,
    );
  });
});
