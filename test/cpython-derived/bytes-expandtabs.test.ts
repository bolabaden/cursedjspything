/**
 * CPython: bytes.expandtabs tab expansion.
 */
import { describe, it, expect } from "vitest";
import {
  PyObject,
  getAttr,
  pyBytes,
  pyInt,
  pyStr,
  unwrap,
} from "../../src/index.js";
import { PyTypeError } from "../../src/runtime/core/errors.js";

type ExpandtabsFn = (self: PyObject, tabsize?: unknown) => unknown;

describe("cpython-derived bytes expandtabs", () => {
  function expandtabs(data: Uint8Array, tabsize?: unknown): unknown {
    const self = pyBytes(data);
    const fn = getAttr(self, "expandtabs") as ExpandtabsFn;
    if (tabsize !== undefined) return fn(self, tabsize);
    return fn(self);
  }

  function asBytes(v: unknown): Uint8Array {
    return unwrap<Uint8Array>(v as PyObject);
  }

  const helloWorld = new Uint8Array([104, 101, 108, 108, 111, 9, 119, 111, 114, 108, 100]);
  const xy = new Uint8Array([120, 9, 121]);

  it("expands tabs to the next stop with explicit or default tabsize", () => {
    expect(asBytes(expandtabs(helloWorld, pyInt(8)))).toEqual(
      new Uint8Array([104, 101, 108, 108, 111, 32, 32, 32, 119, 111, 114, 108, 100]),
    );
    expect(asBytes(expandtabs(xy))).toEqual(
      new Uint8Array([120, 32, 32, 32, 32, 32, 32, 32, 121]),
    );
    expect(asBytes(expandtabs(new Uint8Array([9]), pyInt(4)))).toEqual(
      new Uint8Array([32, 32, 32, 32]),
    );
  });

  it("returns unchanged bytes when there are no tabs or tabsize is zero", () => {
    expect(asBytes(expandtabs(new Uint8Array([104, 101, 108, 108, 111]), pyInt(8)))).toEqual(
      new Uint8Array([104, 101, 108, 108, 111]),
    );
    expect(asBytes(expandtabs(xy, pyInt(0)))).toEqual(new Uint8Array([120, 121]));
  });

  it("rejects non-integer tabsize", () => {
    expect(() => expandtabs(xy, pyStr("8"))).toThrow(PyTypeError);
    expect(() => expandtabs(xy, pyStr("8"))).toThrow(
      /'str' object cannot be interpreted as an integer/,
    );
  });
});
