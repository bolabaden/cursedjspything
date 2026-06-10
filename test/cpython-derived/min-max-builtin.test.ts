/**
 * CPython: builtin min / max.
 */
import { describe, it, expect } from "vitest";
import {
  max,
  min,
  pyInt,
  pyList,
  pyStr,
  pyTuple,
  unwrap,
} from "../../src/index.js";
import { PyTypeError, PyValueError } from "../../src/runtime/core/errors.js";

describe("cpython-derived min / max builtins", () => {
  it("min and max compare multiple positional values", () => {
    expect(unwrap(min(pyInt(3), pyInt(1), pyInt(2)))).toBe(1);
    expect(unwrap(max(pyInt(3), pyInt(1), pyInt(2)))).toBe(3);
  });

  it("min and max accept one iterable", () => {
    expect(unwrap(min(pyList([pyInt(5), pyInt(2), pyInt(8)])))).toBe(2);
    expect(unwrap(max(pyTuple([pyInt(5), pyInt(2), pyInt(8)])))).toBe(8);
  });

  it("min and max work on strings lexicographically", () => {
    expect(unwrap(min(pyStr("b"), pyStr("a"), pyStr("c")))).toBe("a");
    expect(unwrap(max(pyStr("b"), pyStr("a"), pyStr("c")))).toBe("c");
  });

  it("raises TypeError with zero arguments", () => {
    expect(() => min()).toThrow(PyTypeError);
    expect(() => max()).toThrow(PyTypeError);
  });

  it("raises ValueError for empty iterable", () => {
    expect(() => min(pyList([]))).toThrow(PyValueError);
    expect(() => max(pyTuple([]))).toThrow(PyValueError);
  });

  it("raises TypeError for non-iterable single argument", () => {
    expect(() => min(pyInt(1))).toThrow(PyTypeError);
  });

  it("raises TypeError when elements are not orderable", () => {
    expect(() => min(pyInt(1), pyStr("a"))).toThrow(PyTypeError);
    expect(() => max(pyList([pyInt(1), pyStr("a")]))).toThrow(PyTypeError);
  });
});
