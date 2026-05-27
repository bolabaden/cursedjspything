/**
 * CPython: bytes.split returns a list of bytes segments.
 */
import { describe, it, expect } from "vitest";
import {
  PyObject,
  bytesType,
  getAttr,
  pyBytes,
  pyInt,
  pyStr,
  unwrap,
} from "../../src/index.js";
import { PyTypeError, PyValueError } from "../../src/runtime/core/errors.js";

type SplitFn = (self: PyObject, sep?: unknown, maxsplit?: unknown) => unknown;

describe("cpython-derived bytes split", () => {
  function split(
    data: Uint8Array,
    sep?: unknown,
    maxsplit?: unknown,
  ): unknown {
    const self = pyBytes(data);
    const splitFn = getAttr(self, "split") as SplitFn;
    if (maxsplit !== undefined) {
      return splitFn(self, sep, maxsplit);
    }
    if (sep !== undefined) {
      return splitFn(self, sep);
    }
    return splitFn(self);
  }

  function asBytesList(v: unknown): Uint8Array[] {
    const items = unwrap<PyObject[]>(v as PyObject);
    return items.map((item) => unwrap<Uint8Array>(item));
  }

  it("splits on separator bytes", () => {
    const out = split(new Uint8Array([97, 44, 98, 44, 99]), pyBytes(new Uint8Array([44])));
    expect((out as PyObject).type.name).toBe("list");
    expect(asBytesList(out).map((part) => Array.from(part))).toEqual([
      [97],
      [98],
      [99],
    ]);
  });

  it("respects maxsplit", () => {
    const out = split(
      new Uint8Array([97, 44, 98, 44, 99]),
      pyBytes(new Uint8Array([44])),
      pyInt(1),
    );
    expect(asBytesList(out).map((part) => Array.from(part))).toEqual([
      [97],
      [98, 44, 99],
    ]);
  });

  it("splits on whitespace when sep omitted", () => {
    const out = split(new Uint8Array([97, 32, 32, 98]));
    expect(asBytesList(out).map((part) => Array.from(part))).toEqual([
      [97],
      [98],
    ]);
  });

  it("handles overlapping separator", () => {
    const out = split(new Uint8Array([97, 97, 97]), pyBytes(new Uint8Array([97, 97])));
    expect(asBytesList(out).map((part) => Array.from(part))).toEqual([[], [97]]);
  });

  it("rejects empty separator", () => {
    expect(() => split(new Uint8Array([120]), pyBytes(new Uint8Array([])))).toThrow(
      PyValueError,
    );
    expect(() => split(new Uint8Array([120]), pyBytes(new Uint8Array([])))).toThrow(
      /empty separator/,
    );
  });

  it("maxsplit zero returns whole bytes", () => {
    const data = new Uint8Array([97, 32, 98, 32, 99]);
    const out = split(data, undefined, pyInt(0));
    expect(asBytesList(out).map((part) => Array.from(part))).toEqual([
      Array.from(data),
    ]);
  });

  it("rejects non-bytes separator", () => {
    expect(() => split(new Uint8Array([104, 105]), pyStr(","))).toThrow(PyTypeError);
    expect(() => split(new Uint8Array([104, 105]), pyStr(","))).toThrow(
      /a bytes-like object is required, not 'str'/,
    );
  });

  it("empty bytes split on sep returns single empty element", () => {
    const out = split(new Uint8Array([]), pyBytes(new Uint8Array([44])));
    expect(asBytesList(out).map((part) => Array.from(part))).toEqual([[]]);
  });

  it("empty bytes whitespace split returns empty list", () => {
    const out = split(new Uint8Array([]));
    expect(asBytesList(out)).toEqual([]);
  });
});
