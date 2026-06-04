/**
 * CPython: str.splitlines splits on Unicode line breaks.
 */
import { describe, it, expect } from "vitest";
import {
  PyObject,
  getAttr,
  pyInt,
  pyStr,
  pyTrue,
  unwrap,
} from "../../src/index.js";
import { PyTypeError } from "../../src/runtime/core/errors.js";

type SplitlinesFn = (self: PyObject, keepends?: unknown) => unknown;

describe("cpython-derived str splitlines", () => {
  function splitlines(text: string, keepends?: unknown): unknown {
    const self = pyStr(text);
    const fn = getAttr(self, "splitlines") as SplitlinesFn;
    if (keepends !== undefined) return fn(self, keepends);
    return fn(self);
  }

  function asStrList(v: unknown): string[] {
    const items = unwrap<PyObject[]>(v as PyObject);
    return items.map((item) => unwrap<string>(item));
  }

  it("splits on newline and crlf", () => {
    expect(asStrList(splitlines("a\nb\r\nc"))).toEqual(["a", "b", "c"]);
  });

  it("keeps line breaks when keepends is true", () => {
    expect(asStrList(splitlines("a\nb\r\nc\r\n", pyTrue))).toEqual([
      "a\n",
      "b\r\n",
      "c\r\n",
    ]);
  });

  it("returns empty list for empty string", () => {
    expect(asStrList(splitlines(""))).toEqual([]);
  });

  it("treats lone newline as empty line", () => {
    expect(asStrList(splitlines("\n"))).toEqual([""]);
    expect(asStrList(splitlines("\n", pyTrue))).toEqual(["\n"]);
  });

  it("splits consecutive newlines into empty segments", () => {
    expect(asStrList(splitlines("a\n\n"))).toEqual(["a", ""]);
  });

  it("returns single segment when no line breaks", () => {
    expect(asStrList(splitlines("abc"))).toEqual(["abc"]);
  });

  it("splits on Unicode line separator", () => {
    expect(asStrList(splitlines("a\u2028b"))).toEqual(["a", "b"]);
  });

  it("splits on vertical tab and form feed", () => {
    expect(asStrList(splitlines("a\x0bb"))).toEqual(["a", "b"]);
    expect(asStrList(splitlines("a\x0cb"))).toEqual(["a", "b"]);
  });

  it("splits on Unicode paragraph separator", () => {
    expect(asStrList(splitlines("a\u2029b"))).toEqual(["a", "b"]);
  });

  it("rejects non-bool keepends", () => {
    expect(() => splitlines("a", pyInt(1))).toThrow(PyTypeError);
    expect(() => splitlines("a", pyInt(1))).toThrow(
      /splitlines\(\) argument must be bool, not int/,
    );
  });
});
