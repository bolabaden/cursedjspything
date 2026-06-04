/**
 * CPython: bytes.hex / bytes.fromhex hex encoding.
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

type HexFn = (self: PyObject, sep?: unknown) => unknown;
type FromhexFn = (_cls: unknown, arg: unknown) => unknown;

describe("cpython-derived bytes hex fromhex", () => {
  const deadbeef = new Uint8Array([0xde, 0xad, 0xbe, 0xef]);

  function hex(data: Uint8Array, sep?: unknown): string {
    const self = pyBytes(data);
    const fn = getAttr(self, "hex") as HexFn;
    const result = sep !== undefined ? fn(self, sep) : fn(self);
    return unwrap<string>(result as PyObject);
  }

  function fromhex(arg: unknown): Uint8Array {
    const fn = bytesType.typeDict.get("fromhex") as FromhexFn;
    return unwrap<Uint8Array>(fn(bytesType, arg) as PyObject);
  }

  it("hex encodes bytes as lowercase hex with optional separator", () => {
    expect(hex(deadbeef)).toBe("deadbeef");
    expect(hex(deadbeef, pyBytes(new Uint8Array([0x3a])))).toBe("de:ad:be:ef");
    expect(hex(new Uint8Array([]))).toBe("");
  });

  it("fromhex decodes hex with ignored whitespace", () => {
    expect(fromhex(pyStr("dead beef"))).toEqual(deadbeef);
    expect(fromhex(pyStr("DEADBEEF"))).toEqual(deadbeef);
    expect(fromhex(pyStr(""))).toEqual(new Uint8Array([]));
  });

  it("fromhex accepts bytes-like argument", () => {
    const hexAscii = new TextEncoder().encode("deadbeef");
    expect(fromhex(pyBytes(hexAscii))).toEqual(deadbeef);
    const spaced = new TextEncoder().encode("DE AD BE EF");
    expect(fromhex(pyBytes(spaced))).toEqual(deadbeef);
  });

  it("raises on invalid hex input or separator", () => {
    expect(() => fromhex(pyStr("abc"))).toThrow(PyValueError);
    expect(() => fromhex(pyStr("abc"))).toThrow(
      /even number of hexadecimal digits/,
    );
    expect(() => fromhex(pyStr("gg"))).toThrow(PyValueError);
    expect(() => fromhex(pyStr("gg"))).toThrow(
      /non-hexadecimal number found in fromhex\(\) arg at position/,
    );
    expect(() => fromhex(pyInt(1))).toThrow(PyTypeError);
    expect(() => fromhex(pyInt(1))).toThrow(
      /fromhex\(\) argument must be str or bytes-like, not 'int'/,
    );
    expect(() => hex(deadbeef, pyInt(1))).toThrow(PyTypeError);
    expect(() => hex(deadbeef, pyInt(1))).toThrow(
      /object of type 'int' has no len\(\)/,
    );
    expect(() => hex(deadbeef, pyBytes(new Uint8Array([])))).toThrow(PyValueError);
    expect(() => hex(deadbeef, pyBytes(new Uint8Array([])))).toThrow(
      /sep must be length 1/,
    );
  });
});
