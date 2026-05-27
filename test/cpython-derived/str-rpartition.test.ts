/**
 * CPython: str.rpartition splits once into three parts at the last separator.
 */
import { describe, it, expect } from "vitest";
import {
  PyObject,
  getAttr,
  pyBytes,
  pyStr,
  unwrap,
} from "../../src/index.js";
import { PyTypeError, PyValueError } from "../../src/runtime/core/errors.js";

type RpartitionFn = (self: PyObject, sep: unknown) => unknown;

describe("cpython-derived str rpartition", () => {
  function rpartition(text: string, sep: unknown): unknown {
    const self = pyStr(text);
    const fn = getAttr(self, "rpartition") as RpartitionFn;
    return fn(self, sep);
  }

  function asTriple(v: unknown): string[] {
    const items = unwrap<PyObject[]>(v as PyObject);
    return items.map((item) => unwrap<string>(item));
  }

  it("rpartitions on last separator", () => {
    expect(asTriple(rpartition("a,b,c", pyStr(",")))).toEqual(["a,b", ",", "c"]);
  });

  it("returns empty parts and whole string when separator missing", () => {
    expect(asTriple(rpartition("a,b,c", pyStr("|")))).toEqual(["", "", "a,b,c"]);
  });

  it("handles overlapping separator at end", () => {
    expect(asTriple(rpartition("aaa", pyStr("aa")))).toEqual(["a", "aa", ""]);
  });

  it("rpartitions exact match", () => {
    expect(asTriple(rpartition("x", pyStr("x")))).toEqual(["", "x", ""]);
  });

  it("rejects empty separator", () => {
    expect(() => rpartition("x", pyStr(""))).toThrow(PyValueError);
    expect(() => rpartition("x", pyStr(""))).toThrow(/empty separator/);
  });

  it("rejects non-str separator", () => {
    expect(() => rpartition("x", pyBytes(new Uint8Array([44])))).toThrow(PyTypeError);
    expect(() => rpartition("x", pyBytes(new Uint8Array([44])))).toThrow(
      /must be str, not bytes/,
    );
  });
});
