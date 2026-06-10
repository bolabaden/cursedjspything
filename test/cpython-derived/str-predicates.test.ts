/**
 * CPython: str Unicode predicate methods.
 */
import { describe, it, expect } from "vitest";
import {
  PyObject,
  getAttr,
  pyFalse,
  pyStr,
  pyTrue,
  unwrap,
} from "../../src/index.js";

type PredicateFn = (self: PyObject) => unknown;

describe("cpython-derived str predicates", () => {
  function call(text: string, name: string): boolean {
    const self = pyStr(text);
    const fn = getAttr(self, name) as PredicateFn;
    const result = fn(self);
    return unwrap<boolean>(result as PyObject);
  }

  it("classifies alpha, digit, and alnum", () => {
    expect(call("abc", "isalpha")).toBe(true);
    expect(call("abc", "isdigit")).toBe(false);
    expect(call("abc", "isalnum")).toBe(true);
    expect(call("123", "isdigit")).toBe(true);
    expect(call("123", "isalpha")).toBe(false);
    expect(call("a1", "isalpha")).toBe(false);
    expect(call("a1", "isalnum")).toBe(true);
    expect(call("", "isalpha")).toBe(false);
    expect(call("café", "isalpha")).toBe(true);
  });

  it("classifies lower, upper, and title case", () => {
    expect(call("abc", "islower")).toBe(true);
    expect(call("abc", "isupper")).toBe(false);
    expect(call("ABC", "isupper")).toBe(true);
    expect(call("ABC", "islower")).toBe(false);
    expect(call("a1", "islower")).toBe(true);
    expect(call("Hello World", "istitle")).toBe(true);
    expect(call("hello world", "istitle")).toBe(false);
    expect(call("", "islower")).toBe(false);
    expect(call("123", "istitle")).toBe(false);
  });

  it("classifies whitespace", () => {
    expect(call(" \t\n\r", "isspace")).toBe(true);
    expect(call("abc", "isspace")).toBe(false);
    expect(call("", "isspace")).toBe(false);
  });

  it("returns bool singletons", () => {
    const self = pyStr("abc");
    const isalpha = getAttr(self, "isalpha") as PredicateFn;
    const isdigit = getAttr(self, "isdigit") as PredicateFn;
    expect(isalpha(self)).toBe(pyTrue);
    expect(isdigit(self)).toBe(pyFalse);
  });

  it("classifies identifiers (PEP 3131 + leading underscore)", () => {
    expect(call("hello", "isidentifier")).toBe(true);
    expect(call("class", "isidentifier")).toBe(true);
    expect(call("_", "isidentifier")).toBe(true);
    expect(call("x_y", "isidentifier")).toBe(true);
    expect(call("α", "isidentifier")).toBe(true);
    expect(call("3hello", "isidentifier")).toBe(false);
    expect(call("", "isidentifier")).toBe(false);
  });

  it("classifies decimal and numeric strings", () => {
    expect(call("3", "isdecimal")).toBe(true);
    expect(call("³", "isdecimal")).toBe(false);
    expect(call("½", "isdecimal")).toBe(false);
    expect(call("", "isdecimal")).toBe(false);

    expect(call("3", "isnumeric")).toBe(true);
    expect(call("³", "isnumeric")).toBe(true);
    expect(call("½", "isnumeric")).toBe(true);
    expect(call("Ⅷ", "isnumeric")).toBe(true);
    expect(call("a", "isnumeric")).toBe(false);
    expect(call("", "isnumeric")).toBe(false);
  });

  it("classifies printable strings", () => {
    expect(call("", "isprintable")).toBe(true);
    expect(call("hello", "isprintable")).toBe(true);
    expect(call(" café ", "isprintable")).toBe(true);
    expect(call(" ", "isprintable")).toBe(true);
    expect(call("\n", "isprintable")).toBe(false);
    expect(call("\t", "isprintable")).toBe(false);
    expect(call("\u0007", "isprintable")).toBe(false);
    expect(call("\u200b", "isprintable")).toBe(false);
  });
});
