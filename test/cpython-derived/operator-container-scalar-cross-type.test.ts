/**
 * CPython: dict↔bytes eq/ne non-coercion (dict↔container binary in operator-container-cross-type).
 */
import { describe, it, expect } from "vitest";
import { eq, ne, pyBytes, pyDict, pyInt } from "../../src/index.js";

describe("cpython-derived dict/scalar comparisons", () => {
  const d = () => pyDict([[pyInt(1), pyInt(2)]]);
  const b = () => pyBytes([1, 2]);

  it("eq and ne do not coerce dict and bytes", () => {
    expect(eq(d(), b())).toBe(false);
    expect(eq(b(), d())).toBe(false);
    expect(ne(d(), b())).toBe(true);
    expect(ne(b(), d())).toBe(true);
  });
});
