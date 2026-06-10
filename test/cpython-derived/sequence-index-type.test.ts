/**
 * Vitest ports of CPython sequence subscript type errors.
 * Source: Lib/test spirit — non-integer list/tuple indices raise TypeError.
 */
import { describe, it, expect } from "vitest";
import {
  delItem,
  getItem,
  instantiate,
  len,
  makeClass,
  objectType,
  setItem,
  pyInt,
  pyList,
  pyStr,
  pyTrue,
  pyTuple,
  unwrap,
} from "../../src/index.js";
import { PyTypeError, PyIndexError } from "../../src/runtime/core/errors.js";
import { Slot } from "../../src/runtime/core/slots.js";

function indexOne() {
  const IndexOne = makeClass({
    name: "IndexOne",
    bases: [objectType],
    dict: new Map<string | symbol, unknown>([
      [Slot.index, () => pyInt(1)],
    ]),
  });
  return instantiate(IndexOne);
}

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

  it("list getItem accepts pyInt, __index__, and bool", () => {
    const lst = pyList([pyInt(10), pyInt(20), pyInt(30)]);
    expect(unwrap(getItem(lst, pyInt(0)) as ReturnType<typeof pyInt>)).toBe(10);
    expect(unwrap(getItem(lst, pyInt(-1)) as ReturnType<typeof pyInt>)).toBe(30);
    expect(unwrap(getItem(lst, indexOne()) as ReturnType<typeof pyInt>)).toBe(20);
    expect(unwrap(getItem(lst, pyTrue) as ReturnType<typeof pyInt>)).toBe(20);
  });

  it("tuple getItem accepts pyInt, __index__, and bool", () => {
    const tup = pyTuple([pyInt(10), pyInt(20), pyInt(30)]);
    expect(unwrap(getItem(tup, pyInt(0)) as ReturnType<typeof pyInt>)).toBe(10);
    expect(unwrap(getItem(tup, pyInt(-2)) as ReturnType<typeof pyInt>)).toBe(20);
    expect(unwrap(getItem(tup, indexOne()) as ReturnType<typeof pyInt>)).toBe(20);
    expect(unwrap(getItem(tup, pyTrue) as ReturnType<typeof pyInt>)).toBe(20);
  });

  it("list setItem and delItem accept pyInt and __index__", () => {
    const lst = pyList([pyInt(1), pyInt(2), pyInt(3)]);
    setItem(lst, pyInt(1), pyInt(99));
    expect(unwrap(getItem(lst, 1) as ReturnType<typeof pyInt>)).toBe(99);
    delItem(lst, indexOne());
    expect(len(lst)).toBe(2);
    expect(unwrap(getItem(lst, 0) as ReturnType<typeof pyInt>)).toBe(1);
    expect(unwrap(getItem(lst, 1) as ReturnType<typeof pyInt>)).toBe(3);
  });
});

describe("cpython-derived sequence index out of range", () => {
  it("list getItem out of range raises IndexError", () => {
    expect(() => getItem(pyList([]), 0)).toThrow(PyIndexError);
    expect(() => getItem(pyList([]), 0)).toThrow(/list index out of range/);
  });

  it("list setItem out of range raises IndexError", () => {
    expect(() => setItem(pyList([pyInt(1)]), 5, pyInt(9))).toThrow(PyIndexError);
    expect(() => setItem(pyList([pyInt(1)]), 5, pyInt(9))).toThrow(
      /list assignment index out of range/,
    );
  });

  it("list setItem on empty list raises IndexError", () => {
    expect(() => setItem(pyList([]), 0, pyInt(1))).toThrow(PyIndexError);
    expect(() => setItem(pyList([]), 0, pyInt(1))).toThrow(
      /list assignment index out of range/,
    );
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
