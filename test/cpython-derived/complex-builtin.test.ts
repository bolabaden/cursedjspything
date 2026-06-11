/**
 * CPython: builtin complex constructor.
 */
import { describe, it, expect } from "vitest";
import {
  complex,
  complexProtocol,
  complexNative,
  complexType,
  pyBytes,
  pyComplex,
  pyFloat,
  pyInt,
  pyList,
  pyStr,
  pyTrue,
  repr,
} from "../../src/index.js";
import { PyTypeError, PyValueError } from "../../src/runtime/core/errors.js";

describe("cpython-derived complex builtin", () => {
  it("complex() returns zero", () => {
    const z = complex();
    expect(z.type).toBe(complexType);
    expect(complexNative(z)).toEqual({ real: 0, imag: 0 });
    expect(repr(z)).toBe("0j");
  });

  it("complex(number) converts via __complex__", () => {
    expect(complexNative(complex(pyInt(5)))).toEqual({ real: 5, imag: 0 });
    expect(complexNative(complex(pyFloat(2.5)))).toEqual({ real: 2.5, imag: 0 });
    expect(complexNative(complex(pyTrue))).toEqual({ real: 1, imag: 0 });
    const existing = pyComplex(1, 2);
    expect(complex(existing)).toBe(existing);
    expect(complexNative(complexProtocol(pyInt(3)))).toEqual({ real: 3, imag: 0 });
  });

  it("complex(real, imag) accepts two numerics", () => {
    expect(complexNative(complex(pyInt(1), pyInt(2)))).toEqual({
      real: 1,
      imag: 2,
    });
    expect(complexNative(complex(pyFloat(1.5), pyFloat(-2.5)))).toEqual({
      real: 1.5,
      imag: -2.5,
    });
  });

  it("complex(str) parses common literals", () => {
    expect(repr(complex(pyStr("1+2j")))).toBe("(1+2j)");
    expect(repr(complex(pyStr("3j")))).toBe("3j");
    expect(repr(complex(pyStr("1")))).toBe("(1+0j)");
    expect(repr(complex(pyStr(" 1.5-2.5j ")))).toBe("(1.5-2.5j)");
    expect(repr(complex(pyBytes(new Uint8Array([49, 43, 50, 106]))))).toBe(
      "(1+2j)",
    );
  });

  it("rejects malformed literals", () => {
    expect(() => complex(pyStr("abc"))).toThrow(PyValueError);
    expect(() => complex(pyStr("abc"))).toThrow(
      /complex\(\) arg is a malformed string: 'abc'/,
    );
  });

  it("rejects string first arg with second arg", () => {
    expect(() => complex(pyStr("1"), pyInt(2))).toThrow(PyTypeError);
    expect(() => complex(pyStr("1"), pyInt(2))).toThrow(
      /can't take second arg if first is a string/,
    );
  });

  it("rejects too many arguments", () => {
    expect(() => complex(pyInt(1), pyInt(2), pyInt(3))).toThrow(PyTypeError);
    expect(() => complex(pyInt(1), pyInt(2), pyInt(3))).toThrow(
      /expected at most 2 arguments, got 3/,
    );
  });

  it("rejects list without __complex__", () => {
    expect(() => complex(pyList([]))).toThrow(PyTypeError);
    expect(() => complex(pyList([]))).toThrow(
      /complex\(\) argument must be a string or a number, not 'list'/,
    );
  });
});
