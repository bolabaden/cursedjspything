/**
 * CPython: sequence __mul__ cross-type TypeError (plans 664, 666, 668, 670, 680, 709).
 */
import { describe, it, expect } from "vitest";
import {
  len,
  mul,
  pyBytes,
  pyInt,
  pyList,
  pyStr,
  pyTuple,
} from "../../src/index.js";
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

  it("mul rejects list and bytes in both orders", () => {
    const b = () => pyBytes(new Uint8Array([1, 2]));
    expect(() => mul(oneList(), b())).toThrow(PyTypeError);
    expect(() => mul(oneList(), b())).toThrow(
      /unsupported operand type\(s\) for \*: 'list' and 'bytes'/,
    );
    expect(() => mul(b(), oneList())).toThrow(PyTypeError);
    expect(() => mul(b(), oneList())).toThrow(
      /unsupported operand type\(s\) for \*: 'bytes' and 'list'/,
    );
  });

  it("mul rejects tuple and bytes in both orders", () => {
    const b = () => pyBytes(new Uint8Array([1, 2]));
    expect(() => mul(oneTuple(), b())).toThrow(PyTypeError);
    expect(() => mul(oneTuple(), b())).toThrow(
      /unsupported operand type\(s\) for \*: 'tuple' and 'bytes'/,
    );
    expect(() => mul(b(), oneTuple())).toThrow(PyTypeError);
    expect(() => mul(b(), oneTuple())).toThrow(
      /unsupported operand type\(s\) for \*: 'bytes' and 'tuple'/,
    );
  });

  it("mul rejects list and list", () => {
    expect(() => mul(oneList(), pyList([pyInt(2)]))).toThrow(PyTypeError);
    expect(() => mul(oneList(), pyList([pyInt(2)]))).toThrow(
      /unsupported operand type\(s\) for \*: 'list' and 'list'/,
    );
  });

  it("mul rejects list and tuple in both orders", () => {
    expect(() => mul(oneList(), oneTuple())).toThrow(PyTypeError);
    expect(() => mul(oneList(), oneTuple())).toThrow(
      /unsupported operand type\(s\) for \*: 'list' and 'tuple'/,
    );
    expect(() => mul(oneTuple(), oneList())).toThrow(PyTypeError);
    expect(() => mul(oneTuple(), oneList())).toThrow(
      /unsupported operand type\(s\) for \*: 'tuple' and 'list'/,
    );
  });

  it("mul rejects int and list", () => {
    expect(() => mul(pyInt(2), oneList())).toThrow(PyTypeError);
    expect(() => mul(pyInt(2), oneList())).toThrow(
      /unsupported operand type\(s\) for \*: 'int' and 'list'/,
    );
  });

  it("mul rejects int and tuple", () => {
    expect(() => mul(pyInt(2), oneTuple())).toThrow(PyTypeError);
    expect(() => mul(pyInt(2), oneTuple())).toThrow(
      /unsupported operand type\(s\) for \*: 'int' and 'tuple'/,
    );
  });

  it("mul allows list and int (repeat)", () => {
    expect(len(mul(oneList(), pyInt(2)) as ReturnType<typeof pyList>)).toBe(2);
  });

  it("mul allows tuple and int (repeat)", () => {
    expect(len(mul(oneTuple(), pyInt(2)) as ReturnType<typeof pyTuple>)).toBe(2);
  });
});
