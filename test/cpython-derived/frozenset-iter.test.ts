/**
 * CPython: frozenset is iterable via __iter__.
 */
import { describe, it, expect } from "vitest";
import {
  PyObject,
  iter,
  next,
  pyFrozenSet,
  pyInt,
  unwrap,
} from "../../src/index.js";
import { PyStopIteration } from "../../src/runtime/core/lookup.js";

describe("frozenset __iter__", () => {
  it("iterates elements via iter + next", () => {
    const one = pyInt(1);
    const two = pyInt(2);
    const it = iter(pyFrozenSet([one, two]));
    const seen = new Set<number>();
    seen.add(unwrap(next(it) as PyObject) as number);
    seen.add(unwrap(next(it) as PyObject) as number);
    expect(seen).toEqual(new Set([1, 2]));
    expect(() => next(it)).toThrow(PyStopIteration);
  });

  it("empty frozenset raises StopIteration immediately", () => {
    const it = iter(pyFrozenSet([]));
    expect(() => next(it)).toThrow(PyStopIteration);
  });

  it("iterator __iter__ returns self", () => {
    const it = iter(pyFrozenSet([pyInt(1)]));
    expect(iter(it)).toBe(it);
  });
});
