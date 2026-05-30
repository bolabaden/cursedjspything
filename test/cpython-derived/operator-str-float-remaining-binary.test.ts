/**
 * CPython: str↔float remaining binary and ordering reject incompatible types.
 */
import { describe, it, expect } from "vitest";
import {
  divmod,
  floordiv,
  ge,
  gt,
  le,
  lt,
  mod,
  mul,
  pow,
  pyFloat,
  pyStr,
  sub,
  truediv,
} from "../../src/index.js";
import { PyTypeError } from "../../src/runtime/core/errors.js";

describe("cpython-derived str/float remaining binary ops", () => {
  const s = () => pyStr("a");
  const f = () => pyFloat(1.0);

  it("truediv rejects str and float in both orders", () => {
    expect(() => truediv(s(), f())).toThrow(PyTypeError);
    expect(() => truediv(s(), f())).toThrow(
      /unsupported operand type\(s\) for \/: 'str' and 'float'/,
    );
    expect(() => truediv(f(), s())).toThrow(PyTypeError);
    expect(() => truediv(f(), s())).toThrow(
      /unsupported operand type\(s\) for \/: 'float' and 'str'/,
    );
  });

  it("floordiv rejects str and float in both orders", () => {
    expect(() => floordiv(s(), f())).toThrow(PyTypeError);
    expect(() => floordiv(s(), f())).toThrow(
      /unsupported operand type\(s\) for \/\/: 'str' and 'float'/,
    );
    expect(() => floordiv(f(), s())).toThrow(PyTypeError);
    expect(() => floordiv(f(), s())).toThrow(
      /unsupported operand type\(s\) for \/\/: 'float' and 'str'/,
    );
  });

  it("mod rejects str and float in both orders", () => {
    expect(() => mod(s(), f())).toThrow(PyTypeError);
    expect(() => mod(s(), f())).toThrow(
      /unsupported operand type\(s\) for %: 'str' and 'float'/,
    );
    expect(() => mod(f(), s())).toThrow(PyTypeError);
    expect(() => mod(f(), s())).toThrow(
      /unsupported operand type\(s\) for %: 'float' and 'str'/,
    );
  });

  it("divmod rejects str and float in both orders", () => {
    expect(() => divmod(s(), f())).toThrow(PyTypeError);
    expect(() => divmod(s(), f())).toThrow(
      /unsupported operand type\(s\) for divmod\(\): 'str' and 'float'/,
    );
    expect(() => divmod(f(), s())).toThrow(PyTypeError);
    expect(() => divmod(f(), s())).toThrow(
      /unsupported operand type\(s\) for divmod\(\): 'float' and 'str'/,
    );
  });

  it("pow rejects str and float in both orders", () => {
    expect(() => pow(s(), f())).toThrow(PyTypeError);
    expect(() => pow(s(), f())).toThrow(
      /unsupported operand type\(s\) for \*\*: 'str' and 'float'/,
    );
    expect(() => pow(f(), s())).toThrow(PyTypeError);
    expect(() => pow(f(), s())).toThrow(
      /unsupported operand type\(s\) for \*\*: 'float' and 'str'/,
    );
  });

  it("sub rejects str and float in both orders", () => {
    expect(() => sub(s(), f())).toThrow(PyTypeError);
    expect(() => sub(s(), f())).toThrow(
      /unsupported operand type\(s\) for -: 'str' and 'float'/,
    );
    expect(() => sub(f(), s())).toThrow(PyTypeError);
    expect(() => sub(f(), s())).toThrow(
      /unsupported operand type\(s\) for -: 'float' and 'str'/,
    );
  });

  it("mul rejects str and float in both orders", () => {
    expect(() => mul(s(), f())).toThrow(PyTypeError);
    expect(() => mul(s(), f())).toThrow(
      /unsupported operand type\(s\) for \*: 'str' and 'float'/,
    );
    expect(() => mul(f(), s())).toThrow(PyTypeError);
    expect(() => mul(f(), s())).toThrow(
      /unsupported operand type\(s\) for \*: 'float' and 'str'/,
    );
  });
});

describe("cpython-derived str/float ordering", () => {
  const s = () => pyStr("a");
  const f = () => pyFloat(1.0);

  for (const [name, op] of [
    ["lt", lt],
    ["le", le],
    ["gt", gt],
    ["ge", ge],
  ] as const) {
    it(`${name} raises TypeError for str and float in both orders`, () => {
      expect(() => op(s(), f())).toThrow(PyTypeError);
      expect(() => op(s(), f())).toThrow(
        new RegExp(`'${name}' not supported between instances of 'str' and 'float'`),
      );
      expect(() => op(f(), s())).toThrow(PyTypeError);
      expect(() => op(f(), s())).toThrow(
        new RegExp(`'${name}' not supported between instances of 'float' and 'str'`),
      );
    });
  }
});
