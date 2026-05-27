/**
 * CPython: bytes.replace non-overlapping subbytes substitution.
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

type ReplaceFn = (
  self: PyObject,
  old: unknown,
  newBytes: unknown,
  count?: unknown,
) => unknown;

describe("cpython-derived bytes replace", () => {
  function replace(
    data: Uint8Array,
    old: unknown,
    newBytes: unknown,
    count?: unknown,
  ): unknown {
    const self = pyBytes(data);
    const fn = getAttr(self, "replace") as ReplaceFn;
    if (count !== undefined) return fn(self, old, newBytes, count);
    return fn(self, old, newBytes);
  }

  function asBytes(v: unknown): Uint8Array {
    return unwrap<Uint8Array>(v as PyObject);
  }

  const abcabc = new Uint8Array([97, 98, 99, 97, 98, 99]);
  const bc = new Uint8Array([98, 99]);
  const x = new Uint8Array([120]);
  const pipe = new Uint8Array([124]);
  const aa = new Uint8Array([97, 97, 97]);
  const empty = new Uint8Array([]);

  it("replaces all or limited occurrences", () => {
    expect(asBytes(replace(abcabc, pyBytes(bc), pyBytes(x)))).toEqual(
      new Uint8Array([97, 120, 97, 120]),
    );
    expect(asBytes(replace(abcabc, pyBytes(bc), pyBytes(x), pyInt(1)))).toEqual(
      new Uint8Array([97, 120, 97, 98, 99]),
    );
    expect(asBytes(replace(abcabc, pyBytes(bc), pyBytes(x), pyInt(0)))).toEqual(
      abcabc,
    );
  });

  it("uses non-overlapping semantics", () => {
    expect(
      asBytes(replace(aa, pyBytes(new Uint8Array([97, 97])), pyBytes(x))),
    ).toEqual(new Uint8Array([120, 97]));
  });

  it("handles empty old bytes insertion", () => {
    expect(asBytes(replace(abcabc, pyBytes(empty), pyBytes(pipe)))).toEqual(
      new Uint8Array([124, 97, 124, 98, 124, 99, 124, 97, 124, 98, 124, 99, 124]),
    );
    expect(asBytes(replace(abcabc, pyBytes(empty), pyBytes(pipe), pyInt(1)))).toEqual(
      new Uint8Array([124, 97, 98, 99, 97, 98, 99]),
    );
    expect(asBytes(replace(abcabc, pyBytes(empty), pyBytes(pipe), pyInt(2)))).toEqual(
      new Uint8Array([124, 97, 124, 98, 99, 97, 98, 99]),
    );
  });

  it("allows empty new bytes to remove matches", () => {
    expect(asBytes(replace(abcabc, pyBytes(bc), pyBytes(empty)))).toEqual(
      new Uint8Array([97, 97]),
    );
  });

  it("rejects non-bytes old or new", () => {
    expect(() => replace(abcabc, pyStr("bc"), pyBytes(x))).toThrow(PyTypeError);
    expect(() => replace(abcabc, pyStr("bc"), pyBytes(x))).toThrow(
      /a bytes-like object is required, not 'str'/,
    );
    expect(() => replace(abcabc, pyBytes(bc), pyStr("x"))).toThrow(PyTypeError);
  });
});
