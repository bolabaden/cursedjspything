/**
 * CPython: frozenset is hashable; set is not.
 */
import { describe, it, expect } from "vitest";
import { hash, pyFrozenSet, pyInt, pySet } from "../../src/index.js";
import { PyTypeError } from "../../src/runtime/core/errors.js";

describe("frozenset __hash__", () => {
  it("returns a stable hash for empty frozenset", () => {
    const empty = pyFrozenSet([]);
    expect(hash(empty)).toBe(hash(empty));
  });

  it("is order-independent for the same elements", () => {
    const a = pyFrozenSet([pyInt(1), pyInt(2)]);
    const b = pyFrozenSet([pyInt(2), pyInt(1)]);
    expect(hash(a)).toBe(hash(b));
  });

  it("matches for equal frozensets built separately", () => {
    expect(hash(pyFrozenSet([pyInt(1)]))).toBe(hash(pyFrozenSet([pyInt(1)])));
  });

  it("leaves set unhashable", () => {
    expect(() => hash(pySet([]))).toThrow(PyTypeError);
    expect(() => hash(pySet([]))).toThrow(/unhashable type: 'set'/);
  });
});
