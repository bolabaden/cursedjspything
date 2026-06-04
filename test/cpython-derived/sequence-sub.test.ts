/**
 * CPython: list __sub__ / __isub__ rejects (plans 680, 694–696).
 */
import { describe, it, expect } from "vitest";
import {
  isub,
  len,
  pyBytes,
  pyDict,
  pyFloat,
  pyInt,
  pyList,
  pyStr,
  pyTrue,
  pyTuple,
  sub,
} from "../../src/index.js";
import { PyTypeError } from "../../src/runtime/core/errors.js";

describe("list __sub__", () => {
  it("sub rejects list and list", () => {
    const a = pyList([pyInt(1)]);
    const b = pyList([pyInt(2)]);
    expect(() => sub(a, b)).toThrow(PyTypeError);
    expect(() => sub(a, b)).toThrow(
      /unsupported operand type\(s\) for -: 'list' and 'list'/,
    );
  });
});

describe("list __isub__", () => {
  it("isub rejects list and int", () => {
    const lst = pyList([pyInt(1)]);
    expect(() => isub(lst, pyInt(2))).toThrow(PyTypeError);
    expect(() => isub(lst, pyInt(2))).toThrow(
      /unsupported operand type\(s\) for -=: 'list' and 'int'/,
    );
    expect(len(lst)).toBe(1);
  });

  it("isub rejects list and str", () => {
    const lst = pyList([pyInt(1)]);
    expect(() => isub(lst, pyStr("a"))).toThrow(PyTypeError);
    expect(() => isub(lst, pyStr("a"))).toThrow(
      /unsupported operand type\(s\) for -=: 'list' and 'str'/,
    );
    expect(len(lst)).toBe(1);
  });

  it("isub rejects list and tuple", () => {
    const lst = pyList([pyInt(1)]);
    expect(() => isub(lst, pyTuple([pyInt(2)]))).toThrow(PyTypeError);
    expect(() => isub(lst, pyTuple([pyInt(2)]))).toThrow(
      /unsupported operand type\(s\) for -=: 'list' and 'tuple'/,
    );
    expect(len(lst)).toBe(1);
  });

  it("isub rejects list and bytes", () => {
    const lst = pyList([pyInt(1)]);
    expect(() => isub(lst, pyBytes(new Uint8Array([97])))).toThrow(PyTypeError);
    expect(() => isub(lst, pyBytes(new Uint8Array([97])))).toThrow(
      /unsupported operand type\(s\) for -=: 'list' and 'bytes'/,
    );
    expect(len(lst)).toBe(1);
  });

  it("isub rejects list and float", () => {
    const lst = pyList([pyInt(1)]);
    expect(() => isub(lst, pyFloat(2))).toThrow(PyTypeError);
    expect(() => isub(lst, pyFloat(2))).toThrow(
      /unsupported operand type\(s\) for -=: 'list' and 'float'/,
    );
    expect(len(lst)).toBe(1);
  });

  it("isub rejects list and bool", () => {
    const lst = pyList([pyInt(1)]);
    expect(() => isub(lst, pyTrue)).toThrow(PyTypeError);
    expect(() => isub(lst, pyTrue)).toThrow(
      /unsupported operand type\(s\) for -=: 'list' and 'bool'/,
    );
    expect(len(lst)).toBe(1);
  });

  it("isub rejects list and dict", () => {
    const lst = pyList([pyInt(1)]);
    expect(() => isub(lst, pyDict([]))).toThrow(PyTypeError);
    expect(() => isub(lst, pyDict([]))).toThrow(
      /unsupported operand type\(s\) for -=: 'list' and 'dict'/,
    );
    expect(len(lst)).toBe(1);
  });
});
