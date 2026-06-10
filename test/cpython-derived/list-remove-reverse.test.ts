/**
 * CPython: list remove / reverse.
 */
import { describe, it, expect } from "vitest";
import {
  getAttr,
  getItem,
  len,
  noneType,
  pyInt,
  pyList,
  pyNone,
  pyStr,
  unwrap,
} from "../../src/index.js";
import { PyValueError } from "../../src/runtime/core/errors.js";
import { eq } from "../../src/runtime/dispatch/operators/compare.js";

type ListMethod = (...args: unknown[]) => unknown;

function intItems(lst: ReturnType<typeof pyList>): number[] {
  const n = len(lst);
  const out: number[] = [];
  for (let i = 0; i < n; i++) {
    out.push(unwrap(getItem(lst, i) as ReturnType<typeof pyInt>));
  }
  return out;
}

describe("cpython-derived list remove / reverse", () => {
  function call(lst: ReturnType<typeof pyList>, name: string, ...args: unknown[]) {
    const fn = getAttr(lst, name) as ListMethod;
    return fn(lst, ...args);
  }

  it("remove deletes first matching element and returns None", () => {
    const lst = pyList([pyInt(1), pyInt(2), pyInt(2), pyInt(3)]);
    const ret = call(lst, "remove", pyInt(2));
    expect((ret as typeof pyNone).type).toBe(noneType);
    expect(intItems(lst)).toEqual([1, 2, 3]);
  });

  it("remove raises ValueError when value is missing", () => {
    const lst = pyList([pyInt(1)]);
    expect(() => call(lst, "remove", pyInt(9))).toThrow(PyValueError);
    expect(() => call(lst, "remove", pyInt(9))).toThrow(/x not in list/);
  });

  it("remove uses eq() for custom objects", () => {
    const a = pyStr("x");
    const b = pyStr("x");
    const y = pyStr("y");
    const z = pyStr("z");
    const lst = pyList([y, a, z]);
    expect(eq(a, b)).toBe(true);
    call(lst, "remove", b);
    expect(len(lst)).toBe(2);
    expect(getItem(lst, 0)).toBe(y);
    expect(getItem(lst, 1)).toBe(z);
  });

  it("reverse reverses elements in place and returns None", () => {
    const lst = pyList([pyInt(1), pyInt(2), pyInt(3)]);
    const ret = call(lst, "reverse");
    expect((ret as typeof pyNone).type).toBe(noneType);
    expect(intItems(lst)).toEqual([3, 2, 1]);
  });

  it("reverse on empty or single-element list is a no-op", () => {
    const empty = pyList([]);
    call(empty, "reverse");
    expect(len(empty)).toBe(0);
    const one = pyList([pyInt(42)]);
    call(one, "reverse");
    expect(intItems(one)).toEqual([42]);
  });
});
