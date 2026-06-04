/**
 * CPython: int↔str binary and ordering reject incompatible types (canonical; add in str-scalar; plan 406).
 */
import { describe, it, expect } from "vitest";
import {
  divmod,
  floordiv,
  mod,
  pow,
  pyInt,
  pyStr,
  sub,
  truediv,
} from "../../src/index.js";
import { PyTypeError } from "../../src/runtime/core/errors.js";
import { registerCrossTypeOrderingRejects } from "./helpers/cross-type-ordering.js";

describe("cpython-derived int/str remaining binary ops", () => {
  const i = () => pyInt(1);
  const s = () => pyStr("a");

  it("sub rejects int and str in both orders", () => {
    expect(() => sub(i(), s())).toThrow(PyTypeError);
    expect(() => sub(i(), s())).toThrow(
      /unsupported operand type\(s\) for -: 'int' and 'str'/,
    );
    expect(() => sub(s(), i())).toThrow(PyTypeError);
    expect(() => sub(s(), i())).toThrow(
      /unsupported operand type\(s\) for -: 'str' and 'int'/,
    );
  });

  it("truediv rejects int and str in both orders", () => {
    expect(() => truediv(i(), s())).toThrow(PyTypeError);
    expect(() => truediv(i(), s())).toThrow(
      /unsupported operand type\(s\) for \/: 'int' and 'str'/,
    );
    expect(() => truediv(s(), i())).toThrow(PyTypeError);
    expect(() => truediv(s(), i())).toThrow(
      /unsupported operand type\(s\) for \/: 'str' and 'int'/,
    );
  });

  it("floordiv rejects int and str in both orders", () => {
    expect(() => floordiv(i(), s())).toThrow(PyTypeError);
    expect(() => floordiv(i(), s())).toThrow(
      /unsupported operand type\(s\) for \/\/: 'int' and 'str'/,
    );
    expect(() => floordiv(s(), i())).toThrow(PyTypeError);
    expect(() => floordiv(s(), i())).toThrow(
      /unsupported operand type\(s\) for \/\/: 'str' and 'int'/,
    );
  });

  it("mod rejects int and str in both orders", () => {
    expect(() => mod(i(), s())).toThrow(PyTypeError);
    expect(() => mod(i(), s())).toThrow(
      /unsupported operand type\(s\) for %: 'int' and 'str'/,
    );
    expect(() => mod(s(), i())).toThrow(PyTypeError);
    expect(() => mod(s(), i())).toThrow(
      /unsupported operand type\(s\) for %: 'str' and 'int'/,
    );
  });

  it("divmod rejects int and str in both orders", () => {
    expect(() => divmod(i(), s())).toThrow(PyTypeError);
    expect(() => divmod(i(), s())).toThrow(
      /unsupported operand type\(s\) for divmod\(\): 'int' and 'str'/,
    );
    expect(() => divmod(s(), i())).toThrow(PyTypeError);
    expect(() => divmod(s(), i())).toThrow(
      /unsupported operand type\(s\) for divmod\(\): 'str' and 'int'/,
    );
  });

  it("pow rejects int and str in both orders", () => {
    expect(() => pow(i(), s())).toThrow(PyTypeError);
    expect(() => pow(i(), s())).toThrow(
      /unsupported operand type\(s\) for \*\*: 'int' and 'str'/,
    );
    expect(() => pow(s(), i())).toThrow(PyTypeError);
    expect(() => pow(s(), i())).toThrow(
      /unsupported operand type\(s\) for \*\*: 'str' and 'int'/,
    );
  });
});

describe("cpython-derived int/str ordering", () => {
  const s = () => pyStr("a");
  const i = () => pyInt(1);

  registerCrossTypeOrderingRejects("str", "int", s, i);
});
