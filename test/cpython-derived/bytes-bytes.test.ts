/**
 * CPython: bytes.__bytes__ returns self; bytes(b'...') is identity.
 */
import { describe, it, expect } from "vitest";
import { bytesProtocol, pyBytes } from "../../src/index.js";

describe("bytes __bytes__", () => {
  it("bytes() on bytes returns the same object", () => {
    const b = pyBytes(new Uint8Array([97, 98, 99]));
    expect(bytesProtocol(b)).toBe(b);
  });

  it("empty bytes returns the same object", () => {
    const b = pyBytes(new Uint8Array([]));
    expect(bytesProtocol(b)).toBe(b);
  });
});
