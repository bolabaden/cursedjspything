/**
 * CPython: tuple index / count.
 */
import { describe, it, expect } from "vitest";
import {
  getAttr,
  getItem,
  instantiate,
  len,
  makeClass,
  objectType,
  pyInt,
  pyList,
  pyStr,
  pyTuple,
  unwrap,
} from "../../src/index.js";
import { PyTypeError, PyValueError } from "../../src/runtime/core/errors.js";
import { Slot } from "../../src/runtime/core/slots.js";
import { eq } from "../../src/runtime/dispatch/operators/compare.js";

type TupleMethod = (...args: unknown[]) => unknown;

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

function intItems(tup: ReturnType<typeof pyTuple>): number[] {
  const n = len(tup);
  const out: number[] = [];
  for (let i = 0; i < n; i++) {
    out.push(unwrap(getItem(tup, i) as ReturnType<typeof pyInt>));
  }
  return out;
}

describe("cpython-derived tuple index / count", () => {
  function call(tup: ReturnType<typeof pyTuple>, name: string, ...args: unknown[]) {
    const fn = getAttr(tup, name) as TupleMethod;
    return fn(tup, ...args);
  }

  it("index returns first matching position", () => {
    const tup = pyTuple([pyInt(1), pyInt(2), pyInt(2), pyInt(3)]);
    expect(unwrap(call(tup, "index", pyInt(2)) as ReturnType<typeof pyInt>)).toBe(1);
    expect(
      unwrap(call(tup, "index", pyInt(2), pyInt(1), pyInt(3)) as ReturnType<typeof pyInt>),
    ).toBe(1);
  });

  it("index accepts pyInt bounds and __index__", () => {
    const tup = pyTuple([pyInt(10), pyInt(20), pyInt(30)]);
    expect(unwrap(call(tup, "index", pyInt(20), indexOne()) as ReturnType<typeof pyInt>)).toBe(
      1,
    );
  });

  it("index raises ValueError when value is missing", () => {
    const tup = pyTuple([pyInt(1)]);
    expect(() => call(tup, "index", pyInt(9))).toThrow(PyValueError);
    expect(() => call(tup, "index", pyInt(9))).toThrow(/x not in tuple/);
  });

  it("count tallies matches in optional range", () => {
    const tup = pyTuple([pyInt(1), pyInt(2), pyInt(2), pyInt(1)]);
    expect(unwrap(call(tup, "count", pyInt(2)) as ReturnType<typeof pyInt>)).toBe(2);
    expect(
      unwrap(call(tup, "count", pyInt(2), pyInt(1), pyInt(2)) as ReturnType<typeof pyInt>),
    ).toBe(1);
    expect(unwrap(call(tup, "count", pyInt(9)) as ReturnType<typeof pyInt>)).toBe(0);
  });

  it("index and count use eq() for custom objects", () => {
    const a = pyStr("x");
    const b = pyStr("x");
    const tup = pyTuple([a, pyStr("y")]);
    expect(unwrap(call(tup, "index", b) as ReturnType<typeof pyInt>)).toBe(0);
    expect(unwrap(call(tup, "count", b) as ReturnType<typeof pyInt>)).toBe(1);
    expect(eq(a, b)).toBe(true);
  });

  it("does not mutate tuple or list sources", () => {
    const tup = pyTuple([pyInt(3), pyInt(1), pyInt(2)]);
    call(tup, "index", pyInt(2));
    expect(intItems(tup)).toEqual([3, 1, 2]);
    const lst = pyList([pyInt(1), pyInt(2)]);
    expect(intItems(lst)).toEqual([1, 2]);
  });

  it("rejects non-integer slice bounds on index", () => {
    const tup = pyTuple([pyInt(1)]);
    expect(() => call(tup, "index", pyInt(1), pyStr("a"))).toThrow(PyTypeError);
  });
});
