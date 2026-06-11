/**
 * CPython: list append / extend / insert / pop.
 */
import { describe, it, expect } from "vitest";
import {
  getAttr,
  getItem,
  instantiate,
  len,
  makeClass,
  noneType,
  objectType,
  pyInt,
  pyList,
  pyNone,
  pyStr,
  pyTuple,
  unwrap,
} from "../../src/index.js";
import { PyIndexError, PyTypeError } from "../../src/runtime/core/errors.js";
import { Slot } from "../../src/runtime/core/slots.js";

type ListMethod = (...args: unknown[]) => unknown;

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

function intItems(lst: ReturnType<typeof pyList>): number[] {
  const n = len(lst);
  const out: number[] = [];
  for (let i = 0; i < n; i++) {
    out.push(unwrap(getItem(lst, i) as ReturnType<typeof pyInt>));
  }
  return out;
}

describe("cpython-derived list mutation methods", () => {
  function call(lst: ReturnType<typeof pyList>, name: string, ...args: unknown[]) {
    const fn = getAttr(lst, name) as ListMethod;
    return fn(lst, ...args);
  }

  it("append adds one element and returns None", () => {
    const lst = pyList([pyInt(1)]);
    const ret = call(lst, "append", pyInt(2));
    expect((ret as typeof pyNone).type).toBe(noneType);
    expect(intItems(lst)).toEqual([1, 2]);
  });

  it("extend adds iterable elements and returns None", () => {
    const lst = pyList([pyInt(1)]);
    call(lst, "extend", pyTuple([pyInt(2), pyInt(3)]));
    expect(intItems(lst)).toEqual([1, 2, 3]);
  });

  it("insert places item at clamped index", () => {
    const lst = pyList([pyInt(1), pyInt(3)]);
    call(lst, "insert", pyInt(1), pyInt(2));
    expect(intItems(lst)).toEqual([1, 2, 3]);
    call(lst, "insert", pyInt(99), pyInt(9));
    expect(intItems(lst)).toEqual([1, 2, 3, 9]);
    call(lst, "insert", pyInt(-99), pyInt(0));
    expect(intItems(lst)).toEqual([0, 1, 2, 3, 9]);
    call(lst, "insert", indexOne(), pyInt(5));
    expect(intItems(lst)).toEqual([0, 5, 1, 2, 3, 9]);
  });

  it("pop removes and returns item", () => {
    const lst = pyList([pyInt(10), pyInt(20), pyInt(30)]);
    expect(unwrap(call(lst, "pop") as ReturnType<typeof pyInt>)).toBe(30);
    expect(unwrap(call(lst, "pop", pyInt(0)) as ReturnType<typeof pyInt>)).toBe(10);
    expect(intItems(lst)).toEqual([20]);
  });

  it("rejects empty pop and non-iterable extend", () => {
    const empty = pyList([]);
    expect(() => call(empty, "pop")).toThrow(PyIndexError);
    expect(() => call(empty, "pop")).toThrow(/pop from empty list/);
    const lst = pyList([pyInt(1)]);
    expect(() => call(lst, "extend", pyStr("x"))).toThrow(PyTypeError);
    expect(() => call(lst, "pop", pyInt(9))).toThrow(PyIndexError);
    expect(() => call(lst, "pop", pyInt(9))).toThrow(/pop index out of range/);
  });
});
