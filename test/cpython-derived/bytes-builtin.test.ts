/**
 * CPython: builtin bytes constructor.
 */
import { describe, it, expect } from "vitest";
import {
  bytes,
  bytesType,
  pyBytes,
  pyInt,
  pyList,
  pyStr,
  pyTrue,
  pyFalse,
  unwrap,
} from "../../src/index.js";
import {
  PyTypeError,
  PyUnicodeEncodeError,
  PyValueError,
} from "../../src/runtime/core/errors.js";

describe("cpython-derived bytes builtin", () => {
  it("bytes() returns empty bytes", () => {
    const b = bytes();
    expect(b.type).toBe(bytesType);
    expect(unwrap(b)).toEqual(new Uint8Array([]));
  });

  it("bytes(n) allocates zero-filled payload", () => {
    expect(Array.from(unwrap(bytes(pyInt(0))))).toEqual([]);
    expect(Array.from(unwrap(bytes(pyInt(3))))).toEqual([0, 0, 0]);
    expect(Array.from(unwrap(bytes(pyTrue)))).toEqual([0]);
  });

  it("bytes(n) rejects negative size", () => {
    expect(() => bytes(pyInt(-1))).toThrow(PyValueError);
    expect(() => bytes(pyInt(-1))).toThrow(/negative count/);
  });

  it("bytes(iterable) builds payload from ints 0-255", () => {
    expect(
      Array.from(unwrap(bytes(pyList([pyInt(65), pyInt(66)])))),
    ).toEqual([65, 66]);
    expect(
      Array.from(unwrap(bytes(pyList([pyTrue, pyFalse])))),
    ).toEqual([1, 0]);
  });

  it("bytes(iterable) rejects out-of-range ints", () => {
    expect(() => bytes(pyList([pyInt(256)]))).toThrow(PyValueError);
    expect(() => bytes(pyList([pyInt(256)]))).toThrow(
      /bytes must be in range\(0, 256\)/,
    );
  });

  it("bytes(bytes) returns the same object", () => {
    const b = pyBytes(new Uint8Array([97, 98, 99]));
    expect(bytes(b)).toBe(b);
  });

  it("bytes(str) without encoding raises TypeError", () => {
    expect(() => bytes(pyStr("ab"))).toThrow(PyTypeError);
    expect(() => bytes(pyStr("ab"))).toThrow(
      /string argument without an encoding/,
    );
  });

  it("bytes(str, encoding) encodes payload", () => {
    expect(
      Array.from(unwrap(bytes(pyStr("ab"), pyStr("utf-8")))),
    ).toEqual([97, 98]);
    expect(
      Array.from(unwrap(bytes(pyStr("ÿ"), pyStr("latin-1")))),
    ).toEqual([255]);
  });

  it("bytes(str, encoding, errors) forwards errors mode", () => {
    expect(
      Array.from(
        unwrap(bytes(pyStr("ÿ"), pyStr("ascii"), pyStr("replace"))),
      ),
    ).toEqual([63]);
    expect(() =>
      bytes(pyStr("ÿ"), pyStr("ascii")),
    ).toThrow(PyUnicodeEncodeError);
  });

  it("rejects encode on non-str object", () => {
    expect(() => bytes(pyInt(1), pyStr("utf-8"))).toThrow(PyTypeError);
    expect(() => bytes(pyInt(1), pyStr("utf-8"))).toThrow(
      /encoding without a string argument/,
    );
    expect(() => bytes(pyList([]), pyStr("utf-8"))).toThrow(
      /encoding without a string argument/,
    );
  });

  it("rejects bad encoding and errors types", () => {
    expect(() => bytes(pyStr("ab"), pyInt(1))).toThrow(PyTypeError);
    expect(() => bytes(pyStr("ab"), pyInt(1))).toThrow(
      /argument 'encoding' must be str, not int/,
    );
    expect(() =>
      bytes(pyStr("ab"), pyStr("utf-8"), pyInt(1)),
    ).toThrow(PyTypeError);
    expect(() =>
      bytes(pyStr("ab"), pyStr("utf-8"), pyInt(1)),
    ).toThrow(/argument 'errors' must be str, not int/);
  });

  it("rejects too many arguments", () => {
    expect(() =>
      bytes(pyStr("ab"), pyStr("utf-8"), pyStr("strict"), pyInt(1)),
    ).toThrow(PyTypeError);
    expect(() =>
      bytes(pyStr("ab"), pyStr("utf-8"), pyStr("strict"), pyInt(1)),
    ).toThrow(/takes at most 3 arguments \(4 given\)/);
  });
});
