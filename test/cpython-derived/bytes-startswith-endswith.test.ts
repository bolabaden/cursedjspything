/**
 * CPython: bytes.startswith / bytes.endswith prefix and suffix checks.
 */
import { describe, it, expect } from "vitest";
import {
  PyObject,
  getAttr,
  pyBytes,
  pyInt,
  pyStr,
  pyTuple,
  pyTrue,
  pyFalse,
  unwrap,
} from "../../src/index.js";
import { PyTypeError } from "../../src/runtime/core/errors.js";

type AffixFn = (
  self: PyObject,
  affix: unknown,
  start?: unknown,
  end?: unknown,
) => unknown;

describe("cpython-derived bytes startswith endswith", () => {
  function startswith(
    data: Uint8Array,
    prefix: unknown,
    start?: unknown,
    end?: unknown,
  ): unknown {
    const self = pyBytes(data);
    const fn = getAttr(self, "startswith") as AffixFn;
    if (end !== undefined) return fn(self, prefix, start, end);
    if (start !== undefined) return fn(self, prefix, start);
    return fn(self, prefix);
  }

  function endswith(
    data: Uint8Array,
    suffix: unknown,
    start?: unknown,
    end?: unknown,
  ): unknown {
    const self = pyBytes(data);
    const fn = getAttr(self, "endswith") as AffixFn;
    if (end !== undefined) return fn(self, suffix, start, end);
    if (start !== undefined) return fn(self, suffix, start);
    return fn(self, suffix);
  }

  function asBool(v: unknown): boolean {
    return unwrap<boolean>(v as PyObject);
  }

  const hello = new Uint8Array([104, 101, 108, 108, 111]);

  it("detects prefix and suffix", () => {
    expect(startswith(hello, pyBytes(new Uint8Array([104, 101])))).toBe(pyTrue);
    expect(endswith(hello, pyBytes(new Uint8Array([108, 111])))).toBe(pyTrue);
    expect(startswith(hello, pyBytes(new Uint8Array([111])))).toBe(pyFalse);
    expect(endswith(hello, pyBytes(new Uint8Array([104])))).toBe(pyFalse);
  });

  it("accepts tuple of bytes prefixes", () => {
    const prefixes = pyTuple([
      pyBytes(new Uint8Array([120, 120])),
      pyBytes(new Uint8Array([104, 101])),
    ]);
    expect(startswith(hello, prefixes)).toBe(pyTrue);
    expect(endswith(hello, prefixes)).toBe(pyFalse);
  });

  it("respects start offset", () => {
    expect(startswith(hello, pyBytes(new Uint8Array([104, 101])), pyInt(1))).toBe(
      pyFalse,
    );
    expect(endswith(hello, pyBytes(new Uint8Array([108, 111])), pyInt(0), pyInt(4))).toBe(
      pyFalse,
    );
  });

  it("respects start and end bounds", () => {
    expect(
      startswith(hello, pyBytes(new Uint8Array([104, 101])), pyInt(0), pyInt(2)),
    ).toBe(pyTrue);
    expect(asBool(startswith(hello, pyBytes(new Uint8Array([101, 108])), pyInt(1), pyInt(4)))).toBe(
      true,
    );
  });

  it("matches empty affix", () => {
    expect(startswith(hello, pyBytes(new Uint8Array([])))).toBe(pyTrue);
    expect(endswith(hello, pyBytes(new Uint8Array([])))).toBe(pyTrue);
  });

  it("rejects non-bytes prefix", () => {
    expect(() => startswith(hello, pyStr("he"))).toThrow(PyTypeError);
    expect(() => startswith(hello, pyStr("he"))).toThrow(
      /startswith first arg must be bytes or a tuple of bytes, not str/,
    );
  });

  it("rejects tuple with non-bytes element", () => {
    const bad = pyTuple([pyBytes(new Uint8Array([97])), pyStr("b")]);
    expect(() => startswith(hello, bad)).toThrow(PyTypeError);
    expect(() => startswith(hello, bad)).toThrow(
      /a bytes-like object is required, not 'str'/,
    );
  });
});
