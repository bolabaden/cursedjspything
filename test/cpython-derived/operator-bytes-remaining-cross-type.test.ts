/**
 * CPython: bytes↔scalar remaining binary and ordering reject incompatible types.
 */
import { describe, it, expect } from "vitest";
import {
  add,
  bytes,
  divmod,
  pyBytes,
  floordiv,
  ge,
  gt,
  le,
  lt,
  mod,
  pow,
  pyFloat,
  pyInt,
  pyStr,
  sub,
  truediv,
} from "../../src/index.js";
import { PyTypeError } from "../../src/runtime/core/errors.js";

describe("cpython-derived bytes/scalar remaining binary ops", () => {
  const b = () => bytes(pyStr("ab")) as ReturnType<typeof pyBytes>;
  const i = () => pyInt(1);
  const s = () => pyStr("a");
  const f = () => pyFloat(1.0);

  it("add rejects bytes and str or float", () => {
    expect(() => add(b(), s())).toThrow(PyTypeError);
    expect(() => add(b(), s())).toThrow(
      /unsupported operand type\(s\) for \+: 'bytes' and 'str'/,
    );
    expect(() => add(b(), f())).toThrow(PyTypeError);
    expect(() => add(b(), f())).toThrow(
      /unsupported operand type\(s\) for \+: 'bytes' and 'float'/,
    );
  });

  it("sub rejects bytes and int in both orders", () => {
    expect(() => sub(b(), i())).toThrow(PyTypeError);
    expect(() => sub(b(), i())).toThrow(
      /unsupported operand type\(s\) for -: 'bytes' and 'int'/,
    );
    expect(() => sub(i(), b())).toThrow(PyTypeError);
    expect(() => sub(i(), b())).toThrow(
      /unsupported operand type\(s\) for -: 'int' and 'bytes'/,
    );
  });

  it("truediv rejects bytes and int", () => {
    expect(() => truediv(b(), i())).toThrow(PyTypeError);
    expect(() => truediv(b(), i())).toThrow(
      /unsupported operand type\(s\) for \/: 'bytes' and 'int'/,
    );
  });

  it("floordiv rejects bytes and int", () => {
    expect(() => floordiv(b(), i())).toThrow(PyTypeError);
    expect(() => floordiv(b(), i())).toThrow(
      /unsupported operand type\(s\) for \/\/: 'bytes' and 'int'/,
    );
  });

  it("mod rejects bytes and int", () => {
    expect(() => mod(b(), i())).toThrow(PyTypeError);
    expect(() => mod(b(), i())).toThrow(
      /unsupported operand type\(s\) for %: 'bytes' and 'int'/,
    );
  });

  it("divmod rejects bytes and int in both orders", () => {
    expect(() => divmod(b(), i())).toThrow(PyTypeError);
    expect(() => divmod(b(), i())).toThrow(
      /unsupported operand type\(s\) for divmod\(\): 'bytes' and 'int'/,
    );
    expect(() => divmod(i(), b())).toThrow(PyTypeError);
    expect(() => divmod(i(), b())).toThrow(
      /unsupported operand type\(s\) for divmod\(\): 'int' and 'bytes'/,
    );
  });

  it("pow rejects bytes and int in both orders", () => {
    expect(() => pow(b(), i())).toThrow(PyTypeError);
    expect(() => pow(b(), i())).toThrow(
      /unsupported operand type\(s\) for \*\*: 'bytes' and 'int'/,
    );
    expect(() => pow(i(), b())).toThrow(PyTypeError);
    expect(() => pow(i(), b())).toThrow(
      /unsupported operand type\(s\) for \*\*: 'int' and 'bytes'/,
    );
  });
});

describe("cpython-derived bytes/scalar ordering", () => {
  const b = () => bytes(pyStr("ab")) as ReturnType<typeof pyBytes>;
  const i = () => pyInt(1);
  const s = () => pyStr("a");

  for (const [name, op] of [
    ["lt", lt],
    ["le", le],
    ["gt", gt],
    ["ge", ge],
  ] as const) {
    it(`${name} raises TypeError for bytes and int in both orders`, () => {
      expect(() => op(b(), i())).toThrow(PyTypeError);
      expect(() => op(b(), i())).toThrow(
        new RegExp(`'${name}' not supported between instances of 'bytes' and 'int'`),
      );
      expect(() => op(i(), b())).toThrow(PyTypeError);
      expect(() => op(i(), b())).toThrow(
        new RegExp(`'${name}' not supported between instances of 'int' and 'bytes'`),
      );
    });

    it(`${name} raises TypeError for bytes and str in both orders`, () => {
      expect(() => op(b(), s())).toThrow(PyTypeError);
      expect(() => op(b(), s())).toThrow(
        new RegExp(`'${name}' not supported between instances of 'bytes' and 'str'`),
      );
      expect(() => op(s(), b())).toThrow(PyTypeError);
      expect(() => op(s(), b())).toThrow(
        new RegExp(`'${name}' not supported between instances of 'str' and 'bytes'`),
      );
    });
  }
});
