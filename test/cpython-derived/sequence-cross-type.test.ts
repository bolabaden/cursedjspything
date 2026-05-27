/**
 * CPython: sequence add/mul reject incompatible operand types.
 */
import { describe, it, expect } from "vitest";
import { add, mul, pyInt, pyList, pyStr } from "../../src/index.js";
import { PyTypeError } from "../../src/runtime/core/errors.js";

describe("cpython-derived sequence cross-type operators", () => {
  const one = () => pyList([pyInt(1)]);

  it("list add int raises TypeError", () => {
    expect(() => add(one(), pyInt(1))).toThrow(PyTypeError);
    expect(() => add(one(), pyInt(1))).toThrow(
      /unsupported operand type\(s\) for \+: 'list' and 'int'/,
    );
  });

  it("list add str raises TypeError", () => {
    expect(() => add(one(), pyStr("a"))).toThrow(PyTypeError);
    expect(() => add(one(), pyStr("a"))).toThrow(
      /unsupported operand type\(s\) for \+: 'list' and 'str'/,
    );
  });

  it("str add list raises TypeError", () => {
    expect(() => add(pyStr("a"), one())).toThrow(PyTypeError);
    expect(() => add(pyStr("a"), one())).toThrow(
      /unsupported operand type\(s\) for \+: 'str' and 'list'/,
    );
  });

  it("list mul str raises TypeError", () => {
    expect(() => mul(one(), pyStr("a"))).toThrow(PyTypeError);
    expect(() => mul(one(), pyStr("a"))).toThrow(
      /unsupported operand type\(s\) for \*: 'list' and 'str'/,
    );
  });
});
