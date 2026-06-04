/**
 * CPython: str.ljust / str.rjust width padding.
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

type PadFn = (
  self: PyObject,
  width: unknown,
  fill?: unknown,
) => unknown;

describe("cpython-derived str ljust rjust", () => {
  function ljust(text: string, width: unknown, fill?: unknown): unknown {
    const self = pyStr(text);
    const fn = getAttr(self, "ljust") as PadFn;
    if (fill !== undefined) return fn(self, width, fill);
    return fn(self, width);
  }

  function rjust(text: string, width: unknown, fill?: unknown): unknown {
    const self = pyStr(text);
    const fn = getAttr(self, "rjust") as PadFn;
    if (fill !== undefined) return fn(self, width, fill);
    return fn(self, width);
  }

  function asStr(v: unknown): string {
    return unwrap<string>(v as PyObject);
  }

  it("pads left and right with space or custom fill", () => {
    expect(asStr(ljust("abc", pyInt(5)))).toBe("abc  ");
    expect(asStr(rjust("abc", pyInt(5)))).toBe("  abc");
    expect(asStr(ljust("abc", pyInt(5), pyStr("-")))).toBe("abc--");
    expect(asStr(rjust("abc", pyInt(5), pyStr("-")))).toBe("--abc");
  });

  it("returns original str when width is not wider", () => {
    expect(asStr(ljust("abc", pyInt(2)))).toBe("abc");
    expect(asStr(ljust("abc", pyInt(0)))).toBe("abc");
    expect(asStr(ljust("", pyInt(0)))).toBe("");
    expect(asStr(rjust("abc", pyInt(0)))).toBe("abc");
    expect(asStr(rjust("", pyInt(0)))).toBe("");
    expect(asStr(rjust("", pyInt(0), pyStr("x")))).toBe("");
  });

  it("pads by Unicode code-point width", () => {
    expect(asStr(ljust("😀", pyInt(3)))).toBe("😀  ");
    expect(asStr(rjust("café", pyInt(6)))).toBe("  café");
  });

  it("rejects fill string not of length 1", () => {
    expect(() => ljust("abc", pyInt(5), pyStr("--"))).toThrow(PyTypeError);
    expect(() => ljust("abc", pyInt(5), pyStr("--"))).toThrow(
      /The fill character must be exactly one character long/,
    );
    expect(() => rjust("abc", pyInt(5), pyStr("--"))).toThrow(
      /The fill character must be exactly one character long/,
    );
  });

  it("rejects non-str fill", () => {
    expect(() => ljust("abc", pyInt(5), pyBytes(new Uint8Array([45])))).toThrow(
      PyTypeError,
    );
    expect(() => ljust("abc", pyInt(5), pyBytes(new Uint8Array([45])))).toThrow(
      /must be str, not bytes/,
    );
  });
});
