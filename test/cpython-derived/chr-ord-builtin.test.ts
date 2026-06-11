/**
 * CPython: builtin chr and ord.
 */
import { describe, it, expect } from "vitest";
import {
  chr,
  ord,
  pyBytes,
  pyFloat,
  pyInt,
  pyStr,
  unwrap,
} from "../../src/index.js";
import { PyTypeError, PyValueError } from "../../src/runtime/core/errors.js";

describe("cpython-derived chr builtin", () => {
  it("maps ASCII code point to str", () => {
    expect(unwrap(chr(pyInt(65)))).toBe("A");
  });

  it("maps maximum BMP code point", () => {
    expect(unwrap(chr(pyInt(0x10ffff)))).toBe("\u{10ffff}");
  });

  it("rejects zero arguments", () => {
    expect(() => chr()).toThrow(PyTypeError);
    expect(() => chr()).toThrow(/takes exactly one argument \(0 given\)/);
  });

  it("rejects out-of-range code points", () => {
    expect(() => chr(pyInt(0x110000))).toThrow(PyValueError);
    expect(() => chr(pyInt(0x110000))).toThrow(
      /chr\(\) arg not in range\(0x110000\)/,
    );
    expect(() => chr(pyInt(-1))).toThrow(PyValueError);
  });

  it("rejects non-integer argument", () => {
    expect(() => chr(pyStr("x"))).toThrow(PyTypeError);
    expect(() => chr(pyStr("x"))).toThrow(
      /cannot be interpreted as an integer/,
    );
  });
});

describe("cpython-derived ord builtin", () => {
  it("maps single-character str to int", () => {
    expect(unwrap(ord(pyStr("A")))).toBe(65);
  });

  it("maps supplementary code point", () => {
    expect(unwrap(ord(pyStr("\u{1F600}")))).toBe(0x1f600);
  });

  it("maps single-byte bytes to int", () => {
    expect(unwrap(ord(pyBytes(new Uint8Array([65]))))).toBe(65);
  });

  it("rejects zero arguments", () => {
    expect(() => ord()).toThrow(PyTypeError);
    expect(() => ord()).toThrow(/takes exactly one argument \(0 given\)/);
  });

  it("rejects empty or multi-character str", () => {
    expect(() => ord(pyStr(""))).toThrow(PyTypeError);
    expect(() => ord(pyStr(""))).toThrow(
      /expected a character, but string of length 0 found/,
    );
    expect(() => ord(pyStr("AB"))).toThrow(PyTypeError);
    expect(() => ord(pyStr("AB"))).toThrow(
      /expected a character, but string of length 2 found/,
    );
  });

  it("rejects empty or multi-byte bytes", () => {
    expect(() => ord(pyBytes(new Uint8Array([])))).toThrow(PyTypeError);
    expect(() => ord(pyBytes(new Uint8Array([1, 2])))).toThrow(PyTypeError);
    expect(() => ord(pyBytes(new Uint8Array([1, 2])))).toThrow(
      /expected a character, but string of length 2 found/,
    );
  });

  it("rejects non-str/non-bytes argument", () => {
    expect(() => ord(pyInt(65))).toThrow(PyTypeError);
    expect(() => ord(pyInt(65))).toThrow(
      /expected string of length 1, but int found/,
    );
    expect(() => ord(pyFloat(1.0))).toThrow(PyTypeError);
    expect(() => ord(pyFloat(1.0))).toThrow(
      /expected string of length 1, but float found/,
    );
  });
});

describe("cpython-derived chr ord roundtrip", () => {
  it("chr(ord(c)) restores single code point", () => {
    const c = pyStr("Z");
    expect(unwrap(chr(ord(c)))).toBe("Z");
  });
});
