/**
 * CPython: int↔str binary ops beyond add reject incompatible types.
 */
import { describe, it, expect } from "vitest";
import {
  floordiv,
  mod,
  pyInt,
  pyStr,
  sub,
  truediv,
} from "../../src/index.js";
import { PyTypeError } from "../../src/runtime/core/errors.js";

describe("cpython-derived int/str binary arithmetic", () => {
  const i1 = () => pyInt(1);
  const sa = () => pyStr("a");

  it("sub rejects int and str in both orders", () => {
    expect(() => sub(i1(), sa())).toThrow(PyTypeError);
    expect(() => sub(i1(), sa())).toThrow(
      /unsupported operand type\(s\) for -: 'int' and 'str'/,
    );
    expect(() => sub(sa(), i1())).toThrow(PyTypeError);
    expect(() => sub(sa(), i1())).toThrow(
      /unsupported operand type\(s\) for -: 'str' and 'int'/,
    );
  });

  it("floordiv rejects int and str", () => {
    expect(() => floordiv(i1(), sa())).toThrow(PyTypeError);
    expect(() => floordiv(i1(), sa())).toThrow(
      /unsupported operand type\(s\) for \/\/: 'int' and 'str'/,
    );
  });

  it("mod rejects int and str", () => {
    expect(() => mod(i1(), sa())).toThrow(PyTypeError);
    expect(() => mod(i1(), sa())).toThrow(
      /unsupported operand type\(s\) for %: 'int' and 'str'/,
    );
  });

  it("truediv rejects int and str", () => {
    expect(() => truediv(i1(), sa())).toThrow(PyTypeError);
    expect(() => truediv(i1(), sa())).toThrow(
      /unsupported operand type\(s\) for \/: 'int' and 'str'/,
    );
  });
});
