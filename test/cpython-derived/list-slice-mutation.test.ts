/**
 * CPython: list __setitem__/__delitem__ with slice keys.
 */
import { describe, it, expect } from "vitest";
import {
  delItem,
  getItem,
  len,
  pyInt,
  pyList,
  pySlice,
  pyStr,
  pyTuple,
  setItem,
  unwrap,
} from "../../src/index.js";
import { PyTypeError, PyValueError } from "../../src/runtime/core/errors.js";

function intItems(lst: ReturnType<typeof pyList>): number[] {
  const n = len(lst);
  const out: number[] = [];
  for (let i = 0; i < n; i++) {
    out.push(unwrap(getItem(lst, i) as ReturnType<typeof pyInt>));
  }
  return out;
}

describe("cpython-derived list slice mutation", () => {
  it("delitem removes a slice", () => {
    const lst = pyList([pyInt(1), pyInt(2), pyInt(3), pyInt(4)]);
    delItem(lst, pySlice(1, 3, null));
    expect(intItems(lst)).toEqual([1, 4]);
  });

  it("setitem replaces a contiguous slice", () => {
    const lst = pyList([pyInt(1), pyInt(2), pyInt(3)]);
    setItem(lst, pySlice(1, 2, null), pyList([pyInt(9), pyInt(10)]));
    expect(intItems(lst)).toEqual([1, 9, 10, 3]);
  });

  it("setitem with empty list deletes slice", () => {
    const lst = pyList([pyInt(1), pyInt(2), pyInt(3)]);
    setItem(lst, pySlice(0, 2, null), pyList([]));
    expect(intItems(lst)).toEqual([3]);
  });

  it("setitem inserts at empty slice", () => {
    const lst = pyList([pyInt(1), pyInt(3)]);
    setItem(lst, pySlice(1, 1, null), pyList([pyInt(2)]));
    expect(intItems(lst)).toEqual([1, 2, 3]);
  });

  it("setitem accepts tuple values", () => {
    const lst = pyList([pyInt(1), pyInt(2)]);
    setItem(lst, pySlice(1, 2, null), pyTuple([pyInt(9)]));
    expect(intItems(lst)).toEqual([1, 9]);
  });

  it("setitem extended slice assigns matching sizes", () => {
    const lst = pyList([pyInt(0), pyInt(1), pyInt(2), pyInt(3), pyInt(4)]);
    setItem(lst, pySlice(null, null, 2), pyList([pyInt(10), pyInt(20), pyInt(30)]));
    expect(intItems(lst)).toEqual([10, 1, 20, 3, 30]);
  });

  it("rejects non-iterable assignment and extended size mismatch", () => {
    const lst = pyList([pyInt(1), pyInt(2), pyInt(3)]);
    expect(() => setItem(lst, pySlice(0, 1, null), pyStr("x"))).toThrow(PyTypeError);
    expect(() => setItem(lst, pySlice(0, 1, null), pyStr("x"))).toThrow(
      /can only assign an iterable/,
    );
    expect(() =>
      setItem(lst, pySlice(null, null, 2), pyList([pyInt(9)])),
    ).toThrow(PyValueError);
    expect(() =>
      setItem(lst, pySlice(null, null, 2), pyList([pyInt(9)])),
    ).toThrow(/extended slice of size/);
  });
});
