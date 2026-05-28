/**
 * CPython: str.center width padding.
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

type CenterFn = (
  self: PyObject,
  width: unknown,
  fill?: unknown,
) => unknown;

describe("cpython-derived str center", () => {
  function center(text: string, width: unknown, fill?: unknown): unknown {
    const self = pyStr(text);
    const fn = getAttr(self, "center") as CenterFn;
    if (fill !== undefined) return fn(self, width, fill);
    return fn(self, width);
  }

  function asStr(v: unknown): string {
    return unwrap<string>(v as PyObject);
  }

  it("centers with space or custom fill character", () => {
    expect(asStr(center("abc", pyInt(5)))).toBe(" abc ");
    expect(asStr(center("abc", pyInt(5), pyStr("-")))).toBe("-abc-");
    expect(asStr(center("abc", pyInt(7), pyStr("*")))).toBe("**abc**");
  });

  it("returns original str when width is not wider", () => {
    expect(asStr(center("abc", pyInt(2)))).toBe("abc");
    expect(asStr(center("abc", pyInt(0)))).toBe("abc");
    expect(asStr(center("abc", pyInt(-1)))).toBe("abc");
  });

  it("centers empty str", () => {
    expect(asStr(center("", pyInt(5)))).toBe("     ");
    expect(asStr(center("", pyInt(3), pyStr("x")))).toBe("xxx");
  });

  it("centers by Unicode code-point width", () => {
    expect(asStr(center("😀", pyInt(3)))).toBe(" 😀 ");
    expect(asStr(center("café", pyInt(6)))).toBe(" café ");
  });

  it("rejects fill string not of length 1", () => {
    expect(() => center("abc", pyInt(5), pyStr("--"))).toThrow(PyTypeError);
    expect(() => center("abc", pyInt(5), pyStr("--"))).toThrow(
      /The fill character must be exactly one character long/,
    );
  });

  it("rejects non-str fill", () => {
    expect(() => center("abc", pyInt(5), pyBytes(new Uint8Array([45])))).toThrow(
      PyTypeError,
    );
    expect(() => center("abc", pyInt(5), pyBytes(new Uint8Array([45])))).toThrow(
      /must be str, not bytes/,
    );
  });
});
