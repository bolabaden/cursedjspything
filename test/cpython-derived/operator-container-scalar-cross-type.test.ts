/**
 * CPython: dict↔bytes/int/slice eq/ne non-coercion (binary in operator-container-cross-type).
 */
import { describe, it, expect } from "vitest";
import { eq, ne, pyBytes, pyDict, pyInt, pySlice } from "../../src/index.js";

describe("cpython-derived dict/scalar comparisons", () => {
  const d = () => pyDict([[pyInt(1), pyInt(2)]]);

  it("eq and ne do not coerce dict and bytes", () => {
    const b = () => pyBytes([1, 2]);
    expect(eq(d(), b())).toBe(false);
    expect(eq(b(), d())).toBe(false);
    expect(ne(d(), b())).toBe(true);
    expect(ne(b(), d())).toBe(true);
  });

  it("eq and ne do not coerce dict and int", () => {
    expect(eq(d(), pyInt(1))).toBe(false);
    expect(eq(pyInt(1), d())).toBe(false);
    expect(ne(d(), pyInt(1))).toBe(true);
    expect(ne(pyInt(1), d())).toBe(true);
  });

  it("eq and ne do not coerce dict and slice", () => {
    const sl = () => pySlice(0, 1, 1);
    expect(eq(d(), sl())).toBe(false);
    expect(eq(sl(), d())).toBe(false);
    expect(ne(d(), sl())).toBe(true);
    expect(ne(sl(), d())).toBe(true);
  });
});
