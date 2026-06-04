/**
 * CPython: str↔float eq/ne, contains, and ordering (binary in operator-float-str-remaining-binary).
 */
import { describe, it, expect } from "vitest";
import { contains, eq, ne, pyFloat, pyStr } from "../../src/index.js";
import { PyTypeError } from "../../src/runtime/core/errors.js";
import { registerCrossTypeOrderingRejects } from "./helpers/cross-type-ordering.js";

describe("cpython-derived str/float comparisons", () => {
  const s = () => pyStr("a");
  const f = () => pyFloat(1.0);

  it("eq and ne do not coerce str and float", () => {
    expect(eq(pyStr("1.0"), pyFloat(1.0))).toBe(false);
    expect(eq(pyFloat(1.0), pyStr("1.0"))).toBe(false);
    expect(ne(pyStr("1.0"), pyFloat(1.0))).toBe(true);
    expect(ne(pyFloat(1.0), pyStr("1.0"))).toBe(true);
  });

  it("contains on str requires str operand not float", () => {
    expect(() => contains(s(), f())).toThrow(PyTypeError);
    expect(() => contains(s(), f())).toThrow(
      /'in <string>' requires string as left operand, not float/,
    );
  });

  registerCrossTypeOrderingRejects("str", "float", s, f);
});
