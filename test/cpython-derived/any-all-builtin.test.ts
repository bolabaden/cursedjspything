/**
 * CPython: builtin any / all.
 */
import { describe, it, expect } from "vitest";
import {
  all,
  any,
  pyFalse,
  pyInt,
  pyList,
  pyStr,
  pyTrue,
  pyTuple,
  unwrap,
} from "../../src/index.js";
import { PyTypeError } from "../../src/runtime/core/errors.js";

describe("cpython-derived any / all builtins", () => {
  it("any returns True when any element is truthy", () => {
    expect(any(pyList([pyInt(0), pyInt(1), pyInt(2)]))).toBe(pyTrue);
    expect(any(pyTuple([pyFalse, pyInt(0), pyStr("")]))).toBe(pyFalse);
    expect(any(pyList([pyFalse, pyInt(3)]))).toBe(pyTrue);
  });

  it("all returns True only when every element is truthy", () => {
    expect(all(pyList([pyInt(1), pyInt(2)]))).toBe(pyTrue);
    expect(all(pyList([pyInt(1), pyInt(0)]))).toBe(pyFalse);
    expect(all(pyTuple([pyTrue, pyStr("x")]))).toBe(pyTrue);
  });

  it("empty iterable: any is False, all is True", () => {
    expect(any(pyList([]))).toBe(pyFalse);
    expect(all(pyList([]))).toBe(pyTrue);
    expect(any(pyTuple([]))).toBe(pyFalse);
    expect(all(pyTuple([]))).toBe(pyTrue);
  });

  it("raises TypeError with zero arguments", () => {
    expect(() => any()).toThrow(PyTypeError);
    expect(() => all()).toThrow(PyTypeError);
    expect(() => any()).toThrow(/expected at least 1 argument/);
  });

  it("raises TypeError with multiple arguments", () => {
    expect(() => any(pyList([]), pyList([]))).toThrow(PyTypeError);
    expect(() => all(pyInt(1), pyInt(2))).toThrow(/takes exactly one argument/);
  });

  it("raises TypeError for non-iterable", () => {
    expect(() => any(pyInt(1))).toThrow(PyTypeError);
    expect(() => all(pyInt(1))).toThrow(PyTypeError);
  });

  it("unwraps to boolean for embedder convenience", () => {
    expect(unwrap(any(pyList([pyInt(0), pyInt(5)])))).toBe(true);
    expect(unwrap(all(pyList([pyInt(1), pyInt(2)])))).toBe(true);
    expect(unwrap(any(pyList([])))).toBe(false);
    expect(unwrap(all(pyList([])))).toBe(true);
  });
});
