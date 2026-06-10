/**
 * CPython: builtin list / tuple constructors.
 */
import { describe, it, expect } from "vitest";
import {
  getItem,
  len,
  list,
  listType,
  pyInt,
  pyList,
  pyStr,
  pyTuple,
  tuple,
  tupleType,
  unwrap,
} from "../../src/index.js";
import { PyTypeError } from "../../src/runtime/core/errors.js";

function intItems(seq: ReturnType<typeof pyList>): number[] {
  const n = len(seq);
  const out: number[] = [];
  for (let i = 0; i < n; i++) {
    out.push(unwrap(getItem(seq, pyInt(i)) as ReturnType<typeof pyInt>));
  }
  return out;
}

describe("cpython-derived list / tuple builtins", () => {
  it("list() and tuple() return empty sequences", () => {
    expect(len(list())).toBe(0);
    expect(len(tuple())).toBe(0);
    expect(list().type).toBe(listType);
    expect(tuple().type).toBe(tupleType);
  });

  it("list(iterable) materializes a new list", () => {
    const src = pyTuple([pyInt(3), pyInt(1), pyInt(2)]);
    const out = list(src) as ReturnType<typeof pyList>;
    expect(out).not.toBe(src);
    expect(intItems(out)).toEqual([3, 1, 2]);
    expect(unwrap(getItem(src, pyInt(0)) as ReturnType<typeof pyInt>)).toBe(3);
  });

  it("tuple(iterable) materializes a new tuple", () => {
    const src = pyList([pyStr("a"), pyStr("b")]);
    const out = tuple(src);
    expect(out.type).toBe(tupleType);
    expect(unwrap(getItem(out, pyInt(0)) as ReturnType<typeof pyStr>)).toBe("a");
    expect(unwrap(getItem(out, pyInt(1)) as ReturnType<typeof pyStr>)).toBe("b");
  });

  it("raises TypeError with too many arguments", () => {
    expect(() => list(pyList([]), pyInt(1))).toThrow(PyTypeError);
    expect(() => list(pyList([]), pyInt(1))).toThrow(/expected at most 1 argument/);
    expect(() => tuple(pyList([]), pyInt(1))).toThrow(/expected at most 1 argument/);
  });

  it("raises TypeError for non-iterable", () => {
    expect(() => list(pyInt(1))).toThrow(PyTypeError);
    expect(() => tuple(pyInt(1))).toThrow(PyTypeError);
  });
});
