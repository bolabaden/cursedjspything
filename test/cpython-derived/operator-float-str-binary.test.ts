/**
 * CPython: float↔str binary ops reject incompatible types.
 */
import { describe, it, expect } from "vitest";
import {
  add,
  pyFloat,
  pyStr,
  sub,
  truediv,
} from "../../src/index.js";
import { PyTypeError } from "../../src/runtime/core/errors.js";

describe("cpython-derived float/str binary arithmetic", () => {
  const f1 = () => pyFloat(1.0);
  const sa = () => pyStr("a");

  it("add rejects float and str in both orders", () => {
    expect(() => add(f1(), sa())).toThrow(PyTypeError);
    expect(() => add(f1(), sa())).toThrow(
      /unsupported operand type\(s\) for \+: 'float' and 'str'/,
    );
    expect(() => add(sa(), f1())).toThrow(PyTypeError);
    expect(() => add(sa(), f1())).toThrow(
      /unsupported operand type\(s\) for \+: 'str' and 'float'/,
    );
  });

  it("sub rejects float and str", () => {
    expect(() => sub(f1(), sa())).toThrow(PyTypeError);
    expect(() => sub(f1(), sa())).toThrow(
      /unsupported operand type\(s\) for -: 'float' and 'str'/,
    );
  });

  it("truediv rejects float and str", () => {
    expect(() => truediv(f1(), sa())).toThrow(PyTypeError);
    expect(() => truediv(f1(), sa())).toThrow(
      /unsupported operand type\(s\) for \/: 'float' and 'str'/,
    );
  });
});
