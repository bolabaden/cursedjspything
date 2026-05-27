/**
 * CPython: bytes slice subscript returns bytes.
 */
import { describe, it, expect } from "vitest";
import {
  bytes,
  bytesType,
  getItem,
  pyBytes,
  pySlice,
  pyStr,
  unwrap,
} from "../../src/index.js";
import { PyValueError } from "../../src/runtime/core/errors.js";

describe("cpython-derived bytes slice indexing", () => {
  const abcd = () => bytes(pyStr("abcd")) as ReturnType<typeof pyBytes>;

  function asBytes(v: unknown): Uint8Array {
    return unwrap<Uint8Array>(v as ReturnType<typeof pyBytes>);
  }

  it("slice returns bytes subsequence", () => {
    const part = getItem(abcd(), pySlice(1, 3, null));
    expect((part as ReturnType<typeof pyBytes>).type).toBe(bytesType);
    expect(Array.from(asBytes(part))).toEqual([98, 99]);
  });

  it("slice with step", () => {
    const part = getItem(abcd(), pySlice(null, null, 2));
    expect(Array.from(asBytes(part))).toEqual([97, 99]);
  });

  it("reverse slice", () => {
    const part = getItem(abcd(), pySlice(null, null, -1));
    expect(Array.from(asBytes(part))).toEqual([100, 99, 98, 97]);
  });

  it("zero step raises ValueError", () => {
    expect(() => getItem(abcd(), pySlice(null, null, 0))).toThrow(PyValueError);
    expect(() => getItem(abcd(), pySlice(null, null, 0))).toThrow(
      /slice step cannot be zero/,
    );
  });
});
