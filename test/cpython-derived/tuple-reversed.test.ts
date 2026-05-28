/**
 * CPython: tuple supports reversed(), yielding elements last to first.
 */
import { describe, it, expect } from "vitest";
import {
  PyObject,
  iter,
  next,
  pyInt,
  pyTuple,
  reversed,
  unwrap,
} from "../../src/index.js";
import { PyStopIteration } from "../../src/runtime/core/lookup.js";

describe("tuple __reversed__", () => {
  it("reverses elements via reversed + next", () => {
    const it = reversed(pyTuple([pyInt(1), pyInt(2), pyInt(3)]));
    expect(unwrap(next(it) as PyObject)).toBe(3);
    expect(unwrap(next(it) as PyObject)).toBe(2);
    expect(unwrap(next(it) as PyObject)).toBe(1);
    expect(() => next(it)).toThrow(PyStopIteration);
  });

  it("empty tuple raises StopIteration immediately", () => {
    const it = reversed(pyTuple([]));
    expect(() => next(it)).toThrow(PyStopIteration);
  });

  it("iterator __iter__ returns self", () => {
    const it = reversed(pyTuple([pyInt(1)]));
    expect(iter(it)).toBe(it);
  });
});
