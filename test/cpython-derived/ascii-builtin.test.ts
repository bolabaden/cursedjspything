/**
 * CPython: builtin ascii.
 */
import { describe, it, expect } from "vitest";
import {
  ascii,
  pyBytes,
  pyInt,
  pyStr,
  unwrap,
} from "../../src/index.js";
import { PyTypeError } from "../../src/runtime/core/errors.js";

describe("cpython-derived ascii builtin", () => {
  it("repr-escapes non-ASCII in str", () => {
    expect(unwrap(ascii(pyStr("café")))).toBe("'caf\\xe9'");
  });

  it("passes through ASCII repr", () => {
    expect(unwrap(ascii(pyStr("A")))).toBe("'A'");
    expect(unwrap(ascii(pyStr("\n")))).toBe("'\\n'");
  });

  it("uses repr for bytes", () => {
    expect(unwrap(ascii(pyBytes(new Uint8Array([104, 105]))))).toBe("b'hi'");
  });

  it("escapes supplementary code points", () => {
    expect(unwrap(ascii(pyStr("\u{1F600}")))).toBe("'\\U0001f600'");
  });

  it("rejects zero arguments", () => {
    expect(() => ascii()).toThrow(PyTypeError);
    expect(() => ascii()).toThrow(/takes exactly one argument \(0 given\)/);
  });

  it("rejects extra arguments", () => {
    expect(() => ascii(pyStr("a"), pyStr("b"))).toThrow(PyTypeError);
    expect(() => ascii(pyStr("a"), pyStr("b"))).toThrow(
      /takes exactly one argument \(2 given\)/,
    );
  });

  it("formats int repr", () => {
    expect(unwrap(ascii(pyInt(65)))).toBe("65");
  });
});
