/**
 * CPython: bytes objects reject cross-type add/mul with unrelated scalars.
 */
import { describe, it, expect } from "vitest";
import {
  add,
  bytes,
  bytesType,
  mul,
  pyBytes,
  pyFloat,
  pyInt,
  pyStr,
  unwrap,
} from "../../src/index.js";
import { PyTypeError } from "../../src/runtime/core/errors.js";

describe("cpython-derived bytes cross-type operators", () => {
  const b = () => bytes(pyStr("ab")) as ReturnType<typeof pyBytes>;

  it("add concatenates two bytes objects", () => {
    const left = pyBytes(new Uint8Array([97]));
    const right = pyBytes(new Uint8Array([98]));
    const result = add(left, right) as ReturnType<typeof pyBytes>;
    expect(result.type).toBe(bytesType);
    expect(Array.from(unwrap<Uint8Array>(result))).toEqual([97, 98]);
  });

  it("mul repeats bytes with int count", () => {
    const one = pyBytes(new Uint8Array([97]));
    const result = mul(one, pyInt(2)) as ReturnType<typeof pyBytes>;
    expect(Array.from(unwrap<Uint8Array>(result))).toEqual([97, 97]);
  });

  it("add rejects bytes and int", () => {
    expect(() => add(b(), pyInt(1))).toThrow(PyTypeError);
    expect(() => add(b(), pyInt(1))).toThrow(
      /unsupported operand type\(s\) for \+: 'bytes' and 'int'/,
    );
  });

  it("add rejects int and bytes", () => {
    expect(() => add(pyInt(1), b())).toThrow(PyTypeError);
    expect(() => add(pyInt(1), b())).toThrow(
      /unsupported operand type\(s\) for \+: 'int' and 'bytes'/,
    );
  });

  it("mul rejects bytes and str in both orders", () => {
    expect(() => mul(b(), pyStr("2"))).toThrow(PyTypeError);
    expect(() => mul(b(), pyStr("2"))).toThrow(
      /unsupported operand type\(s\) for \*: 'bytes' and 'str'/,
    );
    expect(() => mul(pyStr("2"), b())).toThrow(PyTypeError);
    expect(() => mul(pyStr("2"), b())).toThrow(
      /unsupported operand type\(s\) for \*: 'str' and 'bytes'/,
    );
  });

  it("mul rejects bytes and float in both orders", () => {
    expect(() => mul(b(), pyFloat(2))).toThrow(PyTypeError);
    expect(() => mul(b(), pyFloat(2))).toThrow(
      /unsupported operand type\(s\) for \*: 'bytes' and 'float'/,
    );
    expect(() => mul(pyFloat(2), b())).toThrow(PyTypeError);
    expect(() => mul(pyFloat(2), b())).toThrow(
      /unsupported operand type\(s\) for \*: 'float' and 'bytes'/,
    );
  });
});
