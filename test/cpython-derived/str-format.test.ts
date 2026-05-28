/**
 * CPython: str.format / str.format_map field replacement.
 */
import { describe, it, expect } from "vitest";
import {
  PyObject,
  getAttr,
  pyDict,
  pyInt,
  pyList,
  pyStr,
  strType,
  unwrap,
} from "../../src/index.js";
import {
  PyIndexError,
  PyKeyError,
  PyTypeError,
  PyValueError,
} from "../../src/runtime/core/errors.js";

type FormatFn = (self: PyObject, ...args: unknown[]) => unknown;
type FormatMapFn = (self: PyObject, mapping: unknown) => unknown;

describe("cpython-derived str format", () => {
  function format(text: string, ...args: unknown[]): unknown {
    const self = pyStr(text);
    const fn = getAttr(self, "format") as FormatFn;
    return fn(self, ...args);
  }

  function formatMap(text: string, mapping: unknown): unknown {
    const self = pyStr(text);
    const fn = getAttr(self, "format_map") as FormatMapFn;
    return fn(self, mapping);
  }

  function asStr(v: unknown): string {
    expect((v as PyObject).type).toBe(strType);
    return unwrap<string>(v as PyObject);
  }

  it("handles literals and brace escaping", () => {
    expect(asStr(format(""))).toBe("");
    expect(asStr(format("a"))).toBe("a");
    expect(asStr(format("a{{"))).toBe("a{");
    expect(asStr(format("a}}"))).toBe("a}");
    expect(asStr(format("a{{b"))).toBe("a{b");
    expect(asStr(formatMap("a{{b", pyDict([])))).toBe("a{b");
  });

  it("formats positional and auto-numbered fields", () => {
    expect(asStr(format("My name is {0}", pyStr("Fred")))).toBe("My name is Fred");
    expect(asStr(format("My name is {0} :-{{}}", pyStr("Fred")))).toBe(
      "My name is Fred :-{}",
    );
    expect(asStr(format("{} {}", pyInt(1), pyInt(2)))).toBe("1 2");
  });

  it("formats via format_map with named keys", () => {
    const mapping = pyDict([
      [pyStr("hello"), pyStr("world")],
      [pyStr("a"), pyStr("hi")],
    ]);
    expect(asStr(formatMap("{hello}", mapping))).toBe("world");
    expect(asStr(formatMap("{a} there", mapping))).toBe("hi there");
  });

  it("uses repr conversion and int format spec", () => {
    expect(asStr(format("{0!r}", pyList([])))).toBe("[]");
    expect(asStr(format("{0:x}", pyInt(255)))).toBe("ff");
  });

  it("raises on malformed format strings", () => {
    expect(() => format("{")).toThrow(PyValueError);
    expect(() => format("}")).toThrow(PyValueError);
    expect(() => format("a{")).toThrow(PyValueError);
  });

  it("raises KeyError for missing mapping keys", () => {
    expect(() => formatMap("{missing}", pyDict([]))).toThrow(PyKeyError);
  });

  it("raises IndexError for out-of-range positional index", () => {
    expect(() => format("{1}", pyStr("only"))).toThrow(PyIndexError);
  });

  it("rejects format_map without mapping", () => {
    const self = pyStr("x");
    const fn = getAttr(self, "format_map") as FormatMapFn;
    expect(() => fn(self)).toThrow(PyTypeError);
    expect(() => fn(self)).toThrow(/takes exactly one argument/);
  });

  it("rejects auto fields in format_map", () => {
    expect(() => formatMap("{}", pyDict([[pyStr("a"), pyInt(2)]]))).toThrow(
      PyValueError,
    );
  });
});
