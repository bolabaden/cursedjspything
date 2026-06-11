/**
 * CPython: scalar / complex, divmod rejection, and three-arg pow complex modulo.
 */
import { describe, it, expect } from "vitest";
import {
  complexNative,
  divmod,
  pow,
  pyComplex,
  pyFloat,
  pyInt,
  pyTrue,
  repr,
  truediv,
} from "../../src/index.js";
import { PyTypeError, PyValueError } from "../../src/runtime/core/errors.js";

describe("cpython-derived scalar-complex truediv and pow modulo", () => {
  const c = pyComplex(1, 2);

  it("scalar / complex uses complex.__rtruediv__", () => {
    expect(repr(truediv(pyInt(2), c))).toBe("(0.4-0.8j)");
    expect(repr(truediv(pyFloat(2), c))).toBe("(0.4-0.8j)");
    expect(repr(truediv(pyTrue, c))).toBe("(0.2-0.4j)");
  });

  it("divmod with complex divisor is unsupported", () => {
    for (const left of [pyInt(2), pyFloat(2)]) {
      const typename = left.type.name;
      expect(() => divmod(left, c)).toThrow(PyTypeError);
      expect(() => divmod(left, c)).toThrow(
        new RegExp(`unsupported operand type\\(s\\) for divmod\\(\\): '${typename}' and 'complex'`),
      );
    }
  });

  it("three-arg pow rejects complex base, exponent, or modulus", () => {
    const cases = [
      () => pow(pyComplex(1, 2), pyInt(2), pyInt(3)),
      () => pow(pyInt(2), pyComplex(1, 2), pyInt(3)),
      () => pow(pyInt(2), pyInt(3), pyComplex(1, 2)),
    ];
    for (const fn of cases) {
      expect(fn).toThrow(PyValueError);
      expect(fn).toThrow(/complex modulo/);
    }
  });

  it("two-arg pow int ** complex still works", () => {
    const z = complexNative(pow(pyInt(2), c));
    expect(z.real).toBeCloseTo(0.36691394948660344, 12);
    expect(z.imag).toBeCloseTo(1.9660554808224875, 12);
  });
});
