/**
 * CPython: bytes.splitlines splits on line breaks.
 */
import { describe, it, expect } from "vitest";
import {
  PyObject,
  getAttr,
  pyBytes,
  pyInt,
  pyTrue,
  unwrap,
} from "../../src/index.js";
import { PyTypeError } from "../../src/runtime/core/errors.js";

type SplitlinesFn = (self: PyObject, keepends?: unknown) => unknown;

describe("cpython-derived bytes splitlines", () => {
  function splitlines(data: Uint8Array, keepends?: unknown): unknown {
    const self = pyBytes(data);
    const fn = getAttr(self, "splitlines") as SplitlinesFn;
    if (keepends !== undefined) return fn(self, keepends);
    return fn(self);
  }

  function asBytesList(v: unknown): number[][] {
    const items = unwrap<PyObject[]>(v as PyObject);
    return items.map((item) => Array.from(unwrap<Uint8Array>(item)));
  }

  it("splits on newline and crlf", () => {
    const data = new Uint8Array([97, 10, 98, 13, 10, 99]);
    expect(asBytesList(splitlines(data))).toEqual([[97], [98], [99]]);
  });

  it("splits on lone carriage return", () => {
    const data = new Uint8Array([97, 13, 98]);
    expect(asBytesList(splitlines(data))).toEqual([[97], [98]]);
    expect(asBytesList(splitlines(data, pyTrue))).toEqual([[97, 13], [98]]);
  });

  it("keeps line breaks when keepends is true", () => {
    const data = new Uint8Array([97, 10, 98, 13, 10, 99, 13, 10]);
    expect(asBytesList(splitlines(data, pyTrue))).toEqual([
      [97, 10],
      [98, 13, 10],
      [99, 13, 10],
    ]);
  });

  it("returns empty list for empty bytes", () => {
    expect(asBytesList(splitlines(new Uint8Array([])))).toEqual([]);
    expect(asBytesList(splitlines(new Uint8Array([]), pyTrue))).toEqual([]);
  });

  it("treats lone newline as empty line", () => {
    expect(asBytesList(splitlines(new Uint8Array([10])))).toEqual([[]]);
    expect(asBytesList(splitlines(new Uint8Array([10]), pyTrue))).toEqual([[10]]);
  });

  it("splits consecutive newlines into empty segments", () => {
    expect(asBytesList(splitlines(new Uint8Array([97, 10, 10])))).toEqual([
      [97],
      [],
    ]);
  });

  it("returns single segment when no line breaks", () => {
    expect(asBytesList(splitlines(new Uint8Array([97, 98, 99])))).toEqual([
      [97, 98, 99],
    ]);
  });

  it("does not split on non-newline line break bytes (CPython bytes API)", () => {
    expect(asBytesList(splitlines(new Uint8Array([97, 11, 98])))).toEqual([
      [97, 11, 98],
    ]);
    expect(asBytesList(splitlines(new Uint8Array([97, 12, 98])))).toEqual([
      [97, 12, 98],
    ]);
    const lineSep = new Uint8Array([97, 0xe2, 0x80, 0xa8, 98]);
    expect(asBytesList(splitlines(lineSep))).toEqual([Array.from(lineSep)]);
    const paraSep = new Uint8Array([97, 0xe2, 0x80, 0xa9, 98]);
    expect(asBytesList(splitlines(paraSep))).toEqual([Array.from(paraSep)]);
  });

  it("rejects non-bool keepends", () => {
    expect(() => splitlines(new Uint8Array([97]), pyInt(1))).toThrow(PyTypeError);
    expect(() => splitlines(new Uint8Array([97]), pyInt(1))).toThrow(
      /splitlines\(\) argument must be bool, not int/,
    );
  });
});
