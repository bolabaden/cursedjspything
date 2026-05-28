/**
 * CPython: bytes supports reversed(), yielding int 0-255 from last to first.
 */
import { describe, it, expect } from "vitest";
import {
  PyObject,
  iter,
  next,
  pyBytes,
  reversed,
  unwrap,
} from "../../src/index.js";
import { PyStopIteration } from "../../src/runtime/core/lookup.js";

describe("bytes __reversed__", () => {
  it("reverses byte values as int via reversed + next", () => {
    const it = reversed(pyBytes(new Uint8Array([97, 98, 99])));
    expect(unwrap(next(it) as PyObject)).toBe(99);
    expect(unwrap(next(it) as PyObject)).toBe(98);
    expect(unwrap(next(it) as PyObject)).toBe(97);
    expect(() => next(it)).toThrow(PyStopIteration);
  });

  it("empty bytes raises StopIteration immediately", () => {
    const it = reversed(pyBytes(new Uint8Array([])));
    expect(() => next(it)).toThrow(PyStopIteration);
  });

  it("iterator __iter__ returns self", () => {
    const it = reversed(pyBytes(new Uint8Array([1])));
    expect(iter(it)).toBe(it);
  });
});
