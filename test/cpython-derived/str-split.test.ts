/**
 * CPython: str.split returns a list of str segments.
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

type SplitFn = (self: PyObject, sep?: unknown, maxsplit?: unknown) => unknown;

describe("cpython-derived str split", () => {
  function split(text: string, sep?: unknown, maxsplit?: unknown): unknown {
    const self = pyStr(text);
    const splitFn = getAttr(self, "split") as SplitFn;
    if (maxsplit !== undefined) return splitFn(self, sep, maxsplit);
    if (sep !== undefined) return splitFn(self, sep);
    return splitFn(self);
  }

  function asStrList(v: unknown): string[] {
    const items = unwrap<PyObject[]>(v as PyObject);
    return items.map((item) => unwrap<string>(item));
  }

  it("splits on separator", () => {
    expect(asStrList(split("a,b,c", pyStr(",")))).toEqual(["a", "b", "c"]);
  });

  it("respects maxsplit", () => {
    expect(asStrList(split("a,b,c", pyStr(","), pyInt(1)))).toEqual(["a", "b,c"]);
  });

  it("splits on whitespace when sep omitted", () => {
    expect(asStrList(split("a  b"))).toEqual(["a", "b"]);
    expect(asStrList(split(""))).toEqual([]);
  });

  it("handles overlapping separator", () => {
    expect(asStrList(split("aaa", pyStr("aa")))).toEqual(["", "a"]);
  });

  it("rejects empty separator", () => {
    expect(() => split("x", pyStr(""))).toThrow(PyValueError);
    expect(() => split("x", pyStr(""))).toThrow(/empty separator/);
  });

  it("maxsplit zero returns whole string", () => {
    expect(asStrList(split("a b c", undefined, pyInt(0)))).toEqual(["a b c"]);
    expect(asStrList(split("a,b,c", pyStr(","), pyInt(0)))).toEqual(["a,b,c"]);
  });

  it("empty string split on sep returns single empty element", () => {
    expect(asStrList(split("", pyStr(",")))).toEqual([""]);
  });

  it("empty string whitespace split returns empty list", () => {
    expect(asStrList(split(""))).toEqual([]);
  });

  it("rejects non-str separator", () => {
    expect(() => split("x", pyBytes(new Uint8Array([44])))).toThrow(PyTypeError);
    expect(() => split("x", pyBytes(new Uint8Array([44])))).toThrow(
      /must be str or None, not bytes/,
    );
  });
});
