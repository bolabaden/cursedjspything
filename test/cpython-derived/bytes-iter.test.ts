/**
 * CPython: bytes is iterable via __iter__, yielding int 0-255.
 */
import { describe, it, expect } from "vitest";
import {
  PyObject,
  iter,
  next,
  pyBytes,
  pyInt,
  unwrap,
} from "../../src/index.js";
import { PyStopIteration } from "../../src/runtime/core/lookup.js";

describe("bytes __iter__", () => {
  it("iterates byte values as int via iter + next", () => {
    const data = pyBytes(new Uint8Array([97, 98, 99]));
    const it = iter(data);
    expect(unwrap(next(it) as PyObject)).toBe(97);
    expect(unwrap(next(it) as PyObject)).toBe(98);
    expect(unwrap(next(it) as PyObject)).toBe(99);
    expect(() => next(it)).toThrow(PyStopIteration);
  });

  it("empty bytes raises StopIteration immediately", () => {
    const it = iter(pyBytes(new Uint8Array([])));
    expect(() => next(it)).toThrow(PyStopIteration);
  });

  it("iterator __iter__ returns self", () => {
    const it = iter(pyBytes(new Uint8Array([1])));
    expect(iter(it)).toBe(it);
  });
});
