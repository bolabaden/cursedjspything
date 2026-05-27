/**
 * CPython: bool↔str floordiv/mod/divmod/pow reject incompatible types.
 */
import { describe, it, expect } from "vitest";
import {
  divmod,
  floordiv,
  mod,
  pow,
  pyStr,
  pyTrue,
} from "../../src/index.js";
import { PyTypeError } from "../../src/runtime/core/errors.js";

describe("cpython-derived bool/str remaining binary ops", () => {
  const t = () => pyTrue;
  const s = () => pyStr("a");

  it("floordiv rejects bool and str", () => {
    expect(() => floordiv(t(), s())).toThrow(PyTypeError);
    expect(() => floordiv(t(), s())).toThrow(
      /unsupported operand type\(s\) for \/\/: 'bool' and 'str'/,
    );
  });

  it("mod rejects bool and str", () => {
    expect(() => mod(t(), s())).toThrow(PyTypeError);
    expect(() => mod(t(), s())).toThrow(
      /unsupported operand type\(s\) for %: 'bool' and 'str'/,
    );
  });

  it("divmod rejects bool and str in both orders", () => {
    expect(() => divmod(t(), s())).toThrow(PyTypeError);
    expect(() => divmod(t(), s())).toThrow(
      /unsupported operand type\(s\) for divmod\(\): 'bool' and 'str'/,
    );
    expect(() => divmod(s(), t())).toThrow(PyTypeError);
    expect(() => divmod(s(), t())).toThrow(
      /unsupported operand type\(s\) for divmod\(\): 'str' and 'bool'/,
    );
  });

  it("pow rejects bool and str in both orders", () => {
    expect(() => pow(t(), s())).toThrow(PyTypeError);
    expect(() => pow(t(), s())).toThrow(
      /unsupported operand type\(s\) for \*\*: 'bool' and 'str'/,
    );
    expect(() => pow(s(), t())).toThrow(PyTypeError);
    expect(() => pow(s(), t())).toThrow(
      /unsupported operand type\(s\) for \*\*: 'str' and 'bool'/,
    );
  });
});
