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
  pyTrue,
  pyTuple,
  unwrap,
  zip,
} from "../../src/index.js";
import { PyStopIteration, PyTypeError, PyValueError } from "../../src/runtime/core/errors.js";

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

  it("strict mode raises ValueError when an iterable is shorter", () => {
    const it = zip(
      pyList([pyInt(1), pyInt(2), pyInt(3)]),
      pyList([pyStr("x")]),
      pyTrue,
    );
    const first = next(it) as PyObject;
    expect(unwrap(getItem(first, pyInt(0)) as PyObject)).toBe(1);
    expect(unwrap(getItem(first, pyInt(1)) as PyObject)).toBe("x");
    expect(() => next(it)).toThrow(PyValueError);
    expect(() => next(it)).toThrow(/argument 2 is shorter than argument 1/);
  });

  it("strict mode raises ValueError when an iterable is longer", () => {
    const it = zip(
      pyList([pyInt(1), pyInt(2)]),
      pyList([pyInt(10), pyInt(20), pyInt(30)]),
      pyTrue,
    );
    next(it);
    next(it);
    expect(() => next(it)).toThrow(/argument 2 is longer than argument 1/);
  });

  it("strict mode succeeds for equal-length iterables", () => {
    const it = zip(
      pyList([pyInt(1), pyInt(2)]),
      pyList([pyInt(10), pyInt(20)]),
      pyTrue,
    );
    expect(collectZipRows(it)).toEqual([
      [1, 10],
      [2, 20],
    ]);
  });
});
