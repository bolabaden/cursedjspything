/**
 * CPython: bytes.swapcase ASCII case swap.
 */
import { describe, it, expect } from "vitest";
import { PyObject, getAttr, pyBytes, unwrap } from "../../src/index.js";

type SwapcaseFn = (self: PyObject) => unknown;

describe("cpython-derived bytes swapcase", () => {
  function swapcase(data: Uint8Array): unknown {
    const self = pyBytes(data);
    const fn = getAttr(self, "swapcase") as SwapcaseFn;
    return fn(self);
  }

  function asBytes(v: unknown): Uint8Array {
    return unwrap<Uint8Array>(v as PyObject);
  }

  const mixed = new Uint8Array([65, 98, 67, 255, 49]);

  it("swaps ASCII letter case", () => {
    expect(asBytes(swapcase(mixed))).toEqual(
      new Uint8Array([97, 66, 99, 255, 49]),
    );
  });

  it("preserves non-ASCII bytes and digits", () => {
    expect(asBytes(swapcase(new Uint8Array([255, 65, 97])))).toEqual(
      new Uint8Array([255, 97, 65]),
    );
    expect(asBytes(swapcase(new Uint8Array([49, 50, 51])))).toEqual(
      new Uint8Array([49, 50, 51]),
    );
  });

  it("handles empty bytes and double swap", () => {
    expect(asBytes(swapcase(new Uint8Array([])))).toEqual(new Uint8Array([]));
    const once = asBytes(swapcase(mixed));
    expect(asBytes(swapcase(once))).toEqual(mixed);
  });
});
