/**
 * CPython: list/tuple add rejects unrelated scalars and heterogeneous sequences.
 */
import { describe, it, expect } from "vitest";
import {
  add,
  pyInt,
  pyList,
  pyStr,
  pyTuple,
} from "../../src/index.js";
import { PyTypeError } from "../../src/runtime/core/errors.js";

describe("cpython-derived sequence cross-type add TypeError", () => {
  it("add rejects list and int", () => {
    expect(() => add(pyList([pyInt(1)]), pyInt(2))).toThrow(PyTypeError);
    expect(() => add(pyList([pyInt(1)]), pyInt(2))).toThrow(
      /unsupported operand type\(s\) for \+: 'list' and 'int'/,
    );
  });

  it("add rejects int and list", () => {
    expect(() => add(pyInt(2), pyList([pyInt(1)]))).toThrow(PyTypeError);
    expect(() => add(pyInt(2), pyList([pyInt(1)]))).toThrow(
      /unsupported operand type\(s\) for \+: 'int' and 'list'/,
    );
  });

  it("add rejects tuple and int", () => {
    expect(() => add(pyTuple([pyInt(1)]), pyInt(2))).toThrow(PyTypeError);
    expect(() => add(pyTuple([pyInt(1)]), pyInt(2))).toThrow(
      /unsupported operand type\(s\) for \+: 'tuple' and 'int'/,
    );
  });

  it("add rejects list and str", () => {
    expect(() => add(pyList([pyInt(1)]), pyStr("a"))).toThrow(PyTypeError);
    expect(() => add(pyList([pyInt(1)]), pyStr("a"))).toThrow(
      /unsupported operand type\(s\) for \+: 'list' and 'str'/,
    );
  });

  it("add rejects list and tuple", () => {
    expect(() => add(pyList([pyInt(1)]), pyTuple([pyInt(2)]))).toThrow(PyTypeError);
    expect(() => add(pyList([pyInt(1)]), pyTuple([pyInt(2)]))).toThrow(
      /unsupported operand type\(s\) for \+: 'list' and 'tuple'/,
    );
  });
});
