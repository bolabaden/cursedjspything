/**
 * CPython: str.format / str.format_map field replacement.
 */
import { describe, it, expect } from "vitest";
import {
  PyObject,
  getAttr,
  instantiate,
  makeClass,
  objectType,
  pyDict,
  pyInt,
  pyList,
  pyStr,
  strType,
  unwrap,
} from "../../src/index.js";
import { Slot } from "../../src/runtime/core/slots.js";
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

  it("resolves attribute chains on positional and mapping roots", () => {
    const AttrBox = makeClass({
      name: "FormatAttrBox",
      bases: [objectType],
      dict: new Map<string | symbol, unknown>([
        [
          Slot.init,
          (self: PyObject, year: PyObject, label: PyObject) => {
            self.dict.set("year", year);
            self.dict.set("label", label);
          },
        ],
      ]),
    });
    const box = instantiate(AttrBox, pyInt(2007), pyStr("pyrt"));

    expect(asStr(format("The year is {0.year}", box))).toBe("The year is 2007");
    expect(asStr(format("{0.label}", box))).toBe("pyrt");

    const Wrapper = makeClass({
      name: "FormatAttrWrapper",
      bases: [objectType],
      dict: new Map<string | symbol, unknown>([
        [
          Slot.init,
          (self: PyObject, inner: PyObject) => {
            self.dict.set("_x", inner);
          },
        ],
      ]),
    });
    const wrapped = instantiate(Wrapper, pyInt(20));
    const mapping = pyDict([[pyStr("foo"), wrapped]]);
    expect(asStr(formatMap("{foo._x}", mapping))).toBe("20");
  });

  it("resolves bracket subscript chains", () => {
    const mapping = pyDict([[pyStr("name"), pyStr("Fred")]]);
    expect(asStr(format("My name is {0[name]}", mapping))).toBe("My name is Fred");

    const items = pyList([pyStr("abc"), pyStr("def")]);
    expect(asStr(format("{0[0]}", items))).toBe("abc");

    const nested = pyList([pyStr("abc"), pyList([pyStr("def")])]);
    expect(asStr(format("{0[1][0]}", nested))).toBe("def");
  });

  it("raises ValueError for invalid dotted field names", () => {
    expect(() => format("{0.}", pyInt(1))).toThrow(PyValueError);
    expect(() => format("{.name}", pyInt(1))).toThrow(PyValueError);
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
