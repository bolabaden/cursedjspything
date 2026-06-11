/**
 * CPython: complex float pow and floordiv/mod rejection.
 */
import { describe, it, expect } from "vitest";
import {
  complexNative,
  floordiv,
  ge,
  mod,
  pow,
  pyComplex,
  pyFloat,
  pyInt,
  repr,
} from "../../src/index.js";
import { PyTypeError } from "../../src/runtime/core/errors.js";

describe("cpython-derived complex pow and floordiv", () => {
  it("complex ** float uses polar form for non-integer exponent", () => {
    const z = complexNative(pow(pyComplex(1, 2), pyFloat(0.5)));
    expect(z.real).toBeCloseTo(1.272019649514069, 12);
    expect(z.imag).toBeCloseTo(0.786151377757453, 12);
  });

  it("complex ** integral float keeps integer path", () => {
    expect(repr(pow(pyComplex(1, 2), pyFloat(2)))).toBe("(-3+4j)");
  });

  it("floordiv and mod reject complex", () => {
    expect(() => floordiv(pyComplex(1, 2), pyInt(1))).toThrow(PyTypeError);
    expect(() => floordiv(pyComplex(1, 2), pyInt(1))).toThrow(
      /can't take floor of complex number\./,
    );
    expect(() => mod(pyComplex(1, 2), pyInt(1))).toThrow(PyTypeError);
    expect(() => mod(pyComplex(1, 2), pyInt(1))).toThrow(
      /can't take floor of complex number\./,
    );
  });

  it("ordering complex vs int is unsupported", () => {
    expect(() => ge(pyComplex(1, 2), pyInt(1))).toThrow(PyTypeError);
    expect(() => ge(pyComplex(1, 2), pyInt(1))).toThrow(
      /not supported between instances of 'complex' and 'int'/,
    );
  });
});
