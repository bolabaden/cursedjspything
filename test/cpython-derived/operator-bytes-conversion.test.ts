/**
 * CPython: bytes() converts str via __bytes__; rejects types without the hook.
 */
import { describe, it, expect } from "vitest";
import { bytes, bytesType, pyFloat, pyInt, pyStr, unwrap } from "../../src/index.js";
import { PyTypeError } from "../../src/runtime/core/errors.js";

describe("cpython-derived bytes conversion", () => {
  it("bytes(str) returns UTF-8 encoded bytes", () => {
    const result = bytes(pyStr("ab"));
    expect(result).toBeInstanceOf(Object);
    expect((result as { type: typeof bytesType }).type).toBe(bytesType);
    expect(Array.from(unwrap<Uint8Array>(result as never))).toEqual([97, 98]);
  });

  it("bytes(int) raises TypeError", () => {
    expect(() => bytes(pyInt(1))).toThrow(PyTypeError);
    expect(() => bytes(pyInt(1))).toThrow(
      /cannot convert 'int' object to bytes/,
    );
  });

  it("bytes(float) raises TypeError", () => {
    expect(() => bytes(pyFloat(1.0))).toThrow(PyTypeError);
    expect(() => bytes(pyFloat(1.0))).toThrow(
      /cannot convert 'float' object to bytes/,
    );
  });
});
