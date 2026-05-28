/**
 * CPython: str.startswith / str.endswith prefix and suffix checks.
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

describe("cpython-derived str startswith endswith", () => {
  function startswith(
    text: string,
    prefix: unknown,
    start?: unknown,
    end?: unknown,
  ): unknown {
    const self = pyStr(text);
    const fn = getAttr(self, "startswith") as AffixFn;
    if (end !== undefined) return fn(self, prefix, start, end);
    if (start !== undefined) return fn(self, prefix, start);
    return fn(self, prefix);
  }

  function endswith(
    text: string,
    suffix: unknown,
    start?: unknown,
    end?: unknown,
  ): unknown {
    const self = pyStr(text);
    const fn = getAttr(self, "endswith") as AffixFn;
    if (end !== undefined) return fn(self, suffix, start, end);
    if (start !== undefined) return fn(self, suffix, start);
    return fn(self, suffix);
  }

  function asBool(v: unknown): boolean {
    return unwrap<boolean>(v as PyObject);
  }

  it("detects prefix and suffix", () => {
    expect(startswith("hello", pyStr("he"))).toBe(pyTrue);
    expect(endswith("hello", pyStr("lo"))).toBe(pyTrue);
    expect(startswith("hello", pyStr("o"))).toBe(pyFalse);
    expect(endswith("hello", pyStr("h"))).toBe(pyFalse);
  });

  it("accepts tuple of str prefixes", () => {
    const prefixes = pyTuple([pyStr("xx"), pyStr("he")]);
    expect(startswith("hello", prefixes)).toBe(pyTrue);
    expect(endswith("hello", prefixes)).toBe(pyFalse);
  });

  it("respects start offset", () => {
    expect(startswith("hello", pyStr("he"), pyInt(1))).toBe(pyFalse);
    expect(endswith("hello", pyStr("lo"), pyInt(0), pyInt(4))).toBe(pyFalse);
  });

  it("respects start and end bounds", () => {
    expect(startswith("hello", pyStr("he"), pyInt(0), pyInt(2))).toBe(pyTrue);
    expect(asBool(startswith("hello", pyStr("el"), pyInt(1), pyInt(4)))).toBe(
      true,
    );
  });

  it("matches empty affix", () => {
    expect(startswith("hello", pyStr(""))).toBe(pyTrue);
    expect(endswith("hello", pyStr(""))).toBe(pyTrue);
  });

  it("matches Unicode affixes", () => {
    expect(startswith("café", pyStr("caf"))).toBe(pyTrue);
    expect(endswith("café", pyStr("fé"))).toBe(pyTrue);
  });

  it("rejects non-str prefix", () => {
    expect(() => startswith("hello", pyBytes(new Uint8Array([104, 101])))).toThrow(
      PyTypeError,
    );
    expect(() => startswith("hello", pyBytes(new Uint8Array([104, 101])))).toThrow(
      /startswith first arg must be str or a tuple of str, not bytes/,
    );
  });

  it("rejects tuple with non-str element", () => {
    const bad = pyTuple([pyStr("a"), pyBytes(new Uint8Array([98]))]);
    expect(() => startswith("hello", bad)).toThrow(PyTypeError);
    expect(() => startswith("hello", bad)).toThrow(/must be str, not bytes/);
  });
});
