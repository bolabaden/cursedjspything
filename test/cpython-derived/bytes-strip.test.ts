/**
 * CPython: bytes.strip / lstrip / rstrip trim leading and trailing bytes.
 */
import { describe, it, expect } from "vitest";
import {
  getAttr,
  pyBytes,
  pyStr,
  unwrap,
} from "../../src/index.js";
import { PyTypeError } from "../../src/runtime/core/errors.js";

type StripFn = (self: ReturnType<typeof pyBytes>, chars?: unknown) => unknown;

describe("cpython-derived bytes strip", () => {
  function strip(data: Uint8Array, chars?: unknown): Uint8Array {
    const self = pyBytes(data);
    const fn = getAttr(self, "strip") as StripFn;
    if (chars !== undefined) return unwrap<Uint8Array>(fn(self, chars) as ReturnType<typeof pyBytes>);
    return unwrap<Uint8Array>(fn(self) as ReturnType<typeof pyBytes>);
  }

  function lstrip(data: Uint8Array, chars?: unknown): Uint8Array {
    const self = pyBytes(data);
    const fn = getAttr(self, "lstrip") as StripFn;
    if (chars !== undefined) return unwrap<Uint8Array>(fn(self, chars) as ReturnType<typeof pyBytes>);
    return unwrap<Uint8Array>(fn(self) as ReturnType<typeof pyBytes>);
  }

  function rstrip(data: Uint8Array, chars?: unknown): Uint8Array {
    const self = pyBytes(data);
    const fn = getAttr(self, "rstrip") as StripFn;
    if (chars !== undefined) return unwrap<Uint8Array>(fn(self, chars) as ReturnType<typeof pyBytes>);
    return unwrap<Uint8Array>(fn(self) as ReturnType<typeof pyBytes>);
  }

  const spaced = new Uint8Array([32, 32, 97, 98, 99, 32, 32]);

  it("strips ascii whitespace on both sides", () => {
    expect(Array.from(strip(spaced))).toEqual([97, 98, 99]);
  });

  it("lstrip and rstrip trim one side", () => {
    expect(Array.from(lstrip(spaced))).toEqual([97, 98, 99, 32, 32]);
    expect(Array.from(rstrip(spaced))).toEqual([32, 32, 97, 98, 99]);
  });

  it("strips custom char bytes", () => {
    const data = new Uint8Array([120, 120, 97, 98, 99, 120, 120]);
    expect(Array.from(strip(data, pyBytes(new Uint8Array([120]))))).toEqual([97, 98, 99]);
  });

  it("leaves bytes unchanged for empty chars", () => {
    const data = new Uint8Array([97, 98, 99]);
    expect(Array.from(strip(data, pyBytes(new Uint8Array([]))))).toEqual([97, 98, 99]);
  });

  it("rejects non-bytes chars", () => {
    expect(() => strip(new Uint8Array([97]), pyStr(" "))).toThrow(PyTypeError);
    expect(() => strip(new Uint8Array([97]), pyStr(" "))).toThrow(
      /a bytes-like object is required, not 'str'/,
    );
  });
});
