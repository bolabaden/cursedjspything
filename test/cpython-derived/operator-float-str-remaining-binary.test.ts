/**
 * CPython: float↔str binary ops reject incompatible types (canonical; plan 402 dedupe).
 */
import { describe, it, expect } from "vitest";
import {
  add,
  divmod,
  floordiv,
  mod,
  pow,
  pyFloat,
  pyStr,
  sub,
  truediv,
} from "../../src/index.js";
import { PyTypeError } from "../../src/runtime/core/errors.js";

describe("cpython-derived float/str remaining binary ops", () => {
  const f = () => pyFloat(1.0);
  const s = () => pyStr("a");

  it("add rejects float and str in both orders", () => {
    expect(() => add(f(), s())).toThrow(PyTypeError);
    expect(() => add(f(), s())).toThrow(
      /unsupported operand type\(s\) for \+: 'float' and 'str'/,
    );
    expect(() => add(s(), f())).toThrow(PyTypeError);
    expect(() => add(s(), f())).toThrow(
      /unsupported operand type\(s\) for \+: 'str' and 'float'/,
    );
  });

  it("sub rejects float and str in both orders", () => {
    expect(() => sub(f(), s())).toThrow(PyTypeError);
    expect(() => sub(f(), s())).toThrow(
      /unsupported operand type\(s\) for -: 'float' and 'str'/,
    );
    expect(() => sub(s(), f())).toThrow(PyTypeError);
    expect(() => sub(s(), f())).toThrow(
      /unsupported operand type\(s\) for -: 'str' and 'float'/,
    );
  });

  it("truediv rejects float and str in both orders", () => {
    expect(() => truediv(f(), s())).toThrow(PyTypeError);
    expect(() => truediv(f(), s())).toThrow(
      /unsupported operand type\(s\) for \/: 'float' and 'str'/,
    );
    expect(() => truediv(s(), f())).toThrow(PyTypeError);
    expect(() => truediv(s(), f())).toThrow(
      /unsupported operand type\(s\) for \/: 'str' and 'float'/,
    );
  });

  it("floordiv rejects float and str in both orders", () => {
    expect(() => floordiv(f(), s())).toThrow(PyTypeError);
    expect(() => floordiv(f(), s())).toThrow(
      /unsupported operand type\(s\) for \/\/: 'float' and 'str'/,
    );
    expect(() => floordiv(s(), f())).toThrow(PyTypeError);
    expect(() => floordiv(s(), f())).toThrow(
      /unsupported operand type\(s\) for \/\/: 'str' and 'float'/,
    );
  });

  it("mod rejects float and str in both orders", () => {
    expect(() => mod(f(), s())).toThrow(PyTypeError);
    expect(() => mod(f(), s())).toThrow(
      /unsupported operand type\(s\) for %: 'float' and 'str'/,
    );
    expect(() => mod(s(), f())).toThrow(PyTypeError);
    expect(() => mod(s(), f())).toThrow(
      /unsupported operand type\(s\) for %: 'str' and 'float'/,
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
