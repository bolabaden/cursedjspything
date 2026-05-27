/**
 * CPython: bytes.index / bytes.rindex substring search.
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
import { PyTypeError, PyValueError } from "../../src/runtime/core/errors.js";

type IndexFn = (
  self: PyObject,
  sub: unknown,
  start?: unknown,
  end?: unknown,
) => unknown;

describe("cpython-derived bytes index rindex", () => {
  function index(
    data: Uint8Array,
    sub: unknown,
    start?: unknown,
    end?: unknown,
  ): unknown {
    const self = pyBytes(data);
    const fn = getAttr(self, "index") as IndexFn;
    if (end !== undefined) return fn(self, sub, start, end);
    if (start !== undefined) return fn(self, sub, start);
    return fn(self, sub);
  }

  function rindex(
    data: Uint8Array,
    sub: unknown,
    start?: unknown,
    end?: unknown,
  ): unknown {
    const self = pyBytes(data);
    const fn = getAttr(self, "rindex") as IndexFn;
    if (end !== undefined) return fn(self, sub, start, end);
    if (start !== undefined) return fn(self, sub, start);
    return fn(self, sub);
  }

  function asInt(v: unknown): number {
    return unwrap<number>(v as PyObject);
  }

  const abcabc = new Uint8Array([97, 98, 99, 97, 98, 99]);
  const bc = new Uint8Array([98, 99]);

  it("indexes subbytes forward and backward", () => {
    expect(asInt(index(abcabc, pyBytes(bc)))).toBe(1);
    expect(asInt(rindex(abcabc, pyBytes(bc)))).toBe(4);
  });

  it("raises ValueError when subbytes is missing", () => {
    const missing = pyBytes(new Uint8Array([120]));
    expect(() => index(abcabc, missing)).toThrow(PyValueError);
    expect(() => index(abcabc, missing)).toThrow(/subsection not found/);
    expect(() => rindex(abcabc, missing)).toThrow(PyValueError);
    expect(() => rindex(abcabc, missing)).toThrow(/subsection not found/);
  });

  it("respects start and end bounds", () => {
    expect(asInt(index(abcabc, pyBytes(bc), pyInt(0), pyInt(4)))).toBe(1);
    expect(asInt(rindex(abcabc, pyBytes(bc), pyInt(0), pyInt(4)))).toBe(1);
    expect(() => rindex(abcabc, pyBytes(bc), pyInt(0), pyInt(2))).toThrow(
      PyValueError,
    );
    expect(() => index(abcabc, pyBytes(bc), pyInt(0), pyInt(2))).toThrow(
      PyValueError,
    );
  });

  it("handles empty subbytes like find/rfind", () => {
    expect(asInt(index(abcabc, pyBytes(new Uint8Array([]))))).toBe(0);
    expect(asInt(rindex(abcabc, pyBytes(new Uint8Array([]))))).toBe(6);
    expect(
      asInt(rindex(abcabc, pyBytes(new Uint8Array([])), pyInt(0), pyInt(3))),
    ).toBe(3);
  });

  it("rejects non-bytes sub", () => {
    expect(() => index(abcabc, pyStr("bc"))).toThrow(PyTypeError);
    expect(() => index(abcabc, pyStr("bc"))).toThrow(
      /argument should be integer or bytes-like object, not 'str'/,
    );
  });
});
