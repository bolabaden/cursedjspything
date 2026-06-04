/**
 * Vitest ports of CPython str↔scalar cross-type cases (no numeric coercion).
 * Source: vendor/cpython/Lib/test/test_operator.py / rich-compare spirit.
 */
import { describe, it, expect } from "vitest";
import {
  add,
  contains,
  eq,
  mul,
  ne,
  pyFalse,
  pyInt,
  pyStr,
  pyTrue,
  unwrap,
} from "../../src/index.js";
import { PyTypeError } from "../../src/runtime/core/errors.js";
import { registerCrossTypeOrderingRejects } from "./helpers/cross-type-ordering.js";

describe("cpython-derived str/scalar comparisons", () => {
  const s = () => pyStr("a");
  const i = () => pyInt(1);
  const t = () => pyTrue;

  it("eq and ne do not coerce str and int", () => {
    expect(eq(pyStr("1"), pyInt(1))).toBe(false);
    expect(eq(pyInt(1), pyStr("1"))).toBe(false);
    expect(ne(pyStr("1"), pyInt(1))).toBe(true);
    expect(ne(pyInt(1), pyStr("1"))).toBe(true);
  });

  it("eq and ne do not coerce str and bool", () => {
    expect(eq(pyStr("True"), pyTrue)).toBe(false);
    expect(eq(pyTrue, pyStr("True"))).toBe(false);
    expect(ne(pyStr("True"), pyTrue)).toBe(true);
    expect(ne(pyTrue, pyStr("True"))).toBe(true);
  });

  it("contains on str requires str operand not int", () => {
    expect(() => contains(pyStr("abc"), pyInt(97))).toThrow(PyTypeError);
    expect(() => contains(pyStr("abc"), pyInt(97))).toThrow(
      /'in <string>' requires string as left operand, not int/,
    );
  });

  it("contains on str requires str operand not bool", () => {
    expect(() => contains(pyStr("abc"), pyTrue)).toThrow(PyTypeError);
    expect(() => contains(pyStr("abc"), pyTrue)).toThrow(
      /'in <string>' requires string as left operand, not bool/,
    );
  });

  registerCrossTypeOrderingRejects("str", "int", s, i);
  registerCrossTypeOrderingRejects("str", "bool", s, t);
});

describe("cpython-derived str/scalar arithmetic", () => {
  it("add str + int raises TypeError", () => {
    expect(() => add(pyStr("a"), pyInt(1))).toThrow(PyTypeError);
    expect(() => add(pyStr("a"), pyInt(1))).toThrow(
      /unsupported operand type\(s\) for \+: 'str' and 'int'/,
    );
  });

  it("add int + str raises TypeError", () => {
    expect(() => add(pyInt(1), pyStr("a"))).toThrow(PyTypeError);
    expect(() => add(pyInt(1), pyStr("a"))).toThrow(
      /unsupported operand type\(s\) for \+: 'int' and 'str'/,
    );
  });

  it("add str + bool raises TypeError", () => {
    expect(() => add(pyStr("a"), pyTrue)).toThrow(PyTypeError);
    expect(() => add(pyStr("a"), pyTrue)).toThrow(
      /unsupported operand type\(s\) for \+: 'str' and 'bool'/,
    );
  });

  it("add bool + str raises TypeError", () => {
    expect(() => add(pyTrue, pyStr("a"))).toThrow(PyTypeError);
    expect(() => add(pyTrue, pyStr("a"))).toThrow(
      /unsupported operand type\(s\) for \+: 'bool' and 'str'/,
    );
  });
});

describe("cpython-derived str repetition with bool", () => {
  it("mul treats True as 1 and False as 0", () => {
    expect(unwrap(mul(pyStr("ab"), pyTrue) as ReturnType<typeof pyStr>)).toBe("ab");
    expect(unwrap(mul(pyStr("ab"), pyFalse) as ReturnType<typeof pyStr>)).toBe("");
    expect(unwrap(mul(pyStr("x"), pyInt(2)) as ReturnType<typeof pyStr>)).toBe("xx");
  });

  it("reflected mul (bool * str) matches forward", () => {
    expect(unwrap(mul(pyTrue, pyStr("ab")) as ReturnType<typeof pyStr>)).toBe("ab");
    expect(unwrap(mul(pyFalse, pyStr("ab")) as ReturnType<typeof pyStr>)).toBe("");
  });

  it("negative int repeat count yields empty string", () => {
    expect(unwrap(mul(pyStr("ab"), pyInt(-1)) as ReturnType<typeof pyStr>)).toBe("");
  });
});
