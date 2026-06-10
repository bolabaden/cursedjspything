/**
 * CPython: builtin map.
 */
import { describe, it, expect } from "vitest";
import {
  PyObject,
  instantiate,
  iter,
  makeClass,
  next,
  objectType,
  pyInt,
  pyList,
  pyStr,
  pyTuple,
  unwrap,
  map,
} from "../../src/index.js";
import { PyStopIteration, PyTypeError } from "../../src/runtime/core/errors.js";
import { Slot } from "../../src/runtime/core/slots.js";

function doubleInt() {
  const Double = makeClass({
    name: "Double",
    bases: [objectType],
    dict: new Map<string | symbol, unknown>([
      [Slot.call, (_self: unknown, x: unknown) =>
        pyInt(unwrap(x as ReturnType<typeof pyInt>) * 2)],
    ]),
  });
  return instantiate(Double);
}

function addInts() {
  const Add = makeClass({
    name: "Add",
    bases: [objectType],
    dict: new Map<string | symbol, unknown>([
      [Slot.call, (_self: unknown, a: unknown, b: unknown) =>
        pyInt(
          unwrap(a as ReturnType<typeof pyInt>) +
            unwrap(b as ReturnType<typeof pyInt>),
        )],
    ]),
  });
  return instantiate(Add);
}

function collectMapped(it: PyObject): unknown[] {
  const out: unknown[] = [];
  while (true) {
    try {
      out.push(unwrap(next(it) as PyObject));
    } catch (e) {
      if (e instanceof PyStopIteration) break;
      throw e;
    }
  }
  return out;
}

describe("cpython-derived map builtin", () => {
  it("maps a unary function over one iterable", () => {
    const it = map(doubleInt(), pyList([pyInt(1), pyInt(2), pyInt(3)]));
    expect(collectMapped(it)).toEqual([2, 4, 6]);
  });

  it("maps a function over multiple iterables until shortest ends", () => {
    const it = map(
      addInts(),
      pyList([pyInt(1), pyInt(2), pyInt(3)]),
      pyTuple([pyInt(10), pyInt(20)]),
    );
    expect(collectMapped(it)).toEqual([11, 22]);
  });

  it("empty iterable yields nothing", () => {
    const it = map(doubleInt(), pyList([]));
    expect(() => next(it)).toThrow(PyStopIteration);
  });

  it("iterator __iter__ returns self", () => {
    const it = map(doubleInt(), pyList([pyInt(1)]));
    expect(iter(it)).toBe(it);
  });

  it("raises TypeError with fewer than two arguments", () => {
    expect(() => map()).toThrow(PyTypeError);
    expect(() => map(doubleInt())).toThrow(/must have at least two arguments/);
  });

  it("raises TypeError for non-callable func", () => {
    expect(() => map(pyInt(1), pyList([]))).toThrow(PyTypeError);
    expect(() => map(pyInt(1), pyList([]))).toThrow(/not callable/);
  });

  it("raises TypeError for non-iterable", () => {
    expect(() => map(doubleInt(), pyInt(1))).toThrow(PyTypeError);
  });
});
