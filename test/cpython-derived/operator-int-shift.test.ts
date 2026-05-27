/**
 * Vitest ports of CPython int shift edge cases.
 */
import { describe, it, expect } from "vitest";
import { lshift, rshift, pyInt, unwrap } from "../../src/index.js";
import { PyValueError } from "../../src/runtime/core/errors.js";

describe("cpython-derived int shift", () => {
  it("positive lshift and rshift work", () => {
    expect(unwrap(lshift(pyInt(1), pyInt(3)) as ReturnType<typeof pyInt>)).toBe(8);
    expect(unwrap(rshift(pyInt(8), pyInt(3)) as ReturnType<typeof pyInt>)).toBe(1);
  });

  it("negative lshift count raises ValueError", () => {
    expect(() => lshift(pyInt(1), pyInt(-1))).toThrow(PyValueError);
    expect(() => lshift(pyInt(1), pyInt(-1))).toThrow(/negative shift count/);
  });

  it("negative rshift count raises ValueError", () => {
    expect(() => rshift(pyInt(8), pyInt(-1))).toThrow(PyValueError);
    expect(() => rshift(pyInt(8), pyInt(-1))).toThrow(/negative shift count/);
  });
});
