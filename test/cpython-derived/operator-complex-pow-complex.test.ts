/**
 * CPython: complex ** complex exponentiation.
 */
import { describe, it, expect } from "vitest";
import {
  complexNative,
  pow,
  pyComplex,
  pyInt,
  repr,
} from "../../src/index.js";
import { PyZeroDivisionError } from "../../src/runtime/core/errors.js";

describe("cpython-derived complex ** complex", () => {
  it("(1+2j) ** (1+2j) matches CPython exp(log) formula", () => {
    const z = complexNative(pow(pyComplex(1, 2), pyComplex(1, 2)));
    expect(z.real).toBeCloseTo(-0.22251715680177264, 12);
    expect(z.imag).toBeCloseTo(0.1007091311360754, 12);
  });

  it("zero base edge cases", () => {
    expect(complexNative(pow(pyComplex(0, 0), pyComplex(0, 0)))).toEqual({
      real: 1,
      imag: 0,
    });
    expect(repr(pow(pyComplex(0, 0), pyComplex(1, 0)))).toBe("0j");
    expect(repr(pow(pyComplex(0, 0), pyComplex(1, 1)))).toBe("0j");
  });

  it("zero to negative complex exponent raises", () => {
    expect(() => pow(pyComplex(0, 0), pyComplex(-1, 0))).toThrow(
      PyZeroDivisionError,
    );
  });

  it("scalar exponent path unchanged", () => {
    expect(repr(pow(pyComplex(1, 2), pyInt(2)))).toBe("(-3+4j)");
  });
});
