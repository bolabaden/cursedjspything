/**
 * CPython: str↔float cross-type cases (no numeric coercion).
 */
import { describe, it, expect } from "vitest";
import {
  add,
  eq,
  mul,
  ne,
  pyFloat,
  pyStr,
  sub,
} from "../../src/index.js";
import { PyTypeError } from "../../src/runtime/core/errors.js";

describe("cpython-derived str/float comparisons", () => {
  it("eq and ne do not coerce str and float", () => {
    expect(eq(pyStr("1.0"), pyFloat(1.0))).toBe(false);
    expect(eq(pyFloat(1.0), pyStr("1.0"))).toBe(false);
    expect(ne(pyStr("1.0"), pyFloat(1.0))).toBe(true);
    expect(ne(pyFloat(1.0), pyStr("1.0"))).toBe(true);
  });
});

describe("cpython-derived str/float arithmetic", () => {
  it("add str + float raises TypeError", () => {
    expect(() => add(pyStr("a"), pyFloat(1.0))).toThrow(PyTypeError);
    expect(() => add(pyStr("a"), pyFloat(1.0))).toThrow(
      /unsupported operand type\(s\) for \+: 'str' and 'float'/,
    );
  });

  it("add float + str raises TypeError", () => {
    expect(() => add(pyFloat(1.0), pyStr("a"))).toThrow(PyTypeError);
    expect(() => add(pyFloat(1.0), pyStr("a"))).toThrow(
      /unsupported operand type\(s\) for \+: 'float' and 'str'/,
    );
  });

  it("sub str - float raises TypeError", () => {
    expect(() => sub(pyStr("a"), pyFloat(1.0))).toThrow(PyTypeError);
    expect(() => sub(pyStr("a"), pyFloat(1.0))).toThrow(
      /unsupported operand type\(s\) for -: 'str' and 'float'/,
    );
  });

  it("mul str * float raises TypeError", () => {
    expect(() => mul(pyStr("a"), pyFloat(1.0))).toThrow(PyTypeError);
    expect(() => mul(pyStr("a"), pyFloat(1.0))).toThrow(
      /unsupported operand type\(s\) for \*: 'str' and 'float'/,
    );
  });
});
