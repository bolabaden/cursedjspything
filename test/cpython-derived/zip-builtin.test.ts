/**
 * CPython: builtin zip.
 */
import { describe, it, expect } from "vitest";
import {
  PyObject,
  getItem,
  iter,
  len,
  next,
  pyInt,
  pyList,
  pyStr,
  pyTuple,
  unwrap,
  zip,
} from "../../src/index.js";
import { PyStopIteration, PyTypeError } from "../../src/runtime/core/errors.js";

function collectZipRows(it: PyObject): unknown[][] {
  const out: unknown[][] = [];
  while (true) {
    try {
      const tup = next(it) as PyObject;
      const n = len(tup);
      const row: unknown[] = [];
      for (let i = 0; i < n; i++) {
        row.push(unwrap(getItem(tup, pyInt(i)) as PyObject));
      }
      out.push(row);
    } catch (e) {
      if (e instanceof PyStopIteration) break;
      throw e;
    }
  }
  return out;
}

describe("cpython-derived zip builtin", () => {
  it("zips two iterables into pairs", () => {
    const it = zip(pyList([pyInt(1), pyInt(2)]), pyList([pyStr("a"), pyStr("b")]));
    expect(collectZipRows(it)).toEqual([
      [1, "a"],
      [2, "b"],
    ]);
  });

  it("stops at the shortest iterable", () => {
    const it = zip(
      pyList([pyInt(1), pyInt(2), pyInt(3)]),
      pyList([pyStr("x")]),
    );
    expect(collectZipRows(it)).toEqual([[1, "x"]]);
  });

  it("single iterable yields 1-tuples", () => {
    const it = zip(pyTuple([pyInt(10), pyInt(20)]));
    expect(collectZipRows(it)).toEqual([[10], [20]]);
  });

  it("empty iterable yields nothing", () => {
    const it = zip(pyList([]), pyList([pyInt(1)]));
    expect(() => next(it)).toThrow(PyStopIteration);
  });

  it("iterator __iter__ returns self", () => {
    const it = zip(pyList([pyInt(1)]));
    expect(iter(it)).toBe(it);
  });

  it("raises TypeError with zero arguments", () => {
    expect(() => zip()).toThrow(PyTypeError);
    expect(() => zip()).toThrow(/expected at least 1 argument/);
  });

  it("raises TypeError for non-iterable argument", () => {
    expect(() => zip(pyInt(1))).toThrow(PyTypeError);
  });
});
