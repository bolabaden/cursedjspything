/**
 * CPython: str.zfill width zero-padding.
 */
import { describe, it, expect } from "vitest";
import {
  PyObject,
  getAttr,
  pyInt,
  pyStr,
  unwrap,
} from "../../src/index.js";

type ZfillFn = (self: PyObject, width: unknown) => unknown;

describe("cpython-derived str zfill", () => {
  function zfill(text: string, width: unknown): unknown {
    const self = pyStr(text);
    const fn = getAttr(self, "zfill") as ZfillFn;
    return fn(self, width);
  }

  function asStr(v: unknown): string {
    return unwrap<string>(v as PyObject);
  }

  it("zero-pads unsigned str and empty str", () => {
    expect(asStr(zfill("abc", pyInt(5)))).toBe("00abc");
    expect(asStr(zfill("42", pyInt(5)))).toBe("00042");
    expect(asStr(zfill("", pyInt(5)))).toBe("00000");
  });

  it("preserves sign and pads zeros after it", () => {
    expect(asStr(zfill("-42", pyInt(5)))).toBe("-0042");
    expect(asStr(zfill("+42", pyInt(5)))).toBe("+0042");
    expect(asStr(zfill("-", pyInt(3)))).toBe("-00");
    expect(asStr(zfill("+", pyInt(3)))).toBe("+00");
  });

  it("returns original str when width is not wider", () => {
    expect(asStr(zfill("abc", pyInt(2)))).toBe("abc");
    expect(asStr(zfill("-42", pyInt(3)))).toBe("-42");
    expect(asStr(zfill("abc", pyInt(0)))).toBe("abc");
    expect(asStr(zfill("-42", pyInt(0)))).toBe("-42");
    expect(asStr(zfill("", pyInt(0)))).toBe("");
  });

  it("zero-pads Unicode body with sign prefix", () => {
    expect(asStr(zfill("-café", pyInt(7)))).toBe("-00café");
  });
});
