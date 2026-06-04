/**
 * CPython: bytes.isascii and bytes.__contains__.
 */
import { describe, it, expect } from "vitest";
import {
  PyObject,
  contains,
  getAttr,
  pyBytes,
  pyFalse,
  pyInt,
  pyStr,
  pyTrue,
  unwrap,
} from "../../src/index.js";
import { PyTypeError, PyValueError } from "../../src/runtime/core/errors.js";

type PredicateFn = (self: PyObject) => unknown;

describe("cpython-derived bytes isascii contains", () => {
  const hello = new Uint8Array([104, 101, 108, 108, 111]);
  const ell = new Uint8Array([101, 108, 108]);

  function isascii(data: Uint8Array): boolean {
    const self = pyBytes(data);
    const fn = getAttr(self, "isascii") as PredicateFn;
    return unwrap<boolean>(fn(self) as PyObject);
  }

  it("isascii is true for ASCII and empty, false for high bytes", () => {
    expect(isascii(new Uint8Array([]))).toBe(true);
    expect(isascii(hello)).toBe(true);
    expect(isascii(new Uint8Array([127]))).toBe(true);
    expect(isascii(new Uint8Array([128]))).toBe(false);
  });

  it("contains matches substring and single-byte int membership", () => {
    const self = pyBytes(hello);
    expect(contains(self, pyBytes(ell))).toBe(true);
    expect(contains(self, pyBytes(new Uint8Array([120, 121, 122])))).toBe(false);
    expect(contains(self, pyBytes(new Uint8Array([])))).toBe(true);
    expect(contains(self, pyInt(104))).toBe(true);
    expect(contains(self, pyInt(122))).toBe(false);
  });

  it("contains on empty bytes haystack", () => {
    const empty = pyBytes(new Uint8Array(0));
    expect(contains(empty, pyBytes(new Uint8Array([97])))).toBe(false);
    expect(contains(empty, pyBytes(new Uint8Array([])))).toBe(true);
    expect(contains(empty, pyInt(97))).toBe(false);
  });

  it("returns bool singletons from isascii", () => {
    const self = pyBytes(hello);
    const fn = getAttr(self, "isascii") as PredicateFn;
    expect(fn(self)).toBe(pyTrue);
    const high = pyBytes(new Uint8Array([255]));
    const isasciiFn = getAttr(high, "isascii") as PredicateFn;
    expect(isasciiFn(high)).toBe(pyFalse);
  });

  it("raises on invalid contains operands", () => {
    const self = pyBytes(hello);
    expect(() => contains(self, pyStr("ell"))).toThrow(PyTypeError);
    expect(() => contains(self, pyStr("ell"))).toThrow(/bytes-like object is required/);
    expect(() => contains(self, pyInt(256))).toThrow(PyValueError);
    expect(() => contains(self, pyInt(-1))).toThrow(/byte must be in range/);
  });
});
