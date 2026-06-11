/**
 * CPython: complex truediv and unary neg/pos/abs.
 */
import { describe, it, expect } from "vitest";
import {
  abs,
  complexNative,
  neg,
  pos,
  pyComplex,
  pyInt,
  repr,
  truediv,
  unwrap,
} from "../../src/index.js";
import { PyZeroDivisionError } from "../../src/runtime/core/errors.js";

describe("cpython-derived complex div and unary", () => {
  it("complex / scalar", () => {
    expect(repr(truediv(pyComplex(1, 2), pyInt(2)))).toBe("(0.5+1j)");
  });

  it("scalar / complex", () => {
    expect(repr(truediv(pyInt(2), pyComplex(1, 2)))).toBe("(0.4-0.8j)");
  });

  it("complex / complex", () => {
    expect(repr(truediv(pyComplex(1, 2), pyComplex(1, 1)))).toBe(
      "(1.5+0.5j)",
    );
  });

  it("zero divisor raises PyZeroDivisionError", () => {
    expect(() => truediv(pyComplex(1, 2), pyInt(0))).toThrow(
      PyZeroDivisionError,
    );
    expect(() => truediv(pyComplex(1, 2), pyInt(0))).toThrow(
      /division by zero/,
    );
    expect(() => truediv(pyComplex(1, 2), pyComplex(0, 0))).toThrow(
      PyZeroDivisionError,
    );
  });

  it("unary neg and pos", () => {
    const z = pyComplex(1, 2);
    expect(repr(neg(z))).toBe("(-1-2j)");
    expect(complexNative(pos(z))).toEqual({ real: 1, imag: 2 });
  });

  it("abs returns float magnitude", () => {
    expect(unwrap<number>(abs(pyComplex(3, 4)))).toBe(5);
  });
});
