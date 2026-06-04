/**
 * CPython: str.replace non-overlapping substring substitution.
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

type ReplaceFn = (
  self: PyObject,
  old: unknown,
  newStr: unknown,
  count?: unknown,
) => unknown;

describe("cpython-derived str replace", () => {
  function replace(
    text: string,
    old: unknown,
    newStr: unknown,
    count?: unknown,
  ): unknown {
    const self = pyStr(text);
    const fn = getAttr(self, "replace") as ReplaceFn;
    if (count !== undefined) return fn(self, old, newStr, count);
    return fn(self, old, newStr);
  }

  function asStr(v: unknown): string {
    return unwrap<string>(v as PyObject);
  }

  it("replaces all or limited occurrences", () => {
    expect(asStr(replace("abcabc", pyStr("bc"), pyStr("x")))).toBe("axax");
    expect(asStr(replace("abcabc", pyStr("bc"), pyStr("x"), pyInt(1)))).toBe(
      "axabc",
    );
    expect(asStr(replace("abcabc", pyStr("bc"), pyStr("x"), pyInt(0)))).toBe(
      "abcabc",
    );
  });

  it("uses non-overlapping semantics", () => {
    expect(asStr(replace("aaa", pyStr("aa"), pyStr("x")))).toBe("xa");
  });

  it("handles empty input with empty old string", () => {
    expect(asStr(replace("", pyStr(""), pyStr("|")))).toBe("|");
    expect(asStr(replace("", pyStr(""), pyStr("|"), pyInt(0)))).toBe("");
  });

  it("handles empty old string insertion", () => {
    expect(asStr(replace("abcabc", pyStr(""), pyStr("|")))).toBe(
      "|a|b|c|a|b|c|",
    );
    expect(asStr(replace("abcabc", pyStr(""), pyStr("|"), pyInt(1)))).toBe(
      "|abcabc",
    );
    expect(asStr(replace("abcabc", pyStr(""), pyStr("|"), pyInt(2)))).toBe(
      "|a|bcabc",
    );
  });

  it("allows empty new string to remove matches", () => {
    expect(asStr(replace("abcabc", pyStr("bc"), pyStr("")))).toBe("aa");
  });

  it("replaces Unicode substrings", () => {
    expect(asStr(replace("café café", pyStr("é"), pyStr("e")))).toBe(
      "cafe cafe",
    );
  });

  it("rejects non-str old or new", () => {
    expect(() => replace("abcabc", pyBytes(new Uint8Array([98, 99])), pyStr("x"))).toThrow(
      PyTypeError,
    );
    expect(() => replace("abcabc", pyBytes(new Uint8Array([98, 99])), pyStr("x"))).toThrow(
      /must be str, not bytes/,
    );
    expect(() => replace("abcabc", pyStr("bc"), pyBytes(new Uint8Array([120])))).toThrow(
      PyTypeError,
    );
  });
});
