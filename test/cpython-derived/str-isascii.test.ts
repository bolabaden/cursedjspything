/**
 * CPython: str.isascii predicate.
 */
import { describe, it, expect } from "vitest";
import { PyObject, getAttr, pyFalse, pyStr, pyTrue, unwrap } from "../../src/index.js";

type PredicateFn = (self: PyObject) => unknown;

describe("cpython-derived str isascii", () => {
  function isascii(text: string): boolean {
    const self = pyStr(text);
    const fn = getAttr(self, "isascii") as PredicateFn;
    return unwrap<boolean>(fn(self) as PyObject);
  }

  it("is true for ASCII and empty, false for non-ASCII", () => {
    expect(isascii("")).toBe(true);
    expect(isascii("hello")).toBe(true);
    expect(isascii("\u007f")).toBe(true);
    expect(isascii("café")).toBe(false);
    expect(isascii("\u0080")).toBe(false);
  });

  it("returns bool singletons", () => {
    const hello = pyStr("hello");
    const fn = getAttr(hello, "isascii") as PredicateFn;
    expect(fn(hello)).toBe(pyTrue);
    const nonAscii = pyStr("café");
    const isasciiFn = getAttr(nonAscii, "isascii") as PredicateFn;
    expect(isasciiFn(nonAscii)).toBe(pyFalse);
  });
});
