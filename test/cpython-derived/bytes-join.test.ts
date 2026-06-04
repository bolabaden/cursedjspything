/**
 * CPython: bytes.join concatenates bytes iterables with a separator.
 */
import { describe, it, expect } from "vitest";
import {
  PyObject,
  bytesType,
  getAttr,
  pyBytes,
  pyInt,
  pyList,
  pyStr,
  pyTuple,
  unwrap,
} from "../../src/index.js";
import { PyTypeError } from "../../src/runtime/core/errors.js";

type JoinFn = (self: PyObject, iterable: unknown) => unknown;

describe("cpython-derived bytes join", () => {
  function join(sep: Uint8Array, iterable: unknown): unknown {
    const sepObj = pyBytes(sep);
    const joinFn = getAttr(sepObj, "join") as JoinFn;
    return joinFn(sepObj, iterable);
  }

  function asBytes(v: unknown): Uint8Array {
    return unwrap<Uint8Array>(v as ReturnType<typeof pyBytes>);
  }

  it("joins bytes with separator", () => {
    const parts = pyList([
      pyBytes(new Uint8Array([97])),
      pyBytes(new Uint8Array([98])),
      pyBytes(new Uint8Array([99])),
    ]);
    const out = join(new Uint8Array([44]), parts);
    expect((out as PyObject).type).toBe(bytesType);
    expect(Array.from(asBytes(out))).toEqual([97, 44, 98, 44, 99]);
  });

  it("joins tuple iterable", () => {
    const parts = pyTuple([
      pyBytes(new Uint8Array([120])),
      pyBytes(new Uint8Array([121])),
    ]);
    const out = join(new Uint8Array([45]), parts);
    expect(Array.from(asBytes(out))).toEqual([120, 45, 121]);
  });

  it("empty iterable returns empty bytes", () => {
    const out = join(new Uint8Array([45]), pyList([]));
    expect(Array.from(asBytes(out))).toEqual([]);
  });

  it("single element has no separator", () => {
    const out = join(new Uint8Array([124]), pyList([pyBytes(new Uint8Array([111]))]));
    expect(Array.from(asBytes(out))).toEqual([111]);
  });

  it("empty separator concatenates without intervening bytes", () => {
    const parts = pyList([
      pyBytes(new Uint8Array([97])),
      pyBytes(new Uint8Array([98])),
      pyBytes(new Uint8Array([99])),
    ]);
    const out = join(new Uint8Array([]), parts);
    expect(Array.from(asBytes(out))).toEqual([97, 98, 99]);
    const emptyOut = join(new Uint8Array([]), pyList([]));
    expect(Array.from(asBytes(emptyOut))).toEqual([]);
    const singleOut = join(new Uint8Array([]), pyList([pyBytes(new Uint8Array([104, 105]))]));
    expect(Array.from(asBytes(singleOut))).toEqual([104, 105]);
  });

  it("rejects non-bytes sequence items", () => {
    const parts = pyList([
      pyBytes(new Uint8Array([97])),
      pyStr("b"),
    ]);
    expect(() => join(new Uint8Array([44]), parts)).toThrow(PyTypeError);
    expect(() => join(new Uint8Array([44]), parts)).toThrow(
      /sequence item 1: expected a bytes-like object, str found/,
    );
  });

  it("rejects non-iterable", () => {
    expect(() => join(new Uint8Array([44]), pyInt(1))).toThrow(PyTypeError);
    expect(() => join(new Uint8Array([44]), pyInt(1))).toThrow(
      /can only join an iterable/,
    );
  });
});
