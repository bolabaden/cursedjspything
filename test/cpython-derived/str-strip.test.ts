/**
 * CPython: str.strip / lstrip / rstrip trim leading and trailing characters.
 */
import { describe, it, expect } from "vitest";
import {
  PyObject,
  getAttr,
  pyInt,
  pyStr,
  strType,
  unwrap,
} from "../../src/index.js";
import { PyTypeError } from "../../src/runtime/core/errors.js";

type StripFn = (self: PyObject, chars?: unknown) => unknown;

describe("cpython-derived str strip", () => {
  function strip(text: string, chars?: unknown): string {
    const self = pyStr(text);
    const fn = getAttr(self, "strip") as StripFn;
    if (chars !== undefined) return unwrap<string>(fn(self, chars) as PyObject);
    return unwrap<string>(fn(self) as PyObject);
  }

  function lstrip(text: string, chars?: unknown): string {
    const self = pyStr(text);
    const fn = getAttr(self, "lstrip") as StripFn;
    if (chars !== undefined) return unwrap<string>(fn(self, chars) as PyObject);
    return unwrap<string>(fn(self) as PyObject);
  }

  function rstrip(text: string, chars?: unknown): string {
    const self = pyStr(text);
    const fn = getAttr(self, "rstrip") as StripFn;
    if (chars !== undefined) return unwrap<string>(fn(self, chars) as PyObject);
    return unwrap<string>(fn(self) as PyObject);
  }

  it("strips whitespace on both sides", () => {
    expect(strip("  abc  ")).toBe("abc");
    expect(strip("\tabc\n")).toBe("abc");
  });

  it("lstrip and rstrip trim one side", () => {
    expect(lstrip("  abc  ")).toBe("abc  ");
    expect(rstrip("  abc  ")).toBe("  abc");
  });

  it("strips custom characters", () => {
    expect(strip("xxabcxx", pyStr("x"))).toBe("abc");
    expect(strip("abc", pyStr(""))).toBe("abc");
    expect(lstrip("abc", pyStr(""))).toBe("abc");
    expect(rstrip("abc", pyStr(""))).toBe("abc");
  });

  it("rejects non-str chars", () => {
    expect(() => strip("abc", pyInt(1))).toThrow(PyTypeError);
    expect(() => strip("abc", pyInt(1))).toThrow(/strip arg must be None or str/);
  });

  it("returns str instances", () => {
    const self = pyStr("  x  ");
    const fn = getAttr(self, "strip") as StripFn;
    expect((fn(self) as PyObject).type).toBe(strType);
    expect(unwrap<string>(fn(self) as PyObject)).toBe("x");
  });
});
