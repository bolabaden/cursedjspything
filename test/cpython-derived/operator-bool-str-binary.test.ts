/**
 * CPython: bool↔str add/sub/truediv reject incompatible types ('bool' typename).
 */
import { describe, it, expect } from "vitest";
import {
  add,
  pyStr,
  pyTrue,
  sub,
  truediv,
} from "../../src/index.js";
import { PyTypeError } from "../../src/runtime/core/errors.js";

describe("cpython-derived bool/str binary ops", () => {
  const t = () => pyTrue;
  const s = () => pyStr("a");

  it("add rejects bool and str in both orders", () => {
    expect(() => add(t(), s())).toThrow(PyTypeError);
    expect(() => add(t(), s())).toThrow(
      /unsupported operand type\(s\) for \+: 'bool' and 'str'/,
    );
    expect(() => add(s(), t())).toThrow(PyTypeError);
    expect(() => add(s(), t())).toThrow(
      /unsupported operand type\(s\) for \+: 'str' and 'bool'/,
    );
  });

  it("sub rejects bool and str", () => {
    expect(() => sub(t(), s())).toThrow(PyTypeError);
    expect(() => sub(t(), s())).toThrow(
      /unsupported operand type\(s\) for -: 'bool' and 'str'/,
    );
  });

  it("truediv rejects bool and str", () => {
    expect(() => truediv(t(), s())).toThrow(PyTypeError);
    expect(() => truediv(t(), s())).toThrow(
      /unsupported operand type\(s\) for \/: 'bool' and 'str'/,
    );
  });
});
