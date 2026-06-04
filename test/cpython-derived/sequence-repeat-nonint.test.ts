/**
 * CPython: sequence repetition requires int-like repeat count.
 */
import { describe, it, expect } from "vitest";
import {
  mul,
  pyBytes,
  pyFloat,
  pyInt,
  pyList,
  pyStr,
  pyTuple,
} from "../../src/index.js";
import { PyTypeError } from "../../src/runtime/core/errors.js";

describe("cpython-derived sequence repeat non-int", () => {
  const oneList = () => pyList([pyInt(1)]);
  const oneTuple = () => pyTuple([pyInt(1)]);

  it("list mul rejects float repeat count", () => {
    expect(() => mul(oneList(), pyFloat(2))).toThrow(PyTypeError);
    expect(() => mul(oneList(), pyFloat(2))).toThrow(
      /unsupported operand type\(s\) for \*: 'list' and 'float'/,
    );
  });

  it("tuple mul rejects float repeat count", () => {
    expect(() => mul(oneTuple(), pyFloat(2))).toThrow(PyTypeError);
    expect(() => mul(oneTuple(), pyFloat(2))).toThrow(
      /unsupported operand type\(s\) for \*: 'tuple' and 'float'/,
    );
  });

  it("str mul rejects float repeat count", () => {
    expect(() => mul(pyStr("a"), pyFloat(2))).toThrow(PyTypeError);
    expect(() => mul(pyStr("a"), pyFloat(2))).toThrow(
      /unsupported operand type\(s\) for \*: 'str' and 'float'/,
    );
  });

  it("bytes mul rejects float repeat count", () => {
    const one = pyBytes(new Uint8Array([97]));
    expect(() => mul(one, pyFloat(2))).toThrow(PyTypeError);
    expect(() => mul(one, pyFloat(2))).toThrow(
      /unsupported operand type\(s\) for \*: 'bytes' and 'float'/,
    );
  });
});
