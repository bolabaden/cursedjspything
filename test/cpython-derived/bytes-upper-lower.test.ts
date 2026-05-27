/**
 * CPython: bytes.upper / bytes.lower ASCII case conversion.
 */
import { describe, it, expect } from "vitest";
import { PyObject, getAttr, pyBytes, unwrap } from "../../src/index.js";

type CaseFn = (self: PyObject) => unknown;

describe("cpython-derived bytes upper lower", () => {
  function upper(data: Uint8Array): unknown {
    const self = pyBytes(data);
    const fn = getAttr(self, "upper") as CaseFn;
    return fn(self);
  }

  function lower(data: Uint8Array): unknown {
    const self = pyBytes(data);
    const fn = getAttr(self, "lower") as CaseFn;
    return fn(self);
  }

  function asBytes(v: unknown): Uint8Array {
    return unwrap<Uint8Array>(v as PyObject);
  }

  const mixed = new Uint8Array([65, 98, 67, 255, 49]);

  it("converts ASCII letters to upper and lower", () => {
    expect(asBytes(upper(mixed))).toEqual(
      new Uint8Array([65, 66, 67, 255, 49]),
    );
    expect(asBytes(lower(mixed))).toEqual(
      new Uint8Array([97, 98, 99, 255, 49]),
    );
  });

  it("leaves already-cased ASCII unchanged on repeat", () => {
    const uppered = new Uint8Array([65, 66, 67]);
    expect(asBytes(upper(uppered))).toEqual(uppered);
    const lowered = new Uint8Array([97, 98, 99]);
    expect(asBytes(lower(lowered))).toEqual(lowered);
  });

  it("handles empty bytes", () => {
    expect(asBytes(upper(new Uint8Array([])))).toEqual(new Uint8Array([]));
    expect(asBytes(lower(new Uint8Array([])))).toEqual(new Uint8Array([]));
  });
});
