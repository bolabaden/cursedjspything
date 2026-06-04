/**
 * CPython: sequence __mul__ cross-type TypeError (plan 664).
 */
import { describe, it, expect } from "vitest";
import { mul, pyInt, pyStr, pyTuple } from "../../src/index.js";
import { PyTypeError } from "../../src/runtime/core/errors.js";

describe("sequence __mul__ cross-type", () => {
  const oneTuple = () => pyTuple([pyInt(1)]);

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
