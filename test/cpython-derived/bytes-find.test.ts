/**
 * CPython: bytes.find / bytes.rfind substring search.
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

type FindFn = (
  self: PyObject,
  sub: unknown,
  start?: unknown,
  end?: unknown,
) => unknown;

describe("cpython-derived bytes find rfind", () => {
  function find(
    data: Uint8Array,
    sub: unknown,
    start?: unknown,
    end?: unknown,
  ): unknown {
    const self = pyBytes(data);
    const fn = getAttr(self, "find") as FindFn;
    if (end !== undefined) return fn(self, sub, start, end);
    if (start !== undefined) return fn(self, sub, start);
    return fn(self, sub);
  }

  function rfind(
    data: Uint8Array,
    sub: unknown,
    start?: unknown,
    end?: unknown,
  ): unknown {
    const self = pyBytes(data);
    const fn = getAttr(self, "rfind") as FindFn;
    if (end !== undefined) return fn(self, sub, start, end);
    if (start !== undefined) return fn(self, sub, start);
    return fn(self, sub);
  }

  function asInt(v: unknown): number {
    return unwrap<number>(v as PyObject);
  }

  const abcabc = new Uint8Array([97, 98, 99, 97, 98, 99]);
  const bc = new Uint8Array([98, 99]);

  it("finds subbytes forward and backward", () => {
    expect(asInt(find(abcabc, pyBytes(bc)))).toBe(1);
    expect(asInt(rfind(abcabc, pyBytes(bc)))).toBe(4);
  });

  it("returns -1 when subbytes is missing", () => {
    expect(asInt(find(abcabc, pyBytes(new Uint8Array([120]))))).toBe(-1);
    expect(asInt(rfind(abcabc, pyBytes(new Uint8Array([120]))))).toBe(-1);
  });

  it("respects start and end bounds", () => {
    expect(asInt(find(abcabc, pyBytes(bc), pyInt(0), pyInt(4)))).toBe(1);
    expect(asInt(rfind(abcabc, pyBytes(bc), pyInt(0), pyInt(4)))).toBe(1);
    expect(asInt(rfind(abcabc, pyBytes(bc), pyInt(0), pyInt(2)))).toBe(-1);
  });

  it("handles empty subbytes like CPython", () => {
    expect(asInt(find(abcabc, pyBytes(new Uint8Array([]))))).toBe(0);
    expect(asInt(find(abcabc, pyBytes(new Uint8Array([])), pyInt(2)))).toBe(2);
    expect(asInt(rfind(abcabc, pyBytes(new Uint8Array([]))))).toBe(6);
    expect(
      asInt(rfind(abcabc, pyBytes(new Uint8Array([])), pyInt(0), pyInt(3))),
    ).toBe(3);
    expect(
      asInt(rfind(abcabc, pyBytes(new Uint8Array([])), pyInt(0), pyInt(1))),
    ).toBe(1);
    expect(
      asInt(rfind(abcabc, pyBytes(new Uint8Array([])), pyInt(0), pyInt(0))),
    ).toBe(0);
  });

  it("rejects non-bytes sub", () => {
    expect(() => find(abcabc, pyStr("bc"))).toThrow(PyTypeError);
    expect(() => find(abcabc, pyStr("bc"))).toThrow(
      /argument should be integer or bytes-like object, not 'str'/,
    );
  });
});
