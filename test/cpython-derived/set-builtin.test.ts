/**
 * CPython: builtin set constructor.
 */
import { describe, it, expect } from "vitest";
import {
  contains,
  len,
  pyInt,
  pyList,
  set,
  setType,
  unwrap,
} from "../../src/index.js";
import { PyTypeError } from "../../src/runtime/core/errors.js";

describe("cpython-derived set builtin", () => {
  it("set() returns an empty set", () => {
    const out = set();
    expect(len(out)).toBe(0);
    expect(out.type).toBe(setType);
  });

  it("set(iterable) materializes and deduplicates", () => {
    const out = set(pyList([pyInt(1), pyInt(2), pyInt(1), pyInt(3)]));
    expect(len(out)).toBe(3);
    expect(contains(out, pyInt(1))).toBe(true);
    expect(contains(out, pyInt(2))).toBe(true);
    expect(contains(out, pyInt(3))).toBe(true);
  });

  it("does not alias the source iterable", () => {
    const src = pyList([pyInt(5)]);
    const out = set(src);
    expect(out).not.toBe(src);
    expect(len(out)).toBe(1);
    expect(unwrap(pyInt(5))).toBe(5);
  });

  it("raises TypeError with too many arguments", () => {
    expect(() => set(pyList([]), pyInt(1))).toThrow(PyTypeError);
    expect(() => set(pyList([]), pyInt(1))).toThrow(/expected at most 1 argument/);
  });

  it("raises TypeError for non-iterable", () => {
    expect(() => set(pyInt(1))).toThrow(PyTypeError);
  });

  it("rejects unhashable elements", () => {
    expect(() => set(pyList([pyList([])]))).toThrow(PyTypeError);
    expect(() => set(pyList([pyList([])]))).toThrow(/unhashable type: 'list'/);
  });
});
