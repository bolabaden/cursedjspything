/**
 * CPython: str.rsplit returns a list of str segments from the right.
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

type RsplitFn = (self: PyObject, sep?: unknown, maxsplit?: unknown) => unknown;

describe("cpython-derived str rsplit", () => {
  function rsplit(text: string, sep?: unknown, maxsplit?: unknown): unknown {
    const self = pyStr(text);
    const rsplitFn = getAttr(self, "rsplit") as RsplitFn;
    if (maxsplit !== undefined) return rsplitFn(self, sep, maxsplit);
    if (sep !== undefined) return rsplitFn(self, sep);
    return rsplitFn(self);
  }

  function asStrList(v: unknown): string[] {
    const items = unwrap<PyObject[]>(v as PyObject);
    return items.map((item) => unwrap<string>(item));
  }

  it("rsplits on separator", () => {
    expect(asStrList(rsplit("a,b,c", pyStr(",")))).toEqual(["a", "b", "c"]);
  });

  it("respects maxsplit from the right", () => {
    expect(asStrList(rsplit("a,b,c", pyStr(","), pyInt(1)))).toEqual(["a,b", "c"]);
  });

  it("rsplits on whitespace when sep omitted", () => {
    expect(asStrList(rsplit("a  b  c", undefined, pyInt(1)))).toEqual(["a  b", "c"]);
  });

  it("handles overlapping separator from the right", () => {
    expect(asStrList(rsplit("aaa", pyStr("aa")))).toEqual(["a", ""]);
  });

  it("rejects empty separator", () => {
    expect(() => rsplit("x", pyStr(""))).toThrow(PyValueError);
    expect(() => rsplit("x", pyStr(""))).toThrow(/empty separator/);
  });

  it("maxsplit zero returns whole string", () => {
    expect(asStrList(rsplit("a b c", undefined, pyInt(0)))).toEqual(["a b c"]);
    expect(asStrList(rsplit("a,b,c", pyStr(","), pyInt(0)))).toEqual(["a,b,c"]);
  });

  it("maxsplit zero on whitespace-only returns empty list", () => {
    expect(asStrList(rsplit("   ", undefined, pyInt(0)))).toEqual([]);
    expect(asStrList(rsplit("\t\t", undefined, pyInt(0)))).toEqual([]);
    expect(asStrList(rsplit(" a ", undefined, pyInt(0)))).toEqual([" a "]);
  });

  it("rejects non-str separator", () => {
    expect(() => rsplit("hi", pyBytes(new Uint8Array([44])))).toThrow(PyTypeError);
    expect(() => rsplit("hi", pyBytes(new Uint8Array([44])))).toThrow(
      /must be str or None, not bytes/,
    );
  });

  it("empty string split on sep returns single empty element", () => {
    expect(asStrList(rsplit("", pyStr(",")))).toEqual([""]);
  });

  it("empty string whitespace rsplit returns empty list", () => {
    expect(asStrList(rsplit(""))).toEqual([]);
  });
});
