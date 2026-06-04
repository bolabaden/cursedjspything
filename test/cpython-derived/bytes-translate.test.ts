/**
 * CPython: bytes.maketrans / bytes.translate.
 */
import { describe, it, expect } from "vitest";
import {
  PyObject,
  bytesType,
  getAttr,
  pyBytes,
  pyInt,
  unwrap,
} from "../../src/index.js";
import { PyTypeError, PyValueError } from "../../src/runtime/core/errors.js";

type MaketransFn = (_cls: unknown, frm: unknown, to: unknown) => unknown;
type TranslateFn = (self: PyObject, table: unknown) => unknown;

describe("cpython-derived bytes translate", () => {
  function maketrans(frm: Uint8Array, to: Uint8Array): Uint8Array {
    const fn = bytesType.typeDict.get("maketrans") as MaketransFn;
    return unwrap<Uint8Array>(fn(bytesType, pyBytes(frm), pyBytes(to)) as PyObject);
  }

  function translate(data: Uint8Array, table: Uint8Array): Uint8Array {
    const self = pyBytes(data);
    const fn = getAttr(self, "translate") as TranslateFn;
    return unwrap<Uint8Array>(fn(self, pyBytes(table)) as PyObject);
  }

  it("maketrans builds a 256-byte table and translate applies it", () => {
    const table = maketrans(new Uint8Array([97, 98]), new Uint8Array([49, 50]));
    expect(table.length).toBe(256);
    expect(table[97]).toBe(49);
    expect(table[98]).toBe(50);
    expect(table[99]).toBe(99);
    expect(translate(new Uint8Array([97, 98, 99]), table)).toEqual(
      new Uint8Array([49, 50, 99]),
    );
  });

  it("translate with identity table returns equivalent bytes", () => {
    const table = maketrans(new Uint8Array([]), new Uint8Array([]));
    const data = new Uint8Array([0, 127, 255]);
    expect(translate(data, table)).toEqual(data);
    expect(translate(new Uint8Array([]), table)).toEqual(new Uint8Array([]));
  });

  it("raises ValueError on length mismatch or bad table size", () => {
    expect(() => maketrans(new Uint8Array([97]), new Uint8Array([49, 50]))).toThrow(
      PyValueError,
    );
    expect(() => maketrans(new Uint8Array([97]), new Uint8Array([49, 50]))).toThrow(
      /same length/,
    );
    expect(() =>
      translate(new Uint8Array([97]), new Uint8Array([49, 50])),
    ).toThrow(PyValueError);
    expect(() =>
      translate(new Uint8Array([97]), new Uint8Array([49, 50])),
    ).toThrow(/256 characters long/);
  });

  it("raises TypeError on non-bytes operands", () => {
    const fn = bytesType.typeDict.get("maketrans") as MaketransFn;
    expect(() => fn(bytesType, pyInt(1), pyBytes(new Uint8Array([49])))).toThrow(
      PyTypeError,
    );
    const self = pyBytes(new Uint8Array([97]));
    const tr = getAttr(self, "translate") as TranslateFn;
    expect(() => tr(self, pyInt(1))).toThrow(PyTypeError);
  });
});
