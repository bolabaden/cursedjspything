/**
 * CPython: bytes.count non-overlapping subbytes occurrences.
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

type CountFn = (
  self: PyObject,
  sub: unknown,
  start?: unknown,
  end?: unknown,
) => unknown;

describe("cpython-derived bytes count", () => {
  function count(
    data: Uint8Array,
    sub: unknown,
    start?: unknown,
    end?: unknown,
  ): unknown {
    const self = pyBytes(data);
    const fn = getAttr(self, "count") as CountFn;
    if (end !== undefined) return fn(self, sub, start, end);
    if (start !== undefined) return fn(self, sub, start);
    return fn(self, sub);
  }

  function asInt(v: unknown): number {
    return unwrap<number>(v as PyObject);
  }

  const abcabcabc = new Uint8Array([
    97, 98, 99, 97, 98, 99, 97, 98, 99,
  ]);
  const bc = new Uint8Array([98, 99]);
  const aa = new Uint8Array([97, 97, 97]);

  it("counts repeated subbytes", () => {
    expect(asInt(count(abcabcabc, pyBytes(bc)))).toBe(3);
  });

  it("returns zero when subbytes is missing", () => {
    expect(asInt(count(abcabcabc, pyBytes(new Uint8Array([120]))))).toBe(0);
    expect(asInt(count(new Uint8Array(0), pyBytes(new Uint8Array([97]))))).toBe(0);
  });

  it("uses non-overlapping semantics", () => {
    expect(asInt(count(aa, pyBytes(new Uint8Array([97, 97]))))).toBe(1);
  });

  it("respects start and end bounds", () => {
    expect(asInt(count(abcabcabc, pyBytes(bc), pyInt(0), pyInt(6)))).toBe(2);
    expect(asInt(count(abcabcabc, pyBytes(bc), pyInt(1), pyInt(7)))).toBe(2);
  });

  it("handles empty subbytes like CPython", () => {
    expect(asInt(count(abcabcabc, pyBytes(new Uint8Array([]))))).toBe(10);
    expect(asInt(count(new Uint8Array([]), pyBytes(new Uint8Array([]))))).toBe(
      1,
    );
    expect(
      asInt(count(abcabcabc, pyBytes(new Uint8Array([])), pyInt(2), pyInt(1))),
    ).toBe(0);
  });

  it("rejects non-bytes sub", () => {
    expect(() => count(abcabcabc, pyStr("bc"))).toThrow(PyTypeError);
    expect(() => count(abcabcabc, pyStr("bc"))).toThrow(
      /argument should be integer or bytes-like object, not 'str'/,
    );
  });
});
