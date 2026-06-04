/**
 * CPython: bytes __add__ concatenates same-type bytes (plan 654).
 */
import { describe, it, expect } from "vitest";
import { add, eq, len, pyBytes, unwrap } from "../../src/index.js";

describe("bytes __add__", () => {
  it("bytes + bytes returns concatenated bytes", () => {
    const a = pyBytes(new Uint8Array([97, 98]));
    const b = pyBytes(new Uint8Array([99, 100]));
    const result = add(a, b) as ReturnType<typeof pyBytes>;
    expect(Array.from(unwrap<Uint8Array>(result))).toEqual([97, 98, 99, 100]);
    expect(eq(result, pyBytes(new Uint8Array([97, 98, 99, 100])))).toBe(true);
    expect(result).not.toBe(a);
    expect(result).not.toBe(b);
  });

  it("empty bytes concatenation", () => {
    const empty = pyBytes(new Uint8Array([]));
    const one = pyBytes(new Uint8Array([120]));
    expect(Array.from(unwrap<Uint8Array>(add(empty, one) as ReturnType<typeof pyBytes>))).toEqual(
      [120],
    );
    expect(Array.from(unwrap<Uint8Array>(add(one, empty) as ReturnType<typeof pyBytes>))).toEqual(
      [120],
    );
    expect(len(add(empty, empty) as ReturnType<typeof pyBytes>)).toBe(0);
  });
});
