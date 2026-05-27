/**
 * CPython: bytes.center width padding.
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

type CenterFn = (
  self: PyObject,
  width: unknown,
  fill?: unknown,
) => unknown;

describe("cpython-derived bytes center", () => {
  function center(
    data: Uint8Array,
    width: unknown,
    fill?: unknown,
  ): unknown {
    const self = pyBytes(data);
    const fn = getAttr(self, "center") as CenterFn;
    if (fill !== undefined) return fn(self, width, fill);
    return fn(self, width);
  }

  function asBytes(v: unknown): Uint8Array {
    return unwrap<Uint8Array>(v as PyObject);
  }

  const abc = new Uint8Array([97, 98, 99]);

  it("centers with space or custom fill byte", () => {
    expect(asBytes(center(abc, pyInt(5)))).toEqual(
      new Uint8Array([32, 97, 98, 99, 32]),
    );
    expect(asBytes(center(abc, pyInt(5), pyBytes(new Uint8Array([45]))))).toEqual(
      new Uint8Array([45, 97, 98, 99, 45]),
    );
    expect(asBytes(center(abc, pyInt(7), pyBytes(new Uint8Array([42]))))).toEqual(
      new Uint8Array([42, 42, 97, 98, 99, 42, 42]),
    );
  });

  it("returns original bytes when width is not wider", () => {
    expect(asBytes(center(abc, pyInt(2)))).toEqual(abc);
    expect(asBytes(center(abc, pyInt(0)))).toEqual(abc);
    expect(asBytes(center(abc, pyInt(-1)))).toEqual(abc);
  });

  it("centers empty bytes", () => {
    expect(asBytes(center(new Uint8Array([]), pyInt(5)))).toEqual(
      new Uint8Array([32, 32, 32, 32, 32]),
    );
    expect(
      asBytes(center(new Uint8Array([]), pyInt(3), pyBytes(new Uint8Array([120])))),
    ).toEqual(new Uint8Array([120, 120, 120]));
  });

  it("rejects fill byte string not of length 1", () => {
    expect(() =>
      center(abc, pyInt(5), pyBytes(new Uint8Array([45, 45]))),
    ).toThrow(PyTypeError);
    expect(() =>
      center(abc, pyInt(5), pyBytes(new Uint8Array([45, 45]))),
    ).toThrow(
      /center\(\): argument 2 must be a byte string of length 1, not a bytes object of length 2/,
    );
  });
});
