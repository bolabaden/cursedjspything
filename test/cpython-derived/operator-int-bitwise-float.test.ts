/**
 * CPython: int bitwise/shift operators reject float operands.
 */
import { describe, it, expect } from "vitest";
import {
  bitwiseAnd,
  bitwiseOr,
  bitwiseXor,
  lshift,
  rshift,
  pyInt,
  pyFloat,
} from "../../src/index.js";
import { PyTypeError } from "../../src/runtime/core/errors.js";

describe("cpython-derived int bitwise/shift vs float", () => {
  const i1 = () => pyInt(1);
  const i8 = () => pyInt(8);
  const f1 = () => pyFloat(1);

  it("bitwise and rejects float", () => {
    expect(() => bitwiseAnd(i1(), f1())).toThrow(PyTypeError);
    expect(() => bitwiseAnd(i1(), f1())).toThrow(
      /unsupported operand type\(s\) for &: 'int' and 'float'/,
    );
  });

  it("bitwise or rejects float", () => {
    expect(() => bitwiseOr(i1(), f1())).toThrow(PyTypeError);
    expect(() => bitwiseOr(i1(), f1())).toThrow(
      /unsupported operand type\(s\) for \|: 'int' and 'float'/,
    );
  });

  it("bitwise xor rejects float", () => {
    expect(() => bitwiseXor(i1(), f1())).toThrow(PyTypeError);
    expect(() => bitwiseXor(i1(), f1())).toThrow(
      /unsupported operand type\(s\) for \^: 'int' and 'float'/,
    );
  });

  it("lshift rejects float", () => {
    expect(() => lshift(i1(), f1())).toThrow(PyTypeError);
    expect(() => lshift(i1(), f1())).toThrow(
      /unsupported operand type\(s\) for <<: 'int' and 'float'/,
    );
  });

  it("rshift rejects float", () => {
    expect(() => rshift(i8(), f1())).toThrow(PyTypeError);
    expect(() => rshift(i8(), f1())).toThrow(
      /unsupported operand type\(s\) for >>: 'int' and 'float'/,
    );
  });
});
