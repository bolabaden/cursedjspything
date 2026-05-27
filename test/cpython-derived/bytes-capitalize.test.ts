/**
 * CPython: bytes.capitalize ASCII case conversion.
 */
import { describe, it, expect } from "vitest";
import { PyObject, getAttr, pyBytes, unwrap } from "../../src/index.js";

type CapitalizeFn = (self: PyObject) => unknown;

describe("cpython-derived bytes capitalize", () => {
  function capitalize(data: Uint8Array): unknown {
    const self = pyBytes(data);
    const fn = getAttr(self, "capitalize") as CapitalizeFn;
    return fn(self);
  }

  function asBytes(v: unknown): Uint8Array {
    return unwrap<Uint8Array>(v as PyObject);
  }

  it("uppercases first ASCII letter and lowercases the rest", () => {
    expect(
      asBytes(capitalize(new Uint8Array([104, 101, 108, 108, 111, 32, 87, 79, 82, 76, 68]))),
    ).toEqual(new Uint8Array([72, 101, 108, 108, 111, 32, 119, 111, 114, 108, 100]));
    expect(asBytes(capitalize(new Uint8Array([104, 69, 76, 76, 79])))).toEqual(
      new Uint8Array([72, 101, 108, 108, 111]),
    );
  });

  it("leaves non-letter prefix and non-ASCII bytes unchanged", () => {
    expect(asBytes(capitalize(new Uint8Array([49, 97, 98, 99])))).toEqual(
      new Uint8Array([49, 97, 98, 99]),
    );
    expect(asBytes(capitalize(new Uint8Array([32, 65, 98, 67])))).toEqual(
      new Uint8Array([32, 97, 98, 99]),
    );
    expect(asBytes(capitalize(new Uint8Array([255, 97, 66])))).toEqual(
      new Uint8Array([255, 97, 98]),
    );
  });

  it("handles empty bytes", () => {
    expect(asBytes(capitalize(new Uint8Array([])))).toEqual(new Uint8Array([]));
  });
});
