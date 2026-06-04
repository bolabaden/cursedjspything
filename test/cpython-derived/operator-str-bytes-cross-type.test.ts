/**
 * CPython: str↔bytes eq/ne and ordering non-coercion (binary in operator-bytes-remaining-cross-type).
 */
import { describe, it, expect } from "vitest";
import {
  bytes,
  eq,
  ne,
  pyBytes,
  pyStr,
} from "../../src/index.js";
import { registerCrossTypeOrderingRejects } from "./helpers/cross-type-ordering.js";

describe("cpython-derived str/bytes comparisons", () => {
  const s = () => pyStr("ab");
  const b = () => bytes(pyStr("ab")) as ReturnType<typeof pyBytes>;

  it("eq and ne do not coerce str and bytes", () => {
    expect(eq(s(), b())).toBe(false);
    expect(eq(b(), s())).toBe(false);
    expect(ne(s(), b())).toBe(true);
    expect(ne(b(), s())).toBe(true);
  });

  registerCrossTypeOrderingRejects("str", "bytes", s, b);
});
