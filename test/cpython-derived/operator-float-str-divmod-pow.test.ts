/**
 * CPython: float↔str divmod and pow reject incompatible types.
 */
import { describe, it, expect } from "vitest";
import { divmod, pow, pyFloat, pyStr } from "../../src/index.js";
import { PyTypeError } from "../../src/runtime/core/errors.js";

describe("cpython-derived float/str divmod and pow", () => {
  const f2 = () => pyFloat(2.0);
  const sa = () => pyStr("a");

  it("divmod rejects float and str in both orders", () => {
    expect(() => divmod(f2(), sa())).toThrow(PyTypeError);
    expect(() => divmod(f2(), sa())).toThrow(
      /unsupported operand type\(s\) for divmod\(\): 'float' and 'str'/,
    );
    expect(() => divmod(sa(), f2())).toThrow(PyTypeError);
    expect(() => divmod(sa(), f2())).toThrow(
      /unsupported operand type\(s\) for divmod\(\): 'str' and 'float'/,
    );
  });

  it("pow rejects float and str in both orders", () => {
    expect(() => pow(f2(), sa())).toThrow(PyTypeError);
    expect(() => pow(f2(), sa())).toThrow(
      /unsupported operand type\(s\) for \*\*: 'float' and 'str'/,
    );
    expect(() => pow(sa(), f2())).toThrow(PyTypeError);
    expect(() => pow(sa(), f2())).toThrow(
      /unsupported operand type\(s\) for \*\*: 'str' and 'float'/,
    );
  });
});
