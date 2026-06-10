/**
 * CPython: builtin enumerate.
 */
import { describe, it, expect } from "vitest";
import {
  PyObject,
  enumerate,
  getItem,
  iter,
  next,
  pyInt,
  pyList,
  pyStr,
  pyTuple,
  unwrap,
} from "../../src/index.js";
import { PyStopIteration, PyTypeError } from "../../src/runtime/core/errors.js";

function collectPairs(it: PyObject): [number, unknown][] {
  const out: [number, unknown][] = [];
  while (true) {
    try {
      const pair = next(it) as PyObject;
      out.push([
        unwrap(getItem(pair, pyInt(0)) as PyObject) as number,
        unwrap(getItem(pair, pyInt(1)) as PyObject),
      ]);
    } catch (e) {
      if (e instanceof PyStopIteration) break;
      throw e;
    }
  }
  return out;
}

describe("cpython-derived enumerate builtin", () => {
  it("yields index-value tuples from zero", () => {
    const it = enumerate(pyList([pyStr("a"), pyStr("b"), pyStr("c")]));
    expect(collectPairs(it)).toEqual([
      [0, "a"],
      [1, "b"],
      [2, "c"],
    ]);
  });

  it("honors start offset", () => {
    const it = enumerate(pyTuple([pyInt(10), pyInt(20)]), pyInt(5));
    expect(collectPairs(it)).toEqual([
      [5, 10],
      [6, 20],
    ]);
  });

  it("empty iterable raises StopIteration on first next", () => {
    const it = enumerate(pyList([]));
    expect(() => next(it)).toThrow(PyStopIteration);
  });

  it("iterator __iter__ returns self", () => {
    const it = enumerate(pyList([pyInt(1)]));
    expect(iter(it)).toBe(it);
  });

  it("raises TypeError with zero arguments", () => {
    expect(() => enumerate()).toThrow(PyTypeError);
    expect(() => enumerate()).toThrow(/expected at least 1 argument/);
  });

  it("raises TypeError with too many arguments", () => {
    expect(() => enumerate(pyList([]), pyInt(0), pyInt(1))).toThrow(PyTypeError);
    expect(() => enumerate(pyList([]), pyInt(0), pyInt(1))).toThrow(
      /takes from 1 to 2 positional arguments/,
    );
  });

  it("raises TypeError for non-iterable", () => {
    expect(() => enumerate(pyInt(1))).toThrow(PyTypeError);
  });

  it("raises TypeError when start is not an integer index", () => {
    expect(() => enumerate(pyList([]), pyStr("x"))).toThrow(PyTypeError);
    expect(() => enumerate(pyList([]), pyStr("x"))).toThrow(
      /cannot be interpreted as an integer/,
    );
  });
});
