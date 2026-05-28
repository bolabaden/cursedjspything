/**
 * CPython: str supports reversed(), yielding one-character strings last to first.
 */
import { describe, it, expect } from "vitest";
import {
  PyObject,
  iter,
  next,
  pyStr,
  reversed,
  unwrap,
} from "../../src/index.js";
import { PyStopIteration } from "../../src/runtime/core/lookup.js";

describe("str __reversed__", () => {
  it("reverses characters via reversed + next", () => {
    const it = reversed(pyStr("abc"));
    expect(unwrap(next(it) as PyObject)).toBe("c");
    expect(unwrap(next(it) as PyObject)).toBe("b");
    expect(unwrap(next(it) as PyObject)).toBe("a");
    expect(() => next(it)).toThrow(PyStopIteration);
  });

  it("empty str raises StopIteration immediately", () => {
    const it = reversed(pyStr(""));
    expect(() => next(it)).toThrow(PyStopIteration);
  });

  it("iterator __iter__ returns self", () => {
    const it = reversed(pyStr("x"));
    expect(iter(it)).toBe(it);
  });
});
