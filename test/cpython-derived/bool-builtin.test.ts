/**
 * CPython: builtin bool constructor.
 */
import { describe, it, expect } from "vitest";
import {
  bool,
  boolProtocol,
  boolType,
  pyFalse,
  pyFloat,
  pyInt,
  pyList,
  pyStr,
  pyTrue,
} from "../../src/index.js";
import { PyTypeError } from "../../src/runtime/core/errors.js";

describe("cpython-derived bool builtin", () => {
  it("bool() returns False", () => {
    expect(bool()).toBe(pyFalse);
    expect(bool().type).toBe(boolType);
  });

  it("bool(x) converts via truthiness", () => {
    expect(bool(pyInt(0))).toBe(pyFalse);
    expect(bool(pyInt(1))).toBe(pyTrue);
    expect(bool(pyStr(""))).toBe(pyFalse);
    expect(bool(pyStr("x"))).toBe(pyTrue);
    expect(bool(pyList([pyInt(1)]))).toBe(pyTrue);
    expect(boolProtocol(pyInt(1))).toBe(true);
  });

  it("bool(bool) preserves identity", () => {
    expect(bool(pyTrue)).toBe(pyTrue);
    expect(bool(pyFalse)).toBe(pyFalse);
  });

  it("rejects too many arguments", () => {
    expect(() => bool(pyInt(1), pyInt(2))).toThrow(PyTypeError);
    expect(() => bool(pyInt(1), pyInt(2))).toThrow(
      /expected at most 1 argument, got 2/,
    );
  });

  it("rejects non-PyObject arguments", () => {
    expect(() => bool(1 as unknown as never)).toThrow(PyTypeError);
    expect(() => bool(1 as unknown as never)).toThrow(
      /bool\(\) argument must be PyObject, not number/,
    );
  });

  it("bool(float) follows truthiness", () => {
    expect(bool(pyFloat(0))).toBe(pyFalse);
    expect(bool(pyFloat(0.5))).toBe(pyTrue);
  });
});
