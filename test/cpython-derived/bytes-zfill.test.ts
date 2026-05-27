/**
 * CPython: bytes.zfill width zero-padding.
 */
import { describe, it, expect } from "vitest";
import {
  PyObject,
  getAttr,
  pyBytes,
  pyInt,
  unwrap,
} from "../../src/index.js";

type ZfillFn = (self: PyObject, width: unknown) => unknown;

describe("cpython-derived bytes zfill", () => {
  function zfill(data: Uint8Array, width: unknown): unknown {
    const self = pyBytes(data);
    const fn = getAttr(self, "zfill") as ZfillFn;
    return fn(self, width);
  }

  function asBytes(v: unknown): Uint8Array {
    return unwrap<Uint8Array>(v as PyObject);
  }

  const abc = new Uint8Array([97, 98, 99]);
  const fortyTwo = new Uint8Array([52, 50]);
  const minusFortyTwo = new Uint8Array([45, 52, 50]);
  const plusFortyTwo = new Uint8Array([43, 52, 50]);

  it("zero-pads unsigned bytes and empty bytes", () => {
    expect(asBytes(zfill(abc, pyInt(5)))).toEqual(
      new Uint8Array([48, 48, 97, 98, 99]),
    );
    expect(asBytes(zfill(fortyTwo, pyInt(5)))).toEqual(
      new Uint8Array([48, 48, 48, 52, 50]),
    );
    expect(asBytes(zfill(new Uint8Array(0), pyInt(5)))).toEqual(
      new Uint8Array([48, 48, 48, 48, 48]),
    );
  });

  it("preserves sign and pads zeros after it", () => {
    expect(asBytes(zfill(minusFortyTwo, pyInt(5)))).toEqual(
      new Uint8Array([45, 48, 48, 52, 50]),
    );
    expect(asBytes(zfill(plusFortyTwo, pyInt(5)))).toEqual(
      new Uint8Array([43, 48, 48, 52, 50]),
    );
    expect(asBytes(zfill(new Uint8Array([45]), pyInt(3)))).toEqual(
      new Uint8Array([45, 48, 48]),
    );
    expect(asBytes(zfill(new Uint8Array([43]), pyInt(3)))).toEqual(
      new Uint8Array([43, 48, 48]),
    );
  });

  it("returns original bytes when width is not wider", () => {
    expect(asBytes(zfill(abc, pyInt(2)))).toEqual(abc);
    expect(asBytes(zfill(minusFortyTwo, pyInt(3)))).toEqual(minusFortyTwo);
  });
});
