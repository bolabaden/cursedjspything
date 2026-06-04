/**
 * CPython: str.find / str.rfind substring search.
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
import { PyTypeError } from "../../src/runtime/core/errors.js";

type FindFn = (
  self: PyObject,
  sub: unknown,
  start?: unknown,
  end?: unknown,
) => unknown;

describe("cpython-derived str find rfind", () => {
  function find(
    text: string,
    sub: unknown,
    start?: unknown,
    end?: unknown,
  ): unknown {
    const self = pyStr(text);
    const fn = getAttr(self, "find") as FindFn;
    if (end !== undefined) return fn(self, sub, start, end);
    if (start !== undefined) return fn(self, sub, start);
    return fn(self, sub);
  }

  function rfind(
    text: string,
    sub: unknown,
    start?: unknown,
    end?: unknown,
  ): unknown {
    const self = pyStr(text);
    const fn = getAttr(self, "rfind") as FindFn;
    if (end !== undefined) return fn(self, sub, start, end);
    if (start !== undefined) return fn(self, sub, start);
    return fn(self, sub);
  }

  function asInt(v: unknown): number {
    return unwrap<number>(v as PyObject);
  }

  it("finds substrings forward and backward", () => {
    expect(asInt(find("abcabc", pyStr("bc")))).toBe(1);
    expect(asInt(rfind("abcabc", pyStr("bc")))).toBe(4);
  });

  it("returns -1 when substring is missing", () => {
    expect(asInt(find("abcabc", pyStr("x")))).toBe(-1);
    expect(asInt(rfind("abcabc", pyStr("x")))).toBe(-1);
    expect(asInt(find("", pyStr("a")))).toBe(-1);
    expect(asInt(rfind("", pyStr("a")))).toBe(-1);
  });

  it("respects start and end bounds", () => {
    expect(asInt(find("abcabc", pyStr("bc"), pyInt(0), pyInt(4)))).toBe(1);
    expect(asInt(rfind("abcabc", pyStr("bc"), pyInt(0), pyInt(4)))).toBe(1);
    expect(asInt(rfind("abcabc", pyStr("bc"), pyInt(0), pyInt(2)))).toBe(-1);
  });

  it("handles empty substring like CPython", () => {
    expect(asInt(find("abcabc", pyStr("")))).toBe(0);
    expect(asInt(find("abcabc", pyStr(""), pyInt(2)))).toBe(2);
    expect(asInt(rfind("abcabc", pyStr("")))).toBe(6);
    expect(asInt(rfind("abcabc", pyStr(""), pyInt(0), pyInt(3)))).toBe(3);
    expect(asInt(rfind("abcabc", pyStr(""), pyInt(0), pyInt(1)))).toBe(1);
    expect(asInt(rfind("abcabc", pyStr(""), pyInt(0), pyInt(0)))).toBe(0);
  });

  it("finds Unicode substrings", () => {
    expect(asInt(find("café au lait", pyStr("é")))).toBe(3);
    expect(asInt(rfind("café au lait", pyStr("au")))).toBe(5);
  });

  it("rejects non-str sub", () => {
    expect(() => find("abcabc", pyBytes(new Uint8Array([98, 99])))).toThrow(
      PyTypeError,
    );
    expect(() => find("abcabc", pyBytes(new Uint8Array([98, 99])))).toThrow(
      /must be str, not bytes/,
    );
  });
});
