/**
 * CPython: str↔int remaining binary and ordering reject incompatible types.
 */
import { describe, it, expect } from "vitest";
import {
  floordiv,
  ge,
  gt,
  le,
  lt,
  mod,
  pyInt,
  pyStr,
  sub,
  truediv,
} from "../../src/index.js";
import { PyTypeError } from "../../src/runtime/core/errors.js";

describe("cpython-derived str/int remaining binary ops", () => {
  const s = () => pyStr("a");
  const i = () => pyInt(1);

  it("sub rejects str and int in both orders", () => {
    expect(() => sub(s(), i())).toThrow(PyTypeError);
    expect(() => sub(s(), i())).toThrow(
      /unsupported operand type\(s\) for -: 'str' and 'int'/,
    );
    expect(() => sub(i(), s())).toThrow(PyTypeError);
    expect(() => sub(i(), s())).toThrow(
      /unsupported operand type\(s\) for -: 'int' and 'str'/,
    );
  });

  it("truediv rejects str and int", () => {
    expect(() => truediv(s(), i())).toThrow(PyTypeError);
    expect(() => truediv(s(), i())).toThrow(
      /unsupported operand type\(s\) for \/: 'str' and 'int'/,
    );
  });

  it("floordiv rejects str and int", () => {
    expect(() => floordiv(s(), i())).toThrow(PyTypeError);
    expect(() => floordiv(s(), i())).toThrow(
      /unsupported operand type\(s\) for \/\/: 'str' and 'int'/,
    );
  });

  it("mod rejects str and int", () => {
    expect(() => mod(s(), i())).toThrow(PyTypeError);
    expect(() => mod(s(), i())).toThrow(
      /unsupported operand type\(s\) for %: 'str' and 'int'/,
    );
  });
});

describe("cpython-derived str/int ordering", () => {
  const s = () => pyStr("a");
  const i = () => pyInt(1);

  for (const [name, op] of [
    ["lt", lt],
    ["le", le],
    ["gt", gt],
    ["ge", ge],
  ] as const) {
    it(`${name} raises TypeError for str and int in both orders`, () => {
      expect(() => op(s(), i())).toThrow(PyTypeError);
      expect(() => op(s(), i())).toThrow(
        new RegExp(`'${name}' not supported between instances of 'str' and 'int'`),
      );
      expect(() => op(i(), s())).toThrow(PyTypeError);
      expect(() => op(i(), s())).toThrow(
        new RegExp(`'${name}' not supported between instances of 'int' and 'str'`),
      );
    });
  }
});
