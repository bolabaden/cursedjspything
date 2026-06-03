/**
 * CPython: str↔float eq/ne non-coercion (arithmetic in operator-float-str-remaining-binary).
 */
import { describe, it, expect } from "vitest";
import { eq, ne, pyFloat, pyStr } from "../../src/index.js";

describe("cpython-derived str/float comparisons", () => {
  it("eq and ne do not coerce str and float", () => {
    expect(eq(pyStr("1.0"), pyFloat(1.0))).toBe(false);
    expect(eq(pyFloat(1.0), pyStr("1.0"))).toBe(false);
    expect(ne(pyStr("1.0"), pyFloat(1.0))).toBe(true);
    expect(ne(pyFloat(1.0), pyStr("1.0"))).toBe(true);
  });
});
