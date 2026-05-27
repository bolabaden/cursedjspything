/**
 * CPython: bytes.rsplit returns a list of bytes segments from the right.
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

describe("cpython-derived bytes rsplit", () => {
  function rsplit(
    data: Uint8Array,
    sep?: unknown,
    maxsplit?: unknown,
  ): unknown {
    const self = pyBytes(data);
    const rsplitFn = getAttr(self, "rsplit") as RsplitFn;
    if (maxsplit !== undefined) {
      return rsplitFn(self, sep, maxsplit);
    }
    if (sep !== undefined) {
      return rsplitFn(self, sep);
    }
    return rsplitFn(self);
  }

  function asBytesList(v: unknown): Uint8Array[] {
    const items = unwrap<PyObject[]>(v as PyObject);
    return items.map((item) => unwrap<Uint8Array>(item));
  }

  it("rsplits on separator bytes", () => {
    const out = rsplit(new Uint8Array([97, 44, 98, 44, 99]), pyBytes(new Uint8Array([44])));
    expect(asBytesList(out).map((part) => Array.from(part))).toEqual([
      [97],
      [98],
      [99],
    ]);
  });

  it("respects maxsplit from the right", () => {
    const out = rsplit(
      new Uint8Array([97, 44, 98, 44, 99]),
      pyBytes(new Uint8Array([44])),
      pyInt(1),
    );
    expect(asBytesList(out).map((part) => Array.from(part))).toEqual([
      [97, 44, 98],
      [99],
    ]);
  });

  it("rsplits on whitespace when sep omitted", () => {
    const out = rsplit(
      new Uint8Array([97, 32, 32, 98, 32, 32, 99]),
      undefined,
      pyInt(1),
    );
    expect(asBytesList(out).map((part) => Array.from(part))).toEqual([
      [97, 32, 32, 98],
      [99],
    ]);
  });

  it("handles overlapping separator from the right", () => {
    const out = rsplit(new Uint8Array([97, 97, 97]), pyBytes(new Uint8Array([97, 97])));
    expect(asBytesList(out).map((part) => Array.from(part))).toEqual([[97], []]);
  });

  it("rejects empty separator", () => {
    expect(() => rsplit(new Uint8Array([120]), pyBytes(new Uint8Array([])))).toThrow(
      PyValueError,
    );
    expect(() => rsplit(new Uint8Array([120]), pyBytes(new Uint8Array([])))).toThrow(
      /empty separator/,
    );
  });

  it("maxsplit zero returns whole bytes", () => {
    const data = new Uint8Array([97, 32, 98, 32, 99]);
    const out = rsplit(data, undefined, pyInt(0));
    expect(asBytesList(out).map((part) => Array.from(part))).toEqual([
      Array.from(data),
    ]);
  });

  it("rejects non-bytes separator", () => {
    expect(() => rsplit(new Uint8Array([104, 105]), pyStr(","))).toThrow(PyTypeError);
    expect(() => rsplit(new Uint8Array([104, 105]), pyStr(","))).toThrow(
      /a bytes-like object is required, not 'str'/,
    );
  });

  it("empty bytes split on sep returns single empty element", () => {
    const out = rsplit(new Uint8Array([]), pyBytes(new Uint8Array([44])));
    expect(asBytesList(out).map((part) => Array.from(part))).toEqual([[]]);
  });

  it("empty bytes whitespace rsplit returns empty list", () => {
    const out = rsplit(new Uint8Array([]));
    expect(asBytesList(out)).toEqual([]);
  });
});
