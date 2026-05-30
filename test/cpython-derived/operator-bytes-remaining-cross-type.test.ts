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

  it("add rejects bytes and str in both orders", () => {
    expect(() => add(b(), s())).toThrow(PyTypeError);
    expect(() => add(b(), s())).toThrow(
      /unsupported operand type\(s\) for \+: 'bytes' and 'str'/,
    );
    expect(() => add(s(), b())).toThrow(PyTypeError);
    expect(() => add(s(), b())).toThrow(
      /unsupported operand type\(s\) for \+: 'str' and 'bytes'/,
    );
  });

  it("add rejects bytes and float in both orders", () => {
    expect(() => add(b(), f())).toThrow(PyTypeError);
    expect(() => add(b(), f())).toThrow(
      /unsupported operand type\(s\) for \+: 'bytes' and 'float'/,
    );
    expect(() => add(f(), b())).toThrow(PyTypeError);
    expect(() => add(f(), b())).toThrow(
      /unsupported operand type\(s\) for \+: 'float' and 'bytes'/,
    );
  });

  it("sub rejects bytes and str in both orders", () => {
    expect(() => sub(b(), s())).toThrow(PyTypeError);
    expect(() => sub(b(), s())).toThrow(
      /unsupported operand type\(s\) for -: 'bytes' and 'str'/,
    );
    expect(() => sub(s(), b())).toThrow(PyTypeError);
    expect(() => sub(s(), b())).toThrow(
      /unsupported operand type\(s\) for -: 'str' and 'bytes'/,
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

  it("truediv rejects bytes and int in both orders", () => {
    expect(() => truediv(b(), i())).toThrow(PyTypeError);
    expect(() => truediv(b(), i())).toThrow(
      /unsupported operand type\(s\) for \/: 'bytes' and 'int'/,
    );
    expect(() => truediv(i(), b())).toThrow(PyTypeError);
    expect(() => truediv(i(), b())).toThrow(
      /unsupported operand type\(s\) for \/: 'int' and 'bytes'/,
    );
  });

  it("floordiv rejects bytes and int in both orders", () => {
    expect(() => floordiv(b(), i())).toThrow(PyTypeError);
    expect(() => floordiv(b(), i())).toThrow(
      /unsupported operand type\(s\) for \/\/: 'bytes' and 'int'/,
    );
    expect(() => floordiv(i(), b())).toThrow(PyTypeError);
    expect(() => floordiv(i(), b())).toThrow(
      /unsupported operand type\(s\) for \/\/: 'int' and 'bytes'/,
    );
  });

  it("mod rejects bytes and int in both orders", () => {
    expect(() => mod(b(), i())).toThrow(PyTypeError);
    expect(() => mod(b(), i())).toThrow(
      /unsupported operand type\(s\) for %: 'bytes' and 'int'/,
    );
    expect(() => mod(i(), b())).toThrow(PyTypeError);
    expect(() => mod(i(), b())).toThrow(
      /unsupported operand type\(s\) for %: 'int' and 'bytes'/,
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

  it("sub rejects bytes and float in both orders", () => {
    expect(() => sub(b(), f())).toThrow(PyTypeError);
    expect(() => sub(b(), f())).toThrow(
      /unsupported operand type\(s\) for -: 'bytes' and 'float'/,
    );
    expect(() => sub(f(), b())).toThrow(PyTypeError);
    expect(() => sub(f(), b())).toThrow(
      /unsupported operand type\(s\) for -: 'float' and 'bytes'/,
    );
  });

  it("truediv rejects bytes and float in both orders", () => {
    expect(() => truediv(b(), f())).toThrow(PyTypeError);
    expect(() => truediv(b(), f())).toThrow(
      /unsupported operand type\(s\) for \/: 'bytes' and 'float'/,
    );
    expect(() => truediv(f(), b())).toThrow(PyTypeError);
    expect(() => truediv(f(), b())).toThrow(
      /unsupported operand type\(s\) for \/: 'float' and 'bytes'/,
    );
  });

  it("floordiv rejects bytes and float in both orders", () => {
    expect(() => floordiv(b(), f())).toThrow(PyTypeError);
    expect(() => floordiv(b(), f())).toThrow(
      /unsupported operand type\(s\) for \/\/: 'bytes' and 'float'/,
    );
    expect(() => floordiv(f(), b())).toThrow(PyTypeError);
    expect(() => floordiv(f(), b())).toThrow(
      /unsupported operand type\(s\) for \/\/: 'float' and 'bytes'/,
    );
  });

  it("mod rejects bytes and float in both orders", () => {
    expect(() => mod(b(), f())).toThrow(PyTypeError);
    expect(() => mod(b(), f())).toThrow(
      /unsupported operand type\(s\) for %: 'bytes' and 'float'/,
    );
    expect(() => mod(f(), b())).toThrow(PyTypeError);
    expect(() => mod(f(), b())).toThrow(
      /unsupported operand type\(s\) for %: 'float' and 'bytes'/,
    );
  });

  it("divmod rejects bytes and float in both orders", () => {
    expect(() => divmod(b(), f())).toThrow(PyTypeError);
    expect(() => divmod(b(), f())).toThrow(
      /unsupported operand type\(s\) for divmod\(\): 'bytes' and 'float'/,
    );
    expect(() => divmod(f(), b())).toThrow(PyTypeError);
    expect(() => divmod(f(), b())).toThrow(
      /unsupported operand type\(s\) for divmod\(\): 'float' and 'bytes'/,
    );
  });

  it("pow rejects bytes and float in both orders", () => {
    expect(() => pow(b(), f())).toThrow(PyTypeError);
    expect(() => pow(b(), f())).toThrow(
      /unsupported operand type\(s\) for \*\*: 'bytes' and 'float'/,
    );
    expect(() => pow(f(), b())).toThrow(PyTypeError);
    expect(() => pow(f(), b())).toThrow(
      /unsupported operand type\(s\) for \*\*: 'float' and 'bytes'/,
    );
  });
});

describe("cpython-derived bytes/scalar ordering", () => {
  const b = () => bytes(pyStr("ab")) as ReturnType<typeof pyBytes>;
  const i = () => pyInt(1);
  const s = () => pyStr("a");
  const f = () => pyFloat(1.0);

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

    it(`${name} raises TypeError for bytes and float in both orders`, () => {
      expect(() => op(b(), f())).toThrow(PyTypeError);
      expect(() => op(b(), f())).toThrow(
        new RegExp(`'${name}' not supported between instances of 'bytes' and 'float'`),
      );
      expect(() => op(f(), b())).toThrow(PyTypeError);
      expect(() => op(f(), b())).toThrow(
        new RegExp(`'${name}' not supported between instances of 'float' and 'bytes'`),
      );
    });
  }
});
