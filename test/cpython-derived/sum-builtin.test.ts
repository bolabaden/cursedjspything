/**
 * CPython: builtin sum.
 */
import { describe, it, expect } from "vitest";
import {
  pyInt,
  pyList,
  pyStr,
  pyTuple,
  sum,
  unwrap,
} from "../../src/index.js";
import { PyTypeError } from "../../src/runtime/core/errors.js";

describe("cpython-derived sum builtin", () => {
  it("sums integers with default start 0", () => {
    expect(unwrap(sum(pyList([pyInt(1), pyInt(2), pyInt(3)])))).toBe(6);
    expect(unwrap(sum(pyTuple([pyInt(10), pyInt(-4)])))).toBe(6);
  });

  it("uses explicit start value", () => {
    expect(unwrap(sum(pyList([pyInt(1), pyInt(2)]), pyInt(10)))).toBe(13);
  });

  it("returns start for empty iterable", () => {
    expect(unwrap(sum(pyList([])))).toBe(0);
    expect(unwrap(sum(pyList([]), pyInt(5)))).toBe(5);
  });

  it("concatenates strings when start is a string", () => {
    expect(unwrap(sum(pyList([pyStr("a"), pyStr("b")]), pyStr("")))).toBe("ab");
  });

  it("raises TypeError with zero arguments", () => {
    expect(() => sum()).toThrow(PyTypeError);
    expect(() => sum()).toThrow(/expected at least 1 argument/);
  });

  it("raises TypeError with too many arguments", () => {
    expect(() => sum(pyList([]), pyInt(0), pyInt(1))).toThrow(PyTypeError);
    expect(() => sum(pyList([]), pyInt(0), pyInt(1))).toThrow(
      /takes from 1 to 2 positional arguments/,
    );
  });

  it("raises TypeError for non-iterable", () => {
    expect(() => sum(pyInt(1))).toThrow(PyTypeError);
  });

  it("raises TypeError when start and items are incompatible", () => {
    expect(() => sum(pyList([pyStr("a")]))).toThrow(PyTypeError);
    expect(() => sum(pyList([pyInt(1), pyStr("a")]))).toThrow(PyTypeError);
  });
});
