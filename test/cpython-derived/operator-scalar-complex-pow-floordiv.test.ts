/**
 * CPython: int/float ** complex via complex.__rpow__; scalar // and % complex reject.
 */
import { describe, it, expect } from "vitest";
import {
  complexNative,
  floordiv,
  mod,
  pow,
  pyComplex,
  pyFloat,
  pyInt,
} from "../../src/index.js";
import { PyTypeError, PyZeroDivisionError } from "../../src/runtime/core/errors.js";

describe("cpython-derived scalar-complex pow and floordiv", () => {
  const c = pyComplex(1, 2);

  it("int and float ** complex use complex.__rpow__", () => {
    const z = complexNative(pow(pyInt(2), c));
    expect(z.real).toBeCloseTo(0.36691394948660344, 12);
    expect(z.imag).toBeCloseTo(1.9660554808224875, 12);
    const f = complexNative(pow(pyFloat(2), c));
    expect(f.real).toBeCloseTo(z.real, 12);
    expect(f.imag).toBeCloseTo(z.imag, 12);
  });

  it("zero to complex power raises ZeroDivisionError", () => {
    expect(() => pow(pyInt(0), c)).toThrow(PyZeroDivisionError);
    expect(() => pow(pyInt(0), c)).toThrow(/zero to a negative or complex power/);
  });

  it("int and float floordiv/mod with complex are unsupported", () => {
    for (const left of [pyInt(1), pyFloat(1)]) {
      const typename = left.type.name;
      expect(() => floordiv(left, c)).toThrow(PyTypeError);
      expect(() => floordiv(left, c)).toThrow(
        new RegExp(`unsupported operand type\\(s\\) for //: '${typename}' and 'complex'`),
      );
      expect(() => mod(left, c)).toThrow(PyTypeError);
      expect(() => mod(left, c)).toThrow(
        new RegExp(`unsupported operand type\\(s\\) for %: '${typename}' and 'complex'`),
      );
    }
  });
});
