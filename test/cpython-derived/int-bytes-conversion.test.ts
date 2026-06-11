/**
 * CPython: int.to_bytes and int.from_bytes.
 */
import { describe, it, expect } from "vitest";
import {
  PyObject,
  bytesType,
  getAttr,
  intType,
  pyBytes,
  pyFalse,
  pyInt,
  pyStr,
  pyTrue,
  unwrap,
} from "../../src/index.js";
import {
  PyOverflowError,
  PyTypeError,
  PyValueError,
} from "../../src/runtime/core/errors.js";

describe("cpython-derived int bytes conversion", () => {
  type ToBytesFn = (
    self: PyObject,
    length: unknown,
    byteorder: unknown,
    signed?: unknown,
  ) => PyObject;
  type FromBytesFn = (
    cls: unknown,
    bytesArg: unknown,
    byteorder: unknown,
    signed?: unknown,
  ) => PyObject;

  function toBytes(
    v: number,
    length: number,
    byteorder: "big" | "little",
    signed = false,
  ): Uint8Array {
    const self = pyInt(v);
    const fn = getAttr(self, "to_bytes") as ToBytesFn;
    const result = fn(self, pyInt(length), pyStr(byteorder), signed ? pyTrue : pyFalse);
    expect(result.type).toBe(bytesType);
    return unwrap(result) as Uint8Array;
  }

  function fromBytes(
    data: Uint8Array,
    byteorder: "big" | "little",
    signed = false,
  ): number {
    const fn = intType.typeDict.get("from_bytes") as FromBytesFn;
    const result = fn(intType, pyBytes(data), pyStr(byteorder), signed ? pyTrue : pyFalse);
    expect(result.type).toBe(intType);
    return unwrap(result);
  }

  it("to_bytes accepts bool as length like CPython int subclass", () => {
    const self = pyInt(255);
    const fn = getAttr(self, "to_bytes") as ToBytesFn;
    const result = fn(self, pyTrue, pyStr("big"));
    expect(unwrap(result)).toEqual(new Uint8Array([255]));
  });

  it("to_bytes encodes unsigned big-endian values", () => {
    expect(toBytes(255, 1, "big")).toEqual(new Uint8Array([255]));
    expect(toBytes(256, 2, "big")).toEqual(new Uint8Array([1, 0]));
    expect(toBytes(0, 1, "big")).toEqual(new Uint8Array([0]));
    expect(toBytes(0, 0, "big")).toEqual(new Uint8Array([]));
  });

  it("to_bytes encodes signed two's complement", () => {
    expect(toBytes(-1, 1, "big", true)).toEqual(new Uint8Array([255]));
    expect(toBytes(-1024, 2, "big", true)).toEqual(new Uint8Array([252, 0]));
  });

  it("to_bytes supports little-endian byteorder", () => {
    expect(toBytes(256, 2, "little")).toEqual(new Uint8Array([0, 1]));
    expect(toBytes(-1024, 2, "little", true)).toEqual(new Uint8Array([0, 252]));
  });

  it("from_bytes decodes unsigned and signed values", () => {
    expect(fromBytes(new Uint8Array([255]), "big")).toBe(255);
    expect(fromBytes(new Uint8Array([1, 0]), "big")).toBe(256);
    expect(fromBytes(new Uint8Array([255]), "big", true)).toBe(-1);
    expect(fromBytes(new Uint8Array([252, 0]), "big", true)).toBe(-1024);
    expect(fromBytes(new Uint8Array([0, 252]), "little", true)).toBe(-1024);
  });

  it("round-trips representative values", () => {
    for (const v of [0, 1, 255, 256, -1, -1024]) {
      const encoded = toBytes(v, 2, "big", true);
      expect(fromBytes(encoded, "big", true)).toBe(v);
    }
  });

  it("rejects invalid byteorder and overflow cases", () => {
    const self = pyInt(1);
    const fn = getAttr(self, "to_bytes") as ToBytesFn;
    expect(() => fn(self, pyInt(1), pyStr("middle"))).toThrow(PyValueError);
    expect(() => fn(self, pyInt(1), pyStr("middle"))).toThrow(
      /byteorder must be either 'little' or 'big'/,
    );
    expect(() => fn(self, pyInt(1), pyInt(1))).toThrow(PyTypeError);
    expect(() => fn(self, pyInt(1), pyInt(1))).toThrow(
      /to_bytes\(\) argument 'byteorder' must be str, not int/,
    );
    expect(() => toBytes(-1, 1, "big")).toThrow(PyOverflowError);
    expect(() => toBytes(-1, 1, "big")).toThrow(/can't convert negative int to unsigned/);
    expect(() => toBytes(256, 1, "big")).toThrow(PyOverflowError);
    expect(() => toBytes(256, 1, "big")).toThrow(/int too big to convert/);
  });

  it("from_bytes rejects non-bytes arguments", () => {
    const fn = intType.typeDict.get("from_bytes") as FromBytesFn;
    expect(() => fn(intType, pyStr("ab"), pyStr("big"))).toThrow(PyTypeError);
    expect(() => fn(intType, pyStr("ab"), pyStr("big"))).toThrow(
      /cannot convert 'str' object to bytes/,
    );
  });
});
