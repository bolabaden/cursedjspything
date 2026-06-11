/**
 * CPython: str __repr__ quoting and escapes.
 */
import { describe, it, expect } from "vitest";
import { pyStr, repr } from "../../src/index.js";

describe("cpython-derived str repr", () => {
  it("quotes plain ASCII", () => {
    expect(repr(pyStr("hi"))).toBe("'hi'");
  });

  it("escapes quote and backslash", () => {
    expect(repr(pyStr("'"))).toBe("'\\''");
    expect(repr(pyStr("\\"))).toBe("'\\\\'");
    expect(repr(pyStr("it's"))).toBe("'it\\'s'");
    expect(repr(pyStr("a\\b"))).toBe("'a\\\\b'");
  });

  it("uses named escapes for common whitespace controls", () => {
    expect(repr(pyStr("\n"))).toBe("'\\n'");
    expect(repr(pyStr("\t"))).toBe("'\\t'");
    expect(repr(pyStr("\r"))).toBe("'\\r'");
    expect(repr(pyStr("a\nb"))).toBe("'a\\nb'");
  });

  it("escapes non-printable bytes with hex", () => {
    expect(repr(pyStr("\x00"))).toBe("'\\x00'");
    expect(repr(pyStr("\x7f"))).toBe("'\\x7f'");
    expect(repr(pyStr("\x80"))).toBe("'\\x80'");
  });

  it("keeps printable Unicode literal", () => {
    expect(repr(pyStr("é"))).toBe("'é'");
    expect(repr(pyStr("café"))).toBe("'café'");
    expect(repr(pyStr("Ā"))).toBe("'Ā'");
  });

  it("escapes non-printable BMP with unicode escape", () => {
    expect(repr(pyStr("\ud800"))).toBe("'\\ud800'");
    expect(repr(pyStr("\ufeff"))).toBe("'\\ufeff'");
  });
});
