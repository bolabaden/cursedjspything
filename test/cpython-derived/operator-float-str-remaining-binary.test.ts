/**
 * CPython: float↔str div/mod/pow reject incompatible types.
 */
import { describe, it, expect } from "vitest";
import {
  divmod,
  floordiv,
  mod,
  pow,
  pyFloat,
  pyStr,
  truediv,
} from "../../src/index.js";
import { PyTypeError } from "../../src/runtime/core/errors.js";

describe("cpython-derived float/str remaining binary ops", () => {
  const f = () => pyFloat(1.0);
  const s = () => pyStr("a");

  it("truediv rejects float and str", () => {
    expect(() => truediv(f(), s())).toThrow(PyTypeError);
    expect(() => truediv(f(), s())).toThrow(
      /unsupported operand type\(s\) for \/: 'float' and 'str'/,
    );
  });

  it("floordiv rejects float and str", () => {
    expect(() => floordiv(f(), s())).toThrow(PyTypeError);
    expect(() => floordiv(f(), s())).toThrow(
      /unsupported operand type\(s\) for \/\/: 'float' and 'str'/,
    );
  });

  it("mod rejects float and str", () => {
    expect(() => mod(f(), s())).toThrow(PyTypeError);
    expect(() => mod(f(), s())).toThrow(
      /unsupported operand type\(s\) for %: 'float' and 'str'/,
    );
  });

  it("divmod rejects float and str in both orders", () => {
    expect(() => divmod(f(), s())).toThrow(PyTypeError);
    expect(() => divmod(f(), s())).toThrow(
      /unsupported operand type\(s\) for divmod\(\): 'float' and 'str'/,
    );
    expect(() => divmod(s(), f())).toThrow(PyTypeError);
    expect(() => divmod(s(), f())).toThrow(
      /unsupported operand type\(s\) for divmod\(\): 'str' and 'float'/,
    );
  });

  it("pow rejects float and str in both orders", () => {
    expect(() => pow(f(), s())).toThrow(PyTypeError);
    expect(() => pow(f(), s())).toThrow(
      /unsupported operand type\(s\) for \*\*: 'float' and 'str'/,
    );
    expect(() => pow(s(), f())).toThrow(PyTypeError);
    expect(() => pow(s(), f())).toThrow(
      /unsupported operand type\(s\) for \*\*: 'str' and 'float'/,
    );
  });
});
