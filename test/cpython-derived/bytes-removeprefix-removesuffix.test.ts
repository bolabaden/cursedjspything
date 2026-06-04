/**
 * CPython: bytes.removeprefix / bytes.removesuffix affix stripping.
 */
import { describe, it, expect } from "vitest";
import {
  PyObject,
  getAttr,
  pyBytes,
  pyStr,
  unwrap,
} from "../../src/index.js";
import { PyTypeError } from "../../src/runtime/core/errors.js";

type AffixStripFn = (self: PyObject, affix: unknown) => unknown;

describe("cpython-derived bytes removeprefix removesuffix", () => {
  function removeprefix(data: Uint8Array, prefix: unknown): unknown {
    const self = pyBytes(data);
    const fn = getAttr(self, "removeprefix") as AffixStripFn;
    return fn(self, prefix);
  }

  function removesuffix(data: Uint8Array, suffix: unknown): unknown {
    const self = pyBytes(data);
    const fn = getAttr(self, "removesuffix") as AffixStripFn;
    return fn(self, suffix);
  }

  function asBytes(v: unknown): Uint8Array {
    return unwrap<Uint8Array>(v as PyObject);
  }

  const hello = new Uint8Array([104, 101, 108, 108, 111]);
  const he = pyBytes(new Uint8Array([104, 101]));
  const lo = pyBytes(new Uint8Array([108, 111]));
  const x = pyBytes(new Uint8Array([120]));

  it("strips matching prefix and suffix", () => {
    expect(asBytes(removeprefix(hello, he))).toEqual(
      new Uint8Array([108, 108, 111]),
    );
    expect(asBytes(removesuffix(hello, lo))).toEqual(
      new Uint8Array([104, 101, 108]),
    );
    expect(asBytes(removeprefix(hello, pyBytes(hello)))).toEqual(new Uint8Array([]));
  });

  it("returns original bytes when affix does not match or is empty", () => {
    expect(asBytes(removeprefix(hello, lo))).toEqual(hello);
    expect(asBytes(removesuffix(hello, he))).toEqual(hello);
    expect(asBytes(removeprefix(hello, x))).toEqual(hello);
    expect(asBytes(removeprefix(hello, pyBytes(new Uint8Array([]))))).toEqual(hello);
    expect(asBytes(removesuffix(hello, pyBytes(new Uint8Array([]))))).toEqual(hello);
    expect(asBytes(removeprefix(new Uint8Array([]), pyBytes(new Uint8Array([]))))).toEqual(
      new Uint8Array([]),
    );
    const empty = new Uint8Array(0);
    const a = pyBytes(new Uint8Array([97]));
    expect(asBytes(removeprefix(empty, a))).toEqual(new Uint8Array(0));
    expect(asBytes(removesuffix(empty, a))).toEqual(new Uint8Array(0));
  });

  it("rejects non-bytes affix", () => {
    expect(() => removeprefix(hello, pyStr("he"))).toThrow(PyTypeError);
    expect(() => removeprefix(hello, pyStr("he"))).toThrow(
      /a bytes-like object is required, not 'str'/,
    );
    expect(() => removesuffix(hello, pyStr("lo"))).toThrow(
      /a bytes-like object is required, not 'str'/,
    );
  });
});
