/**
 * CPython: slice.indices(length) returns normalized (start, stop, step).
 */
import { describe, it, expect } from "vitest";
import {
  getAttr,
  getItem,
  instantiate,
  makeClass,
  objectType,
  pyInt,
  pySlice,
  pyStr,
  tupleType,
  unwrap,
} from "../../src/index.js";
import { PyTypeError, PyValueError } from "../../src/runtime/core/errors.js";
import { Slot } from "../../src/runtime/core/slots.js";

type IndicesFn = (self: ReturnType<typeof pySlice>, length?: unknown) => unknown;

function indexTwo() {
  const IndexTwo = makeClass({
    name: "IndexTwo",
    bases: [objectType],
    dict: new Map<string | symbol, unknown>([
      [Slot.index, () => pyInt(2)],
    ]),
  });
  return instantiate(IndexTwo);
}

function asTriple(result: unknown): [number, number, number] {
  const tup = result as ReturnType<typeof pySlice>;
  expect(tup.type).toBe(tupleType);
  return [
    unwrap(getItem(tup, 0) as ReturnType<typeof pyInt>),
    unwrap(getItem(tup, 1) as ReturnType<typeof pyInt>),
    unwrap(getItem(tup, 2) as ReturnType<typeof pyInt>),
  ];
}

describe("cpython-derived slice indices", () => {
  function indices(sl: ReturnType<typeof pySlice>, length?: unknown): unknown {
    const fn = getAttr(sl, "indices") as IndicesFn;
    return length === undefined ? fn(sl) : fn(sl, length);
  }

  it("default slice on length 10", () => {
    expect(asTriple(indices(pySlice(), pyInt(10)))).toEqual([0, 10, 1]);
  });

  it("positive start/stop/step", () => {
    expect(asTriple(indices(pySlice(2, 8, 2), pyInt(10)))).toEqual([2, 8, 2]);
    expect(asTriple(indices(pySlice(pyInt(-3), null, null), pyInt(10)))).toEqual([
      7, 10, 1,
    ]);
    expect(asTriple(indices(pySlice(null, pyInt(-2), null), pyInt(10)))).toEqual([
      0, 8, 1,
    ]);
  });

  it("clips out-of-range bounds", () => {
    expect(asTriple(indices(pySlice(20, 30, 1), pyInt(10)))).toEqual([10, 10, 1]);
  });

  it("negative step", () => {
    expect(asTriple(indices(pySlice(5, null, -1), pyInt(10)))).toEqual([5, -1, -1]);
    expect(asTriple(indices(pySlice(null, 5, -1), pyInt(10)))).toEqual([9, 5, -1]);
  });

  it("accepts __index__ length", () => {
    expect(asTriple(indices(pySlice(1, 3), indexTwo()))).toEqual([1, 2, 1]);
  });

  it("rejects invalid length and zero step", () => {
    expect(() => indices(pySlice(), pyStr("x"))).toThrow(PyTypeError);
    expect(() => indices(pySlice(), pyInt(-1))).toThrow(PyValueError);
    expect(() => indices(pySlice(), pyInt(-1))).toThrow(/length should not be negative/);
    expect(() => indices(pySlice(null, null, 0), pyInt(3))).toThrow(PyValueError);
    expect(() => indices(pySlice(null, null, 0), pyInt(3))).toThrow(
      /slice step cannot be zero/,
    );
  });
});
