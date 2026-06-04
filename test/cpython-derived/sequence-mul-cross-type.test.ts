/**
 * CPython: sequence __mul__ cross-type TypeError (plans 664, 666).
 */
import { describe, it, expect } from "vitest";
import { mul, pyInt, pyList, pyStr, pyTuple } from "../../src/index.js";
import { PyTypeError } from "../../src/runtime/core/errors.js";

describe("sequence __mul__ cross-type", () => {
  const oneList = () => pyList([pyInt(1)]);
  const oneTuple = () => pyTuple([pyInt(1)]);

  it("mul rejects list and str in both orders", () => {
    expect(() => mul(oneList(), pyStr("a"))).toThrow(PyTypeError);
    expect(() => mul(oneList(), pyStr("a"))).toThrow(
      /unsupported operand type\(s\) for \*: 'list' and 'str'/,
    );
    expect(() => mul(pyStr("a"), oneList())).toThrow(PyTypeError);
    expect(() => mul(pyStr("a"), oneList())).toThrow(
      /unsupported operand type\(s\) for \*: 'str' and 'list'/,
    );
  });

  it("mul rejects tuple and str in both orders", () => {
    expect(() => mul(oneTuple(), pyStr("a"))).toThrow(PyTypeError);
    expect(() => mul(oneTuple(), pyStr("a"))).toThrow(
      /unsupported operand type\(s\) for \*: 'tuple' and 'str'/,
    );
    expect(() => mul(pyStr("a"), oneTuple())).toThrow(PyTypeError);
    expect(() => mul(pyStr("a"), oneTuple())).toThrow(
      /unsupported operand type\(s\) for \*: 'str' and 'tuple'/,
    );
  });
});
