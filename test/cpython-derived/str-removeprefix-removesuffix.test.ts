/**
 * CPython: str.removeprefix / str.removesuffix affix stripping.
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

describe("cpython-derived str removeprefix removesuffix", () => {
  function removeprefix(text: string, prefix: unknown): unknown {
    const self = pyStr(text);
    const fn = getAttr(self, "removeprefix") as AffixStripFn;
    return fn(self, prefix);
  }

  function removesuffix(text: string, suffix: unknown): unknown {
    const self = pyStr(text);
    const fn = getAttr(self, "removesuffix") as AffixStripFn;
    return fn(self, suffix);
  }

  function asStr(v: unknown): string {
    return unwrap<string>(v as PyObject);
  }

  it("strips matching prefix and suffix", () => {
    expect(asStr(removeprefix("hello", pyStr("he")))).toBe("llo");
    expect(asStr(removesuffix("hello", pyStr("lo")))).toBe("hel");
    expect(asStr(removeprefix("hello", pyStr("hello")))).toBe("");
  });

  it("returns original str when affix does not match or is empty", () => {
    expect(asStr(removeprefix("hello", pyStr("lo")))).toBe("hello");
    expect(asStr(removesuffix("hello", pyStr("he")))).toBe("hello");
    expect(asStr(removeprefix("hello", pyStr("x")))).toBe("hello");
    expect(asStr(removeprefix("hello", pyStr("")))).toBe("hello");
    expect(asStr(removesuffix("hello", pyStr("")))).toBe("hello");
    expect(asStr(removeprefix("", pyStr("")))).toBe("");
    expect(asStr(removeprefix("", pyStr("a")))).toBe("");
    expect(asStr(removesuffix("", pyStr("a")))).toBe("");
  });

  it("strips Unicode affixes", () => {
    expect(asStr(removeprefix("café", pyStr("caf")))).toBe("é");
    expect(asStr(removesuffix("café", pyStr("fé")))).toBe("ca");
  });

  it("rejects non-str affix", () => {
    expect(() => removeprefix("hello", pyBytes(new Uint8Array([104, 101])))).toThrow(
      PyTypeError,
    );
    expect(() => removeprefix("hello", pyBytes(new Uint8Array([104, 101])))).toThrow(
      /must be str, not bytes/,
    );
    expect(() => removesuffix("hello", pyBytes(new Uint8Array([108, 111])))).toThrow(
      /must be str, not bytes/,
    );
  });
});
