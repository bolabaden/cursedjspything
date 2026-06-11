/**
 * CPython: complex.real, complex.imag, and complex.conjugate().
 */
import { describe, it, expect } from "vitest";
import {
  call,
  complexNative,
  getAttr,
  pyComplex,
  pyFloat,
  pyInt,
  repr,
  setAttr,
  unwrap,
} from "../../src/index.js";
import { PyAttributeError } from "../../src/runtime/core/errors.js";

describe("cpython-derived complex attributes", () => {
  const z = pyComplex(1, 2);

  it("real and imag return float components", () => {
    expect(unwrap(getAttr(z, "real") as ReturnType<typeof pyFloat>)).toBe(1);
    expect(unwrap(getAttr(z, "imag") as ReturnType<typeof pyFloat>)).toBe(2);
    expect(getAttr(z, "real")).not.toBe(pyInt(1));
  });

  it("conjugate returns complex with negated imaginary part", () => {
    const conj = getAttr(z, "conjugate");
    expect(repr(call(conj as ReturnType<typeof pyComplex>))).toBe("(1-2j)");
    expect(complexNative(call(conj as ReturnType<typeof pyComplex>))).toEqual({
      real: 1,
      imag: -2,
    });
  });

  it("real and imag are readonly", () => {
    expect(() => setAttr(z, "real", pyFloat(3))).toThrow(PyAttributeError);
    expect(() => setAttr(z, "real", pyFloat(3))).toThrow(/readonly attribute/);
    expect(() => setAttr(z, "imag", pyFloat(3))).toThrow(PyAttributeError);
    expect(() => setAttr(z, "imag", pyFloat(3))).toThrow(/readonly attribute/);
  });
});
