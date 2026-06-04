/**
 * CPython: str.partition splits once into three parts at the first separator.
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

type PartitionFn = (self: PyObject, sep: unknown) => unknown;

describe("cpython-derived str partition", () => {
  function partition(text: string, sep: unknown): unknown {
    const self = pyStr(text);
    const fn = getAttr(self, "partition") as PartitionFn;
    return fn(self, sep);
  }

  function asTriple(v: unknown): string[] {
    const items = unwrap<PyObject[]>(v as PyObject);
    return items.map((item) => unwrap<string>(item));
  }

  it("partitions on first separator", () => {
    expect(asTriple(partition("a,b,c", pyStr(",")))).toEqual(["a", ",", "b,c"]);
  });

  it("returns whole string and empty parts when separator missing", () => {
    expect(asTriple(partition("a,b,c", pyStr("|")))).toEqual(["a,b,c", "", ""]);
  });

  it("handles overlapping separator at start", () => {
    expect(asTriple(partition("aaa", pyStr("aa")))).toEqual(["", "aa", "a"]);
  });

  it("partitions exact match", () => {
    expect(asTriple(partition("x", pyStr("x")))).toEqual(["", "x", ""]);
    expect(asTriple(partition("ab", pyStr("ab")))).toEqual(["", "ab", ""]);
    expect(asTriple(partition("abab", pyStr("ab")))).toEqual(["", "ab", "ab"]);
  });

  it("handles empty string", () => {
    expect(asTriple(partition("", pyStr(",")))).toEqual(["", "", ""]);
  });

  it("rejects empty separator", () => {
    expect(() => partition("x", pyStr(""))).toThrow(PyValueError);
    expect(() => partition("x", pyStr(""))).toThrow(/empty separator/);
  });

  it("rejects non-str separator", () => {
    expect(() => partition("x", pyBytes(new Uint8Array([44])))).toThrow(PyTypeError);
    expect(() => partition("x", pyBytes(new Uint8Array([44])))).toThrow(
      /must be str, not bytes/,
    );
  });
});
