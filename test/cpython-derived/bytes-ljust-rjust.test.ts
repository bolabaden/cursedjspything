/**
 * CPython: bytes.ljust / bytes.rjust width padding.
 */
import { describe, it, expect } from "vitest";
import {
  PyObject,
  getAttr,
  pyBytes,
  pyInt,
  unwrap,
} from "../../src/index.js";
import { PyTypeError } from "../../src/runtime/core/errors.js";

type PadFn = (
  self: PyObject,
  width: unknown,
  fill?: unknown,
) => unknown;

describe("cpython-derived bytes ljust rjust", () => {
  function ljust(
    data: Uint8Array,
    width: unknown,
    fill?: unknown,
  ): unknown {
    const self = pyBytes(data);
    const fn = getAttr(self, "ljust") as PadFn;
    if (fill !== undefined) return fn(self, width, fill);
    return fn(self, width);
  }

  function rjust(
    data: Uint8Array,
    width: unknown,
    fill?: unknown,
  ): unknown {
    const self = pyBytes(data);
    const fn = getAttr(self, "rjust") as PadFn;
    if (fill !== undefined) return fn(self, width, fill);
    return fn(self, width);
  }

  function asBytes(v: unknown): Uint8Array {
    return unwrap<Uint8Array>(v as PyObject);
  }

  const abc = new Uint8Array([97, 98, 99]);
  const dash = pyBytes(new Uint8Array([45]));

  it("pads left and right with space or custom fill", () => {
    expect(asBytes(ljust(abc, pyInt(5)))).toEqual(
      new Uint8Array([97, 98, 99, 32, 32]),
    );
    expect(asBytes(rjust(abc, pyInt(5)))).toEqual(
      new Uint8Array([32, 32, 97, 98, 99]),
    );
    expect(asBytes(ljust(abc, pyInt(5), dash))).toEqual(
      new Uint8Array([97, 98, 99, 45, 45]),
    );
    expect(asBytes(rjust(abc, pyInt(5), dash))).toEqual(
      new Uint8Array([45, 45, 97, 98, 99]),
    );
  });

  it("returns original bytes when width is not wider", () => {
    expect(asBytes(ljust(abc, pyInt(2)))).toEqual(abc);
    expect(asBytes(rjust(abc, pyInt(0)))).toEqual(abc);
  });

  it("rejects fill byte string not of length 1", () => {
    const bad = pyBytes(new Uint8Array([45, 45]));
    expect(() => ljust(abc, pyInt(5), bad)).toThrow(PyTypeError);
    expect(() => ljust(abc, pyInt(5), bad)).toThrow(
      /ljust\(\): argument 2 must be a byte string of length 1, not a bytes object of length 2/,
    );
    expect(() => rjust(abc, pyInt(5), bad)).toThrow(
      /rjust\(\): argument 2 must be a byte string of length 1, not a bytes object of length 2/,
    );
  });
});
