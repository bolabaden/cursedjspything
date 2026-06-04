/**
 * CPython: list __imul__ cross-type *= rejects (plan 676).
 */
import { describe, it, expect } from "vitest";
import { imul, pyFloat, pyInt, pyList, pyTuple } from "../../src/index.js";
import { PyTypeError } from "../../src/runtime/core/errors.js";

describe("list __imul__", () => {
  const oneList = () => pyList([pyInt(1)]);

  it("imul rejects list and float", () => {
    expect(() => imul(oneList(), pyFloat(2))).toThrow(PyTypeError);
    expect(() => imul(oneList(), pyFloat(2))).toThrow(
      /unsupported operand type\(s\) for \*=: 'list' and 'float'/,
    );
  });

  it("imul rejects list and list", () => {
    expect(() => imul(oneList(), pyList([pyInt(2)]))).toThrow(PyTypeError);
    expect(() => imul(oneList(), pyList([pyInt(2)]))).toThrow(
      /unsupported operand type\(s\) for \*=: 'list' and 'list'/,
    );
  });

  it("imul rejects list and tuple", () => {
    expect(() => imul(oneList(), pyTuple([pyInt(2)]))).toThrow(PyTypeError);
    expect(() => imul(oneList(), pyTuple([pyInt(2)]))).toThrow(
      /unsupported operand type\(s\) for \*=: 'list' and 'tuple'/,
    );
  });
});
