/**
 * CPython: str.count non-overlapping substring occurrences.
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

type CountFn = (
  self: PyObject,
  sub: unknown,
  start?: unknown,
  end?: unknown,
) => unknown;

describe("cpython-derived str count", () => {
  function count(
    text: string,
    sub: unknown,
    start?: unknown,
    end?: unknown,
  ): unknown {
    const self = pyStr(text);
    const fn = getAttr(self, "count") as CountFn;
    if (end !== undefined) return fn(self, sub, start, end);
    if (start !== undefined) return fn(self, sub, start);
    return fn(self, sub);
  }

  function asInt(v: unknown): number {
    return unwrap<number>(v as PyObject);
  }

  it("counts repeated substrings", () => {
    expect(asInt(count("abcabcabc", pyStr("bc")))).toBe(3);
  });

  it("returns zero when substring is missing", () => {
    expect(asInt(count("abcabcabc", pyStr("x")))).toBe(0);
    expect(asInt(count("", pyStr("a")))).toBe(0);
  });

  it("uses non-overlapping semantics", () => {
    expect(asInt(count("aaa", pyStr("aa")))).toBe(1);
  });

  it("respects start and end bounds", () => {
    expect(asInt(count("abcabcabc", pyStr("bc"), pyInt(0), pyInt(6)))).toBe(2);
    expect(asInt(count("abcabcabc", pyStr("bc"), pyInt(1), pyInt(7)))).toBe(2);
  });

  it("handles empty substring like CPython", () => {
    expect(asInt(count("abcabcabc", pyStr("")))).toBe(10);
    expect(asInt(count("", pyStr("")))).toBe(1);
    expect(asInt(count("abcabcabc", pyStr(""), pyInt(2), pyInt(1)))).toBe(0);
  });

  it("counts Unicode substrings", () => {
    expect(asInt(count("café café", pyStr("é")))).toBe(2);
  });

  it("rejects non-str sub", () => {
    expect(() => count("abcabcabc", pyBytes(new Uint8Array([98, 99])))).toThrow(
      PyTypeError,
    );
    expect(() => count("abcabcabc", pyBytes(new Uint8Array([98, 99])))).toThrow(
      /must be str, not bytes/,
    );
  });
});
