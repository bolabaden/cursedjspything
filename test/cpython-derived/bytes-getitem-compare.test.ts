/**
 * CPython: bytes integer indexing and lexicographic rich compare.
 */
import { describe, it, expect } from "vitest";
import {
  bytes,
  eq,
  ge,
  getItem,
  gt,
  le,
  lt,
  ne,
  pyBytes,
  pyInt,
  pyStr,
  unwrap,
} from "../../src/index.js";
import { PyIndexError, PyTypeError } from "../../src/runtime/core/errors.js";

describe("cpython-derived bytes getitem and compare", () => {
  const abc = () => bytes(pyStr("abc")) as ReturnType<typeof pyBytes>;

  it("getitem returns int byte value", () => {
    expect(unwrap(getItem(abc(), 0) as ReturnType<typeof pyInt>)).toBe(97);
    expect(unwrap(getItem(abc(), -1) as ReturnType<typeof pyInt>)).toBe(99);
  });

  it("getitem out of range raises IndexError", () => {
    expect(() => getItem(abc(), 5)).toThrow(PyIndexError);
    expect(() => getItem(abc(), 5)).toThrow(/index out of range/);
  });

  it("getitem rejects non-integer keys", () => {
    expect(() => getItem(abc(), pyStr("x"))).toThrow(PyTypeError);
    expect(() => getItem(abc(), pyStr("x"))).toThrow(
      /byte indices must be integers or slices/,
    );
  });

  it("bytes compare lexicographically", () => {
    const a = pyBytes(new Uint8Array([97]));
    const b = pyBytes(new Uint8Array([98]));
    expect(lt(a, b)).toBe(true);
    expect(gt(b, a)).toBe(true);
    expect(le(a, a)).toBe(true);
    expect(ge(a, a)).toBe(true);
    expect(eq(a, a)).toBe(true);
    expect(ne(a, b)).toBe(true);
  });

  it("bytes eq with int is false", () => {
    expect(eq(abc(), pyInt(97))).toBe(false);
  });
});
