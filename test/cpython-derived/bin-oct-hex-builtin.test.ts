/**
 * CPython: builtin bin, oct, and hex.
 */
import { describe, it, expect } from "vitest";
import {
  bin,
  hex,
  oct,
  pyInt,
  pyStr,
  unwrap,
} from "../../src/index.js";
import { PyTypeError } from "../../src/runtime/core/errors.js";

describe("cpython-derived bin builtin", () => {
  it("formats positive integers", () => {
    expect(unwrap(bin(pyInt(65)))).toBe("0b1000001");
    expect(unwrap(bin(pyInt(0)))).toBe("0b0");
    expect(unwrap(bin(pyInt(255)))).toBe("0b11111111");
  });

  it("formats negative integers", () => {
    expect(unwrap(bin(pyInt(-1)))).toBe("-0b1");
    expect(unwrap(bin(pyInt(-65)))).toBe("-0b1000001");
  });

  it("rejects zero arguments", () => {
    expect(() => bin()).toThrow(PyTypeError);
    expect(() => bin()).toThrow(/takes exactly one argument \(0 given\)/);
  });

  it("rejects non-integer argument", () => {
    expect(() => bin(pyStr("x"))).toThrow(PyTypeError);
    expect(() => bin(pyStr("x"))).toThrow(
      /cannot be interpreted as an integer/,
    );
  });
});

describe("cpython-derived oct builtin", () => {
  it("formats positive integers", () => {
    expect(unwrap(oct(pyInt(65)))).toBe("0o101");
    expect(unwrap(oct(pyInt(0)))).toBe("0o0");
    expect(unwrap(oct(pyInt(255)))).toBe("0o377");
  });

  it("formats negative integers", () => {
    expect(unwrap(oct(pyInt(-1)))).toBe("-0o1");
    expect(unwrap(oct(pyInt(-65)))).toBe("-0o101");
  });

  it("rejects zero arguments", () => {
    expect(() => oct()).toThrow(PyTypeError);
    expect(() => oct()).toThrow(/takes exactly one argument \(0 given\)/);
  });

  it("rejects non-integer argument", () => {
    expect(() => oct(pyStr("x"))).toThrow(PyTypeError);
    expect(() => oct(pyStr("x"))).toThrow(
      /cannot be interpreted as an integer/,
    );
  });
});

describe("cpython-derived hex builtin", () => {
  it("formats positive integers", () => {
    expect(unwrap(hex(pyInt(65)))).toBe("0x41");
    expect(unwrap(hex(pyInt(0)))).toBe("0x0");
    expect(unwrap(hex(pyInt(255)))).toBe("0xff");
  });

  it("formats negative integers", () => {
    expect(unwrap(hex(pyInt(-1)))).toBe("-0x1");
    expect(unwrap(hex(pyInt(-65)))).toBe("-0x41");
  });

  it("rejects zero arguments", () => {
    expect(() => hex()).toThrow(PyTypeError);
    expect(() => hex()).toThrow(/takes exactly one argument \(0 given\)/);
  });

  it("rejects non-integer argument", () => {
    expect(() => hex(pyStr("x"))).toThrow(PyTypeError);
    expect(() => hex(pyStr("x"))).toThrow(
      /cannot be interpreted as an integer/,
    );
  });
});
