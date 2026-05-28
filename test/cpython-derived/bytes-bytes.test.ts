/**
 * CPython: bytes.__bytes__ returns self; bytes(b'...') is identity.
 */
import { describe, it, expect } from "vitest";
import { bytes, pyBytes } from "../../src/index.js";

describe("bytes __bytes__", () => {
  it("bytes() on bytes returns the same object", () => {
    const b = pyBytes(new Uint8Array([97, 98, 99]));
    expect(bytes(b)).toBe(b);
  });

  it("empty bytes returns the same object", () => {
    const b = pyBytes(new Uint8Array([]));
    expect(bytes(b)).toBe(b);
  });
});
