/**
 * Vitest ports of CPython sequence subscript type errors.
 * Source: Lib/test spirit — non-integer list/tuple indices raise TypeError.
 */
import { describe, it, expect } from "vitest";
import {
  getItem,
  setItem,
  pyInt,
  pyList,
  pyStr,
  pyTuple,
  unwrap,
} from "../../src/index.js";
import { PyTypeError } from "../../src/runtime/core/errors.js";

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

  it("int index getItem still works", () => {
    const lst = pyList([pyInt(10), pyInt(20)]);
    expect(unwrap(getItem(lst, 0) as ReturnType<typeof pyInt>)).toBe(10);
  });
});
