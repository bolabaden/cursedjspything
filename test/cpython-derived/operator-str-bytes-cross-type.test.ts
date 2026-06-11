/**
 * CPython: str↔bytes eq/ne, contains, and ordering (binary in operator-bytes-remaining-cross-type).
 */
import { describe, it, expect } from "vitest";
import {
  bytes,
  contains,
  eq,
  ne,
  pyBytes,
  pyStr,
} from "../../src/index.js";
import { PyTypeError } from "../../src/runtime/core/errors.js";
import { registerCrossTypeOrderingRejects } from "./helpers/cross-type-ordering.js";

describe("cpython-derived str/bytes comparisons", () => {
  const s = () => pyStr("ab");
  const b = () => bytes(pyStr("ab"), pyStr("utf-8")) as ReturnType<typeof pyBytes>;

  it("eq and ne do not coerce str and bytes", () => {
    expect(eq(s(), b())).toBe(false);
    expect(eq(b(), s())).toBe(false);
    expect(ne(s(), b())).toBe(true);
    expect(ne(b(), s())).toBe(true);
  });

  it("contains on str requires str operand not bytes", () => {
    expect(() => contains(s(), b())).toThrow(PyTypeError);
    expect(() => contains(s(), b())).toThrow(
      /'in <string>' requires string as left operand, not bytes/,
    );
  });

  it("contains on bytes requires bytes-like operand not str", () => {
    expect(() => contains(b(), s())).toThrow(PyTypeError);
    expect(() => contains(b(), s())).toThrow(
      /a bytes-like object is required, not 'str'/,
    );
  });

  registerCrossTypeOrderingRejects("str", "bytes", s, b);
});
