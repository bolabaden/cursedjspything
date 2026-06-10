/**
 * CPython: list index / count / clear / copy.
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
import { PyTypeError, PyValueError } from "../../src/runtime/core/errors.js";
import { Slot } from "../../src/runtime/core/slots.js";
import { eq } from "../../src/runtime/dispatch/operators/compare.js";

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

describe("cpython-derived list index / count / clear / copy", () => {
  function call(lst: ReturnType<typeof pyList>, name: string, ...args: unknown[]) {
    const fn = getAttr(lst, name) as ListMethod;
    return fn(lst, ...args);
  }

  it("index returns first matching position", () => {
    const lst = pyList([pyInt(1), pyInt(2), pyInt(2), pyInt(3)]);
    expect(unwrap(call(lst, "index", pyInt(2)) as ReturnType<typeof pyInt>)).toBe(1);
    expect(unwrap(call(lst, "index", pyInt(2), pyInt(2)) as ReturnType<typeof pyInt>)).toBe(
      2,
    );
    expect(
      unwrap(call(lst, "index", pyInt(2), pyInt(1), pyInt(3)) as ReturnType<typeof pyInt>),
    ).toBe(1);
  });

  it("index accepts pyInt bounds and __index__", () => {
    const lst = pyList([pyInt(10), pyInt(20), pyInt(30)]);
    expect(unwrap(call(lst, "index", pyInt(20), indexOne()) as ReturnType<typeof pyInt>)).toBe(
      1,
    );
  });

  it("index raises ValueError when value is missing", () => {
    const lst = pyList([pyInt(1)]);
    expect(() => call(lst, "index", pyInt(9))).toThrow(PyValueError);
    expect(() => call(lst, "index", pyInt(9))).toThrow(/x not in list/);
  });

  it("count tallies matches in optional range", () => {
    const lst = pyList([pyInt(1), pyInt(2), pyInt(2), pyInt(1)]);
    expect(unwrap(call(lst, "count", pyInt(2)) as ReturnType<typeof pyInt>)).toBe(2);
    expect(unwrap(call(lst, "count", pyInt(1)) as ReturnType<typeof pyInt>)).toBe(2);
    expect(
      unwrap(call(lst, "count", pyInt(2), pyInt(1), pyInt(2)) as ReturnType<typeof pyInt>),
    ).toBe(1);
    expect(unwrap(call(lst, "count", pyInt(9)) as ReturnType<typeof pyInt>)).toBe(0);
  });

  it("index and count use eq() for custom objects", () => {
    const a = pyStr("x");
    const b = pyStr("x");
    const lst = pyList([a, pyStr("y")]);
    expect(unwrap(call(lst, "index", b) as ReturnType<typeof pyInt>)).toBe(0);
    expect(unwrap(call(lst, "count", b) as ReturnType<typeof pyInt>)).toBe(1);
    expect(eq(a, b)).toBe(true);
  });

  it("clear empties list in place and returns None", () => {
    const lst = pyList([pyInt(1), pyInt(2)]);
    const ret = call(lst, "clear");
    expect((ret as typeof pyNone).type).toBe(noneType);
    expect(len(lst)).toBe(0);
  });

  it("copy returns shallow new list", () => {
    const inner = pyTuple([pyInt(1)]);
    const lst = pyList([inner]);
    const dup = call(lst, "copy") as ReturnType<typeof pyList>;
    expect(dup).not.toBe(lst);
    expect(len(dup)).toBe(1);
    expect(getItem(dup, 0)).toBe(inner);
    call(lst, "clear");
    expect(len(dup)).toBe(1);
  });

  it("rejects non-integer slice bounds on index", () => {
    const lst = pyList([pyInt(1)]);
    expect(() => call(lst, "index", pyInt(1), pyStr("a"))).toThrow(PyTypeError);
  });
});
