/**
 * CPython: scalar ** complex edge cases via complex.__rpow__.
 */
import { describe, it, expect } from "vitest";
import {
  complexNative,
  pow,
  pyComplex,
  pyFalse,
  pyFloat,
  pyInt,
  pyTrue,
} from "../../src/index.js";
import { PyZeroDivisionError } from "../../src/runtime/core/errors.js";

describe("cpython-derived scalar-complex pow edges", () => {
  const c = pyComplex(1, 2);
  const zeroJ = pyComplex(0, 0);
  const imagJ = pyComplex(0, 1);
  const negTwoPow2j = pyComplex(0, 2);

  it("bool ** complex follows int subclass semantics", () => {
    const one = complexNative(pow(pyTrue, c));
    expect(one.real).toBeCloseTo(1, 12);
    expect(one.imag).toBeCloseTo(0, 12);
    expect(() => pow(pyFalse, c)).toThrow(PyZeroDivisionError);
    expect(() => pow(pyFalse, c)).toThrow(/zero to a negative or complex power/);
  });

  it("zero ** 0j is one; zero ** nonzero complex raises", () => {
    const one = complexNative(pow(pyInt(0), zeroJ));
    expect(one.real).toBe(1);
    expect(one.imag).toBe(0);
    expect(() => pow(pyInt(0), imagJ)).toThrow(PyZeroDivisionError);
    expect(() => pow(pyFloat(0), imagJ)).toThrow(PyZeroDivisionError);
    expect(() => pow(pyInt(0), c)).toThrow(PyZeroDivisionError);
    expect(() => pow(pyFloat(0), c)).toThrow(PyZeroDivisionError);
  });

  it("positive scalar ** 0j is one for int and float", () => {
    for (const base of [pyInt(2), pyFloat(2)]) {
      const z = complexNative(pow(base, zeroJ));
      expect(z.real).toBeCloseTo(1, 12);
      expect(z.imag).toBeCloseTo(0, 12);
    }
  });

  it("negative int base ** pure imaginary exponent matches CPython", () => {
    const z = complexNative(pow(pyInt(-2), negTwoPow2j));
    expect(z.real).toBeCloseTo(0.000342595394065515, 12);
    expect(z.imag).toBeCloseTo(0.0018357480088983052, 12);
  });

  it("int and float ** complex share __rpow__ for finite positive base", () => {
    const zi = complexNative(pow(pyInt(2), c));
    const zf = complexNative(pow(pyFloat(2), c));
    expect(zf.real).toBeCloseTo(zi.real, 12);
    expect(zf.imag).toBeCloseTo(zi.imag, 12);
  });
});
