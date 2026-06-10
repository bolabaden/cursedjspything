/**
 * CPython: builtin frozenset constructor.
 */
import { describe, it, expect } from "vitest";
import {
  contains,
  frozensetType,
  hash,
  len,
  pyInt,
  pyList,
  frozenset,
} from "../../src/index.js";
import { PyTypeError } from "../../src/runtime/core/errors.js";

describe("cpython-derived frozenset builtin", () => {
  it("frozenset() returns an empty frozenset", () => {
    const out = frozenset();
    expect(len(out)).toBe(0);
    expect(out.type).toBe(frozensetType);
  });

  it("frozenset(iterable) materializes and deduplicates", () => {
    const out = frozenset(pyList([pyInt(1), pyInt(2), pyInt(1)]));
    expect(len(out)).toBe(2);
    expect(contains(out, pyInt(1))).toBe(true);
    expect(contains(out, pyInt(2))).toBe(true);
  });

  it("frozenset result is hashable", () => {
    const out = frozenset(pyList([pyInt(1), pyInt(2)]));
    expect(typeof hash(out)).toBe("number");
  });

  it("raises TypeError with too many arguments", () => {
    expect(() => frozenset(pyList([]), pyInt(1))).toThrow(PyTypeError);
    expect(() => frozenset(pyList([]), pyInt(1))).toThrow(
      /expected at most 1 argument/,
    );
  });

  it("raises TypeError for non-iterable", () => {
    expect(() => frozenset(pyInt(1))).toThrow(PyTypeError);
  });

  it("rejects unhashable elements", () => {
    expect(() => frozenset(pyList([pyList([])]))).toThrow(PyTypeError);
    expect(() => frozenset(pyList([pyList([])]))).toThrow(
      /unhashable type: 'list'/,
    );
  });
});
