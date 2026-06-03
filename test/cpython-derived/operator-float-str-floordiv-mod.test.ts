/**
 * CPython: float↔str floordiv and mod reject incompatible types.
 */
import { describe, it, expect } from "vitest";
import { floordiv, mod, pyFloat, pyStr } from "../../src/index.js";
import { PyTypeError } from "../../src/runtime/core/errors.js";

describe("cpython-derived float/str floordiv and mod", () => {
  const f1 = () => pyFloat(1.0);
  const sa = () => pyStr("a");

  it("floordiv rejects float and str in both orders", () => {
    expect(() => floordiv(f1(), sa())).toThrow(PyTypeError);
    expect(() => floordiv(f1(), sa())).toThrow(
      /unsupported operand type\(s\) for \/\/: 'float' and 'str'/,
    );
    expect(() => floordiv(sa(), f1())).toThrow(PyTypeError);
    expect(() => floordiv(sa(), f1())).toThrow(
      /unsupported operand type\(s\) for \/\/: 'str' and 'float'/,
    );
  });

  it("mod rejects float and str in both orders", () => {
    expect(() => mod(f1(), sa())).toThrow(PyTypeError);
    expect(() => mod(f1(), sa())).toThrow(
      /unsupported operand type\(s\) for %: 'float' and 'str'/,
    );
    expect(() => mod(sa(), f1())).toThrow(PyTypeError);
    expect(() => mod(sa(), f1())).toThrow(
      /unsupported operand type\(s\) for %: 'str' and 'float'/,
    );
  });
});
