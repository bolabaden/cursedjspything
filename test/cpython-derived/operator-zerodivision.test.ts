/**
 * Vitest ports of CPython division-by-zero operator errors.
 * Source: Lib/test/test_operator.py / test_types.py spirit.
 */
import { describe, it, expect } from "vitest";
import {
  truediv,
  floordiv,
  mod,
  divmod,
  pyInt,
  pyFloat,
  unwrap,
} from "../../src/index.js";
import type { PyObject } from "../../src/runtime/core/object.js";
import { PyZeroDivisionError } from "../../src/runtime/core/errors.js";

describe("cpython-derived int zero division", () => {
  it("truediv raises ZeroDivisionError", () => {
    expect(() => truediv(pyInt(1), pyInt(0))).toThrow(PyZeroDivisionError);
    expect(() => truediv(pyInt(1), pyInt(0))).toThrow(/division by zero/);
  });

  it("floordiv raises ZeroDivisionError", () => {
    expect(() => floordiv(pyInt(1), pyInt(0))).toThrow(PyZeroDivisionError);
    expect(() => floordiv(pyInt(1), pyInt(0))).toThrow(
      /integer division or modulo by zero/,
    );
  });

  it("mod raises ZeroDivisionError", () => {
    expect(() => mod(pyInt(1), pyInt(0))).toThrow(PyZeroDivisionError);
    expect(() => mod(pyInt(1), pyInt(0))).toThrow(/integer modulo by zero/);
  });

  it("motion__ / divmod raises ZeroDivisionError", () => {
    expect(() => divmod(pyInt(1), pyInt(0))).toThrow(PyZeroDivisionError);
    expect(() => divmod(pyInt(1), pyInt(0))).toThrow(
      /integer division or modulo by zero/,
    );
  });
});

describe("cpython-derived float zero division", () => {
  it("truediv raises ZeroDivisionError", () => {
    expect(() => truediv(pyFloat(1), pyFloat(0))).toThrow(PyZeroDivisionError);
    expect(() => truediv(pyFloat(1), pyFloat(0))).toThrow(
      /float division by zero/,
    );
  });

  it("floordiv raises ZeroDivisionError", () => {
    expect(() => floordiv(pyFloat(1), pyFloat(0))).toThrow(PyZeroDivisionError);
    expect(() => floordiv(pyFloat(1), pyFloat(0))).toThrow(
      /float floor division by zero/,
    );
  });

  it("mod raises ZeroDivisionError", () => {
    expect(() => mod(pyFloat(1), pyFloat(0))).toThrow(PyZeroDivisionError);
    expect(() => mod(pyFloat(1), pyFloat(0))).toThrow(/float modulo/);
  });

  it("divmod raises ZeroDivisionError", () => {
    expect(() => divmod(pyFloat(1), pyFloat(0))).toThrow(PyZeroDivisionError);
    expect(() => divmod(pyFloat(1), pyFloat(0))).toThrow(/division by zero/);
  });

  it("divmod returns float quotient and remainder", () => {
    const pair = unwrap(divmod(pyFloat(7), pyFloat(3)) as PyObject) as PyObject[];
    expect(pair).toHaveLength(2);
    expect(unwrap(pair[0] as PyObject)).toBe(2);
    expect(unwrap(pair[1] as PyObject)).toBe(1);
  });
});
