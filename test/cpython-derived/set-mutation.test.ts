/**
 * CPython: set mutation methods and frozenset copy.
 */
import { describe, it, expect } from "vitest";
import {
  PyObject,
  eq,
  getAttr,
  pyFrozenSet,
  pyInt,
  pyList,
  pySet,
  pyStr,
} from "../../src/index.js";
import { PyKeyError, PyTypeError } from "../../src/runtime/core/errors.js";

type SetMutFn = (self: PyObject, ...args: unknown[]) => unknown;

describe("set mutation methods", () => {
  function call(self: PyObject, name: string, ...args: unknown[]): unknown {
    const fn = getAttr(self, name) as SetMutFn;
    return fn(self, ...args);
  }

  it("add, remove, discard, and clear mutate set", () => {
    const one = pyInt(1);
    const two = pyInt(2);
    const s = pySet([]);
    call(s, "add", one);
    call(s, "add", two);
    expect(eq(s, pySet([one, two]))).toBe(true);

    call(s, "discard", one);
    expect(eq(s, pySet([two]))).toBe(true);

    call(s, "remove", two);
    expect(eq(s, pySet([]))).toBe(true);

    call(s, "add", one);
    call(s, "clear");
    expect(eq(s, pySet([]))).toBe(true);
  });

  it("remove and pop raise KeyError on miss or empty", () => {
    const one = pyInt(1);
    const s = pySet([one]);
    expect(() => call(s, "remove", pyInt(2))).toThrow(PyKeyError);
    expect(() => call(s, "remove", pyInt(2))).toThrow(/^2$/);
    expect(() => call(s, "remove", pyStr("missing"))).toThrow(PyKeyError);
    expect(() => call(s, "remove", pyStr("missing"))).toThrow(/'missing'/);
    expect(() => call(pySet([]), "pop")).toThrow(PyKeyError);
    expect(() => call(pySet([]), "pop")).toThrow(/empty set/);
  });

  it("pop removes and returns an element", () => {
    const one = pyInt(1);
    const s = pySet([one]);
    const item = call(s, "pop");
    expect(item).toBe(one);
    expect(eq(s, pySet([]))).toBe(true);
  });

  it("copy returns equal independent set or frozenset", () => {
    const one = pyInt(1);
    const s = pySet([one]);
    const copied = call(s, "copy") as PyObject;
    expect(copied).not.toBe(s);
    expect(eq(copied, s)).toBe(true);

    const fs = pyFrozenSet([one]);
    const fsCopy = call(fs, "copy") as PyObject;
    expect(fsCopy).not.toBe(fs);
    expect(eq(fsCopy, fs)).toBe(true);
  });

  it("update accepts frozenset and iterable operands", () => {
    const one = pyInt(1);
    const two = pyInt(2);
    const s = pySet([]);
    call(s, "update", pyFrozenSet([one]));
    expect(eq(s, pySet([one]))).toBe(true);

    call(s, "update", pyList([two]));
    expect(eq(s, pySet([one, two]))).toBe(true);
  });

  it("update rejects non-iterable operand", () => {
    expect(() => call(pySet([]), "update", pyInt(1))).toThrow(PyTypeError);
  });
});
