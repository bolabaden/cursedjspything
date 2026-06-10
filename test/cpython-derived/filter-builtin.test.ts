/**
 * CPython: builtin filter.
 */
import { describe, it, expect } from "vitest";
import {
  PyObject,
  instantiate,
  iter,
  makeClass,
  next,
  objectType,
  pyFalse,
  pyInt,
  pyList,
  pyNone,
  pyStr,
  pyTrue,
  unwrap,
  filter,
} from "../../src/index.js";
import { PyStopIteration, PyTypeError } from "../../src/runtime/core/errors.js";
import { Slot } from "../../src/runtime/core/slots.js";

function isPositive() {
  const Pred = makeClass({
    name: "IsPositive",
    bases: [objectType],
    dict: new Map<string | symbol, unknown>([
      [Slot.call, (_self: unknown, x: unknown) =>
        unwrap(x as ReturnType<typeof pyInt>) > 0 ? pyTrue : pyFalse],
    ]),
  });
  return instantiate(Pred);
}

function collectFiltered(it: PyObject): unknown[] {
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

describe("cpython-derived filter builtin", () => {
  it("filters with a callable predicate", () => {
    const it = filter(isPositive(), pyList([pyInt(-1), pyInt(0), pyInt(2), pyInt(3)]));
    expect(collectFiltered(it)).toEqual([2, 3]);
  });

  it("filter(None) keeps truthy items", () => {
    const it = filter(
      pyNone,
      pyList([pyInt(0), pyInt(1), pyFalse, pyStr(""), pyStr("x")]),
    );
    expect(collectFiltered(it)).toEqual([1, "x"]);
  });

  it("empty iterable yields nothing", () => {
    const it = filter(isPositive(), pyList([]));
    expect(() => next(it)).toThrow(PyStopIteration);
  });

  it("iterator __iter__ returns self", () => {
    const it = filter(pyNone, pyList([pyInt(1)]));
    expect(iter(it)).toBe(it);
  });

  it("raises TypeError with wrong arity", () => {
    expect(() => filter()).toThrow(PyTypeError);
    expect(() => filter(isPositive())).toThrow(/expected 2 arguments/);
    expect(() => filter(isPositive(), pyList([]), pyInt(1))).toThrow(
      /expected 2 arguments/,
    );
  });

  it("raises TypeError for non-callable func", () => {
    expect(() => filter(pyInt(1), pyList([]))).toThrow(PyTypeError);
    expect(() => filter(pyInt(1), pyList([]))).toThrow(/not callable/);
  });

  it("raises TypeError for non-iterable", () => {
    expect(() => filter(pyNone, pyInt(1))).toThrow(PyTypeError);
  });
});
