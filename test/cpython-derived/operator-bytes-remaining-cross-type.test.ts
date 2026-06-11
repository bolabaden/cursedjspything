/**
 * CPython: bytes↔scalar binary and ordering reject incompatible types (canonical; plan 412).
 */
import { describe, it, expect } from "vitest";
import {
  add,
  bytes,
  divmod,
  pyBytes,
  floordiv,
  mod,
  mul,
  pow,
  pyFloat,
  pyInt,
  pyStr,
  pyTrue,
  sub,
  truediv,
} from "../../src/index.js";
import { PyTypeError } from "../../src/runtime/core/errors.js";
import { registerCrossTypeOrderingRejects } from "./helpers/cross-type-ordering.js";

describe("cpython-derived bytes/scalar remaining binary ops", () => {
  const b = () => bytes(pyStr("ab"), pyStr("utf-8")) as ReturnType<typeof pyBytes>;
  const i = () => pyInt(1);
  const s = () => pyStr("a");
  const f = () => pyFloat(1.0);
  const t = () => pyTrue;

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

  it("add rejects bytes and int in both orders", () => {
    expect(() => add(b(), i())).toThrow(PyTypeError);
    expect(() => add(b(), i())).toThrow(
      /unsupported operand type\(s\) for \+: 'bytes' and 'int'/,
    );
    expect(() => add(i(), b())).toThrow(PyTypeError);
    expect(() => add(i(), b())).toThrow(
      /unsupported operand type\(s\) for \+: 'int' and 'bytes'/,
    );
  });

  it("add rejects bytes and bool in both orders", () => {
    expect(() => add(b(), t())).toThrow(PyTypeError);
    expect(() => add(b(), t())).toThrow(
      /unsupported operand type\(s\) for \+: 'bytes' and 'bool'/,
    );
    expect(() => add(t(), b())).toThrow(PyTypeError);
    expect(() => add(t(), b())).toThrow(
      /unsupported operand type\(s\) for \+: 'bool' and 'bytes'/,
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

  it("mul rejects bytes and str in both orders", () => {
    expect(() => mul(b(), s())).toThrow(PyTypeError);
    expect(() => mul(b(), s())).toThrow(
      /unsupported operand type\(s\) for \*: 'bytes' and 'str'/,
    );
    expect(() => mul(s(), b())).toThrow(PyTypeError);
    expect(() => mul(s(), b())).toThrow(
      /unsupported operand type\(s\) for \*: 'str' and 'bytes'/,
    );
  });

  it("mul rejects bytes and float in both orders", () => {
    expect(() => mul(b(), f())).toThrow(PyTypeError);
    expect(() => mul(b(), f())).toThrow(
      /unsupported operand type\(s\) for \*: 'bytes' and 'float'/,
    );
    expect(() => mul(f(), b())).toThrow(PyTypeError);
    expect(() => mul(f(), b())).toThrow(
      /unsupported operand type\(s\) for \*: 'float' and 'bytes'/,
    );
  });

  it("truediv rejects bytes and str in both orders", () => {
    expect(() => truediv(b(), s())).toThrow(PyTypeError);
    expect(() => truediv(b(), s())).toThrow(
      /unsupported operand type\(s\) for \/: 'bytes' and 'str'/,
    );
    expect(() => truediv(s(), b())).toThrow(PyTypeError);
    expect(() => truediv(s(), b())).toThrow(
      /unsupported operand type\(s\) for \/: 'str' and 'bytes'/,
    );
  });

  it("floordiv rejects bytes and str in both orders", () => {
    expect(() => floordiv(b(), s())).toThrow(PyTypeError);
    expect(() => floordiv(b(), s())).toThrow(
      /unsupported operand type\(s\) for \/\/: 'bytes' and 'str'/,
    );
    expect(() => floordiv(s(), b())).toThrow(PyTypeError);
    expect(() => floordiv(s(), b())).toThrow(
      /unsupported operand type\(s\) for \/\/: 'str' and 'bytes'/,
    );
  });

  it("mod rejects bytes and str in both orders", () => {
    expect(() => mod(b(), s())).toThrow(PyTypeError);
    expect(() => mod(b(), s())).toThrow(
      /unsupported operand type\(s\) for %: 'bytes' and 'str'/,
    );
    expect(() => mod(s(), b())).toThrow(PyTypeError);
    expect(() => mod(s(), b())).toThrow(
      /unsupported operand type\(s\) for %: 'str' and 'bytes'/,
    );
  });

  it("divmod rejects bytes and str in both orders", () => {
    expect(() => divmod(b(), s())).toThrow(PyTypeError);
    expect(() => divmod(b(), s())).toThrow(
      /unsupported operand type\(s\) for divmod\(\): 'bytes' and 'str'/,
    );
    expect(() => divmod(s(), b())).toThrow(PyTypeError);
    expect(() => divmod(s(), b())).toThrow(
      /unsupported operand type\(s\) for divmod\(\): 'str' and 'bytes'/,
    );
  });

  it("pow rejects bytes and str in both orders", () => {
    expect(() => pow(b(), s())).toThrow(PyTypeError);
    expect(() => pow(b(), s())).toThrow(
      /unsupported operand type\(s\) for \*\*: 'bytes' and 'str'/,
    );
    expect(() => pow(s(), b())).toThrow(PyTypeError);
    expect(() => pow(s(), b())).toThrow(
      /unsupported operand type\(s\) for \*\*: 'str' and 'bytes'/,
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

  it("sub rejects bytes and bool in both orders", () => {
    expect(() => sub(b(), t())).toThrow(PyTypeError);
    expect(() => sub(b(), t())).toThrow(
      /unsupported operand type\(s\) for -: 'bytes' and 'bool'/,
    );
    expect(() => sub(t(), b())).toThrow(PyTypeError);
    expect(() => sub(t(), b())).toThrow(
      /unsupported operand type\(s\) for -: 'bool' and 'bytes'/,
    );
  });

  it("truediv rejects bytes and bool in both orders", () => {
    expect(() => truediv(b(), t())).toThrow(PyTypeError);
    expect(() => truediv(b(), t())).toThrow(
      /unsupported operand type\(s\) for \/: 'bytes' and 'bool'/,
    );
    expect(() => truediv(t(), b())).toThrow(PyTypeError);
    expect(() => truediv(t(), b())).toThrow(
      /unsupported operand type\(s\) for \/: 'bool' and 'bytes'/,
    );
  });

  it("floordiv rejects bytes and bool in both orders", () => {
    expect(() => floordiv(b(), t())).toThrow(PyTypeError);
    expect(() => floordiv(b(), t())).toThrow(
      /unsupported operand type\(s\) for \/\/: 'bytes' and 'bool'/,
    );
    expect(() => floordiv(t(), b())).toThrow(PyTypeError);
    expect(() => floordiv(t(), b())).toThrow(
      /unsupported operand type\(s\) for \/\/: 'bool' and 'bytes'/,
    );
  });

  it("mod rejects bytes and bool in both orders", () => {
    expect(() => mod(b(), t())).toThrow(PyTypeError);
    expect(() => mod(b(), t())).toThrow(
      /unsupported operand type\(s\) for %: 'bytes' and 'bool'/,
    );
    expect(() => mod(t(), b())).toThrow(PyTypeError);
    expect(() => mod(t(), b())).toThrow(
      /unsupported operand type\(s\) for %: 'bool' and 'bytes'/,
    );
  });

  it("divmod rejects bytes and bool in both orders", () => {
    expect(() => divmod(b(), t())).toThrow(PyTypeError);
    expect(() => divmod(b(), t())).toThrow(
      /unsupported operand type\(s\) for divmod\(\): 'bytes' and 'bool'/,
    );
    expect(() => divmod(t(), b())).toThrow(PyTypeError);
    expect(() => divmod(t(), b())).toThrow(
      /unsupported operand type\(s\) for divmod\(\): 'bool' and 'bytes'/,
    );
  });

  it("pow rejects bytes and bool in both orders", () => {
    expect(() => pow(b(), t())).toThrow(PyTypeError);
    expect(() => pow(b(), t())).toThrow(
      /unsupported operand type\(s\) for \*\*: 'bytes' and 'bool'/,
    );
    expect(() => pow(t(), b())).toThrow(PyTypeError);
    expect(() => pow(t(), b())).toThrow(
      /unsupported operand type\(s\) for \*\*: 'bool' and 'bytes'/,
    );
  });
});

describe("cpython-derived bytes/scalar ordering", () => {
  const b = () => bytes(pyStr("ab"), pyStr("utf-8")) as ReturnType<typeof pyBytes>;
  const i = () => pyInt(1);
  const f = () => pyFloat(1.0);
  const t = () => pyTrue;

  registerCrossTypeOrderingRejects("bytes", "int", b, i);
  registerCrossTypeOrderingRejects("bytes", "float", b, f);
  registerCrossTypeOrderingRejects("bytes", "bool", b, t);
});
