/**
 * CPython: bytes↔int/float/bool eq/ne non-coercion (binary/ordering in bytes-remaining).
 */
import { describe, it, expect } from "vitest";
import {
  bytes,
  eq,
  ne,
  pyBytes,
  pyFloat,
  pyInt,
  pyStr,
  pyTrue,
} from "../../src/index.js";

describe("cpython-derived bytes/scalar comparisons", () => {
  const b = () => bytes(pyStr("ab")) as ReturnType<typeof pyBytes>;

  it("eq and ne do not coerce bytes and int", () => {
    expect(eq(b(), pyInt(1))).toBe(false);
    expect(eq(pyInt(1), b())).toBe(false);
    expect(ne(b(), pyInt(1))).toBe(true);
    expect(ne(pyInt(1), b())).toBe(true);
  });

  it("eq and ne do not coerce bytes and float", () => {
    expect(eq(b(), pyFloat(1.0))).toBe(false);
    expect(eq(pyFloat(1.0), b())).toBe(false);
    expect(ne(b(), pyFloat(1.0))).toBe(true);
    expect(ne(pyFloat(1.0), b())).toBe(true);
  });

  it("eq and ne do not coerce bytes and bool", () => {
    expect(eq(b(), pyTrue)).toBe(false);
    expect(eq(pyTrue, b())).toBe(false);
    expect(ne(b(), pyTrue)).toBe(true);
    expect(ne(pyTrue, b())).toBe(true);
  });
});
