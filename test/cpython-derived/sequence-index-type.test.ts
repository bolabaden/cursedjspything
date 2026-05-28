/**
 * Vitest ports of CPython sequence subscript type errors.
 * Source: Lib/test spirit — non-integer list/tuple indices raise TypeError.
 */
import { describe, it, expect } from "vitest";
import {
  delItem,
  getItem,
  len,
  setItem,
  pyInt,
  pyList,
  pyStr,
  pyTuple,
  unwrap,
} from "../../src/index.js";
import { PyTypeError, PyIndexError } from "../../src/runtime/core/errors.js";

describe("cpython-derived sequence index types", () => {
  it("list getItem rejects non-integer keys", () => {
    const lst = pyList([pyInt(1), pyInt(2)]);
    expect(() => getItem(lst, pyStr("x"))).toThrow(PyTypeError);
    expect(() => getItem(lst, pyStr("x"))).toThrow(/list indices must be integers/);
  });

  it("tuple getItem rejects non-integer keys", () => {
    const tup = pyTuple([pyInt(1), pyInt(2)]);
    expect(() => getItem(tup, pyStr("x"))).toThrow(PyTypeError);
    expect(() => getItem(tup, pyStr("x"))).toThrow(/tuple indices must be integers/);
  });

  it("list setItem rejects non-integer keys", () => {
    const lst = pyList([pyInt(1)]);
    expect(() => setItem(lst, pyStr("x"), pyInt(9))).toThrow(PyTypeError);
    expect(() => setItem(lst, pyStr("x"), pyInt(9))).toThrow(/list indices must be integers/);
  });

  it("list delItem rejects non-integer keys", () => {
    const lst = pyList([pyInt(1), pyInt(2)]);
    expect(() => delItem(lst, pyStr("x"))).toThrow(PyTypeError);
    expect(() => delItem(lst, pyStr("x"))).toThrow(/list indices must be integers/);
  });

  it("int index getItem still works", () => {
    const lst = pyList([pyInt(10), pyInt(20)]);
    expect(unwrap(getItem(lst, 0) as ReturnType<typeof pyInt>)).toBe(10);
  });
});

describe("cpython-derived sequence index out of range", () => {
  it("list getItem out of range raises IndexError", () => {
    expect(() => getItem(pyList([]), 0)).toThrow(PyIndexError);
    expect(() => getItem(pyList([]), 0)).toThrow(/list index out of range/);
  });

  it("list delItem out of range raises IndexError", () => {
    expect(() => delItem(pyList([pyInt(1)]), 5)).toThrow(PyIndexError);
    expect(() => delItem(pyList([pyInt(1)]), 5)).toThrow(/list deletion index out of range/);
  });

  it("list delItem removes element at index", () => {
    const lst = pyList([pyInt(10), pyInt(20), pyInt(30)]);
    delItem(lst, 1);
    expect(len(lst)).toBe(2);
    expect(unwrap(getItem(lst, 0) as ReturnType<typeof pyInt>)).toBe(10);
    expect(unwrap(getItem(lst, 1) as ReturnType<typeof pyInt>)).toBe(30);
  });

  it("tuple getItem out of range raises IndexError", () => {
    const tup = pyTuple([pyInt(1)]);
    expect(() => getItem(tup, 5)).toThrow(PyIndexError);
    expect(() => getItem(tup, 5)).toThrow(/tuple index out of range/);
  });

  it("str getItem out of range raises IndexError", () => {
    expect(() => getItem(pyStr("a"), 9)).toThrow(PyIndexError);
    expect(() => getItem(pyStr("a"), 9)).toThrow(/string index out of range/);
  });
});
