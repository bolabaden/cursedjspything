/**
 * CPython: complex equality and integer exponentiation.
 */
import { describe, it, expect } from "vitest";
import {
  eq,
  lt,
  ne,
  pow,
  pyComplex,
  pyInt,
  repr,
} from "../../src/index.js";
import { PyTypeError, PyZeroDivisionError } from "../../src/runtime/core/errors.js";

describe("cpython-derived complex eq and pow", () => {
  it("complex equality", () => {
    expect(eq(pyComplex(1, 2), pyComplex(1, 2))).toBe(true);
    expect(ne(pyComplex(1, 2), pyComplex(1, 3))).toBe(true);
  });

  it("complex scalar equality when imag is zero", () => {
    expect(eq(pyComplex(1, 0), pyInt(1))).toBe(true);
    expect(eq(pyComplex(1, 2), pyInt(1))).toBe(false);
    expect(eq(pyInt(1), pyComplex(1, 0))).toBe(true);
  });

  it("complex ** int", () => {
    expect(repr(pow(pyComplex(1, 2), pyInt(2)))).toBe("(-3+4j)");
    expect(repr(pow(pyComplex(1, 2), pyInt(0)))).toBe("(1+0j)");
  });

  it("zero to negative power raises PyZeroDivisionError", () => {
    expect(() => pow(pyComplex(0, 0), pyInt(-1))).toThrow(PyZeroDivisionError);
    expect(() => pow(pyComplex(0, 0), pyInt(-1))).toThrow(
      /0\.0 cannot be raised to a negative power/,
    );
  });

  it("ordering comparisons are unsupported", () => {
    expect(() => lt(pyComplex(1, 2), pyComplex(1, 3))).toThrow(PyTypeError);
    expect(() => lt(pyComplex(1, 2), pyComplex(1, 3))).toThrow(
      /not supported between instances of 'complex' and 'complex'/,
    );
  });
});
