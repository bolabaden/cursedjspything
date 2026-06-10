/**
 * CPython: builtin sorted().
 */
import { describe, it, expect } from "vitest";
import {
  getItem,
  len,
  listType,
  pyInt,
  pyList,
  pyStr,
  pyTrue,
  pyTuple,
  sorted,
  unwrap,
} from "../../src/index.js";
import { PyTypeError } from "../../src/runtime/core/errors.js";

function intItems(lst: ReturnType<typeof pyList>): number[] {
  const n = len(lst);
  const out: number[] = [];
  for (let i = 0; i < n; i++) {
    out.push(unwrap(getItem(lst, i) as ReturnType<typeof pyInt>));
  }
  return out;
}

describe("cpython-derived sorted builtin", () => {
  it("returns a new sorted list without mutating the source", () => {
    const src = pyList([pyInt(3), pyInt(1), pyInt(2)]);
    const out = sorted(src) as ReturnType<typeof pyList>;
    expect(out.type).toBe(listType);
    expect(out).not.toBe(src);
    expect(intItems(out)).toEqual([1, 2, 3]);
    expect(intItems(src)).toEqual([3, 1, 2]);
  });

  it("accepts tuple iterables", () => {
    const out = sorted(pyTuple([pyInt(2), pyInt(0), pyInt(1)])) as ReturnType<
      typeof pyList
    >;
    expect(intItems(out)).toEqual([0, 1, 2]);
  });

  it("sorts descending when reverse is true", () => {
    const out = sorted(pyList([pyInt(1), pyInt(3)]), pyTrue) as ReturnType<
      typeof pyList
    >;
    expect(intItems(out)).toEqual([3, 1]);
  });

  it("returns empty list for empty iterable", () => {
    const out = sorted(pyList([])) as ReturnType<typeof pyList>;
    expect(len(out)).toBe(0);
  });

  it("raises TypeError for non-iterable", () => {
    expect(() => sorted(pyInt(1))).toThrow(PyTypeError);
  });

  it("raises TypeError when elements are not orderable", () => {
    expect(() => sorted(pyList([pyInt(1), pyStr("a")]))).toThrow(PyTypeError);
  });
});
