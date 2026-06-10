/**
 * CPython: builtin range.
 */
import { describe, it, expect } from "vitest";
import {
  contains,
  getItem,
  iter,
  len,
  next,
  pyInt,
  pyStr,
  range,
  rangeType,
  unwrap,
} from "../../src/index.js";
import {
  PyIndexError,
  PyStopIteration,
  PyTypeError,
  PyValueError,
} from "../../src/runtime/core/errors.js";
import { PyObject } from "../../src/runtime/core/object.js";

function collectInts(it: PyObject): number[] {
  const out: number[] = [];
  while (true) {
    try {
      out.push(unwrap(next(it) as PyObject) as number);
    } catch (e) {
      if (e instanceof PyStopIteration) break;
      throw e;
    }
  }
  return out;
}

describe("cpython-derived range builtin", () => {
  it("range(stop) yields 0..stop-1", () => {
    const r = range(pyInt(5));
    expect(r.type).toBe(rangeType);
    expect(collectInts(iter(r))).toEqual([0, 1, 2, 3, 4]);
  });

  it("range(start, stop) yields start..stop-1", () => {
    expect(collectInts(iter(range(pyInt(2), pyInt(5))))).toEqual([2, 3, 4]);
  });

  it("range(start, stop, step) honors step", () => {
    expect(collectInts(iter(range(pyInt(0), pyInt(10), pyInt(2))))).toEqual([
      0, 2, 4, 6, 8,
    ]);
  });

  it("supports negative step", () => {
    expect(collectInts(iter(range(pyInt(5), pyInt(0), pyInt(-1))))).toEqual([
      5, 4, 3, 2, 1,
    ]);
  });

  it("empty when start >= stop with positive step", () => {
    const r = range(pyInt(5), pyInt(1));
    expect(len(r)).toBe(0);
    expect(() => next(iter(r))).toThrow(PyStopIteration);
  });

  it("reports length and indexing", () => {
    const r = range(pyInt(10));
    expect(len(r)).toBe(10);
    expect(unwrap(getItem(r, pyInt(0)) as PyObject)).toBe(0);
    expect(unwrap(getItem(r, pyInt(-1)) as PyObject)).toBe(9);
  });

  it("membership follows iteration bounds", () => {
    const r = range(pyInt(10));
    expect(contains(r, pyInt(3))).toBe(true);
    expect(contains(r, pyInt(10))).toBe(false);
    expect(contains(r, pyInt(-1))).toBe(false);
  });

  it("iterator __iter__ returns self", () => {
    const it = iter(range(pyInt(2)));
    expect(iter(it)).toBe(it);
  });

  it("raises TypeError with zero arguments", () => {
    expect(() => range()).toThrow(PyTypeError);
    expect(() => range()).toThrow(/expected at least 1 argument/);
  });

  it("raises TypeError with too many arguments", () => {
    expect(() => range(pyInt(1), pyInt(2), pyInt(3), pyInt(4))).toThrow(
      PyTypeError,
    );
    expect(() => range(pyInt(1), pyInt(2), pyInt(3), pyInt(4))).toThrow(
      /expected at most 3 arguments/,
    );
  });

  it("raises ValueError when step is zero", () => {
    expect(() => range(pyInt(1), pyInt(2), pyInt(0))).toThrow(PyValueError);
    expect(() => range(pyInt(1), pyInt(2), pyInt(0))).toThrow(
      /arg 3 must not be zero/,
    );
  });

  it("raises TypeError for non-integer bounds", () => {
    expect(() => range(pyStr("x"))).toThrow(PyTypeError);
    expect(() => range(pyStr("x"))).toThrow(/cannot be interpreted as an integer/);
  });

  it("raises IndexError for out-of-range getitem", () => {
    expect(() => getItem(range(pyInt(3)), pyInt(10))).toThrow(PyIndexError);
    expect(() => getItem(range(pyInt(3)), pyInt(10))).toThrow(
      /range object index out of range/,
    );
  });
});
