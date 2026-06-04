/**
 * CPython: list/tuple __sub__ and list __isub__ rejects (plans 680, 694–701).
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

  it("sub rejects list and tuple in both orders", () => {
    const l = () => pyList([pyInt(1)]);
    const t = () => pyTuple([pyInt(2)]);
    expect(() => sub(l(), t())).toThrow(PyTypeError);
    expect(() => sub(l(), t())).toThrow(
      /unsupported operand type\(s\) for -: 'list' and 'tuple'/,
    );
    expect(() => sub(t(), l())).toThrow(PyTypeError);
    expect(() => sub(t(), l())).toThrow(
      /unsupported operand type\(s\) for -: 'tuple' and 'list'/,
    );
  });

  it("sub rejects list and int in both orders", () => {
    const l = () => pyList([pyInt(1)]);
    expect(() => sub(l(), pyInt(2))).toThrow(PyTypeError);
    expect(() => sub(l(), pyInt(2))).toThrow(
      /unsupported operand type\(s\) for -: 'list' and 'int'/,
    );
    expect(() => sub(pyInt(2), l())).toThrow(PyTypeError);
    expect(() => sub(pyInt(2), l())).toThrow(
      /unsupported operand type\(s\) for -: 'int' and 'list'/,
    );
  });

  it("sub rejects list and str in both orders", () => {
    const l = () => pyList([pyInt(1)]);
    expect(() => sub(l(), pyStr("a"))).toThrow(PyTypeError);
    expect(() => sub(l(), pyStr("a"))).toThrow(
      /unsupported operand type\(s\) for -: 'list' and 'str'/,
    );
    expect(() => sub(pyStr("a"), l())).toThrow(PyTypeError);
    expect(() => sub(pyStr("a"), l())).toThrow(
      /unsupported operand type\(s\) for -: 'str' and 'list'/,
    );
  });

  it("sub rejects list and bytes in both orders", () => {
    const l = () => pyList([pyInt(1)]);
    const b = () => pyBytes(new Uint8Array([1]));
    expect(() => sub(l(), b())).toThrow(PyTypeError);
    expect(() => sub(l(), b())).toThrow(
      /unsupported operand type\(s\) for -: 'list' and 'bytes'/,
    );
    expect(() => sub(b(), l())).toThrow(PyTypeError);
    expect(() => sub(b(), l())).toThrow(
      /unsupported operand type\(s\) for -: 'bytes' and 'list'/,
    );
  });

  it("sub rejects list and float in both orders", () => {
    const l = () => pyList([pyInt(1)]);
    expect(() => sub(l(), pyFloat(2))).toThrow(PyTypeError);
    expect(() => sub(l(), pyFloat(2))).toThrow(
      /unsupported operand type\(s\) for -: 'list' and 'float'/,
    );
    expect(() => sub(pyFloat(2), l())).toThrow(PyTypeError);
    expect(() => sub(pyFloat(2), l())).toThrow(
      /unsupported operand type\(s\) for -: 'float' and 'list'/,
    );
  });

  it("sub rejects list and bool in both orders", () => {
    const l = () => pyList([pyInt(1)]);
    expect(() => sub(l(), pyTrue)).toThrow(PyTypeError);
    expect(() => sub(l(), pyTrue)).toThrow(
      /unsupported operand type\(s\) for -: 'list' and 'bool'/,
    );
    expect(() => sub(pyTrue, l())).toThrow(PyTypeError);
    expect(() => sub(pyTrue, l())).toThrow(
      /unsupported operand type\(s\) for -: 'bool' and 'list'/,
    );
  });

  it("sub rejects list and dict in both orders", () => {
    const l = () => pyList([pyInt(1)]);
    const d = () => pyDict([]);
    expect(() => sub(l(), d())).toThrow(PyTypeError);
    expect(() => sub(l(), d())).toThrow(
      /unsupported operand type\(s\) for -: 'list' and 'dict'/,
    );
    expect(() => sub(d(), l())).toThrow(PyTypeError);
    expect(() => sub(d(), l())).toThrow(
      /unsupported operand type\(s\) for -: 'dict' and 'list'/,
    );
  });
});

describe("tuple __sub__", () => {
  const oneTuple = () => pyTuple([pyInt(1)]);

  it("sub rejects tuple and tuple", () => {
    const a = oneTuple();
    const b = pyTuple([pyInt(2)]);
    expect(() => sub(a, b)).toThrow(PyTypeError);
    expect(() => sub(a, b)).toThrow(
      /unsupported operand type\(s\) for -: 'tuple' and 'tuple'/,
    );
  });

  it("sub rejects tuple and int in both orders", () => {
    const t = oneTuple;
    expect(() => sub(t(), pyInt(2))).toThrow(PyTypeError);
    expect(() => sub(t(), pyInt(2))).toThrow(
      /unsupported operand type\(s\) for -: 'tuple' and 'int'/,
    );
    expect(() => sub(pyInt(2), t())).toThrow(PyTypeError);
    expect(() => sub(pyInt(2), t())).toThrow(
      /unsupported operand type\(s\) for -: 'int' and 'tuple'/,
    );
  });

  it("sub rejects tuple and str in both orders", () => {
    const t = oneTuple;
    expect(() => sub(t(), pyStr("a"))).toThrow(PyTypeError);
    expect(() => sub(t(), pyStr("a"))).toThrow(
      /unsupported operand type\(s\) for -: 'tuple' and 'str'/,
    );
    expect(() => sub(pyStr("a"), t())).toThrow(PyTypeError);
    expect(() => sub(pyStr("a"), t())).toThrow(
      /unsupported operand type\(s\) for -: 'str' and 'tuple'/,
    );
  });

  it("sub rejects tuple and bytes in both orders", () => {
    const t = oneTuple;
    const b = () => pyBytes(new Uint8Array([1]));
    expect(() => sub(t(), b())).toThrow(PyTypeError);
    expect(() => sub(t(), b())).toThrow(
      /unsupported operand type\(s\) for -: 'tuple' and 'bytes'/,
    );
    expect(() => sub(b(), t())).toThrow(PyTypeError);
    expect(() => sub(b(), t())).toThrow(
      /unsupported operand type\(s\) for -: 'bytes' and 'tuple'/,
    );
  });

  it("sub rejects tuple and float in both orders", () => {
    const t = oneTuple;
    expect(() => sub(t(), pyFloat(2))).toThrow(PyTypeError);
    expect(() => sub(t(), pyFloat(2))).toThrow(
      /unsupported operand type\(s\) for -: 'tuple' and 'float'/,
    );
    expect(() => sub(pyFloat(2), t())).toThrow(PyTypeError);
    expect(() => sub(pyFloat(2), t())).toThrow(
      /unsupported operand type\(s\) for -: 'float' and 'tuple'/,
    );
  });

  it("sub rejects tuple and bool in both orders", () => {
    const t = oneTuple;
    expect(() => sub(t(), pyTrue)).toThrow(PyTypeError);
    expect(() => sub(t(), pyTrue)).toThrow(
      /unsupported operand type\(s\) for -: 'tuple' and 'bool'/,
    );
    expect(() => sub(pyTrue, t())).toThrow(PyTypeError);
    expect(() => sub(pyTrue, t())).toThrow(
      /unsupported operand type\(s\) for -: 'bool' and 'tuple'/,
    );
  });

  it("sub rejects tuple and dict in both orders", () => {
    const t = oneTuple;
    const d = () => pyDict([]);
    expect(() => sub(t(), d())).toThrow(PyTypeError);
    expect(() => sub(t(), d())).toThrow(
      /unsupported operand type\(s\) for -: 'tuple' and 'dict'/,
    );
    expect(() => sub(d(), t())).toThrow(PyTypeError);
    expect(() => sub(d(), t())).toThrow(
      /unsupported operand type\(s\) for -: 'dict' and 'tuple'/,
    );
  });
});

describe("list __isub__", () => {
  it("isub rejects list and list", () => {
    const lst = pyList([pyInt(1)]);
    const other = pyList([pyInt(2)]);
    expect(() => isub(lst, other)).toThrow(PyTypeError);
    expect(() => isub(lst, other)).toThrow(
      /unsupported operand type\(s\) for -=: 'list' and 'list'/,
    );
    expect(len(lst)).toBe(1);
  });

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
