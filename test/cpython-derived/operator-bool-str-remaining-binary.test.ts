/**
 * CPython: bool↔str remaining binary ops (add in operator-str-scalar; plan 404/474).
 */
import { describe, it, expect } from "vitest";
import {
  divmod,
  floordiv,
  mod,
  pow,
  pyStr,
  pyTrue,
  sub,
  truediv,
} from "../../src/index.js";
import { PyTypeError } from "../../src/runtime/core/errors.js";

describe("cpython-derived bool/str remaining binary ops", () => {
  const t = () => pyTrue;
  const s = () => pyStr("a");

  it("sub rejects bool and str in both orders", () => {
    expect(() => sub(t(), s())).toThrow(PyTypeError);
    expect(() => sub(t(), s())).toThrow(
      /unsupported operand type\(s\) for -: 'bool' and 'str'/,
    );
    expect(() => sub(s(), t())).toThrow(PyTypeError);
    expect(() => sub(s(), t())).toThrow(
      /unsupported operand type\(s\) for -: 'str' and 'bool'/,
    );
  });

  it("truediv rejects bool and str in both orders", () => {
    expect(() => truediv(t(), s())).toThrow(PyTypeError);
    expect(() => truediv(t(), s())).toThrow(
      /unsupported operand type\(s\) for \/: 'bool' and 'str'/,
    );
    expect(() => truediv(s(), t())).toThrow(PyTypeError);
    expect(() => truediv(s(), t())).toThrow(
      /unsupported operand type\(s\) for \/: 'str' and 'bool'/,
    );
  });

  it("floordiv rejects bool and str in both orders", () => {
    expect(() => floordiv(t(), s())).toThrow(PyTypeError);
    expect(() => floordiv(t(), s())).toThrow(
      /unsupported operand type\(s\) for \/\/: 'bool' and 'str'/,
    );
    expect(() => floordiv(s(), t())).toThrow(PyTypeError);
    expect(() => floordiv(s(), t())).toThrow(
      /unsupported operand type\(s\) for \/\/: 'str' and 'bool'/,
    );
  });

  it("mod rejects bool and str in both orders", () => {
    expect(() => mod(t(), s())).toThrow(PyTypeError);
    expect(() => mod(t(), s())).toThrow(
      /unsupported operand type\(s\) for %: 'bool' and 'str'/,
    );
    expect(() => mod(s(), t())).toThrow(PyTypeError);
    expect(() => mod(s(), t())).toThrow(
      /unsupported operand type\(s\) for %: 'str' and 'bool'/,
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
