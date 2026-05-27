/**
 * CPython: unary neg/pos/invert/abs reject types without slots.
 */
import { describe, it, expect } from "vitest";
import { abs, invert, neg, pos, pyList } from "../../src/index.js";
import { PyTypeError } from "../../src/runtime/core/errors.js";

describe("cpython-derived unary operators on list", () => {
  const lst = () => pyList([]);

  it("neg rejects list", () => {
    expect(() => neg(lst())).toThrow(PyTypeError);
    expect(() => neg(lst())).toThrow(/bad operand type for unary -: 'list'/);
  });

  it("pos rejects list", () => {
    expect(() => pos(lst())).toThrow(PyTypeError);
    expect(() => pos(lst())).toThrow(/bad operand type for unary \+: 'list'/);
  });

  it("invert rejects list", () => {
    expect(() => invert(lst())).toThrow(PyTypeError);
    expect(() => invert(lst())).toThrow(/bad operand type for unary ~: 'list'/);
  });

  it("abs rejects list", () => {
    expect(() => abs(lst())).toThrow(PyTypeError);
    expect(() => abs(lst())).toThrow(/bad operand type for unary abs\(\): 'list'/);
  });
});
