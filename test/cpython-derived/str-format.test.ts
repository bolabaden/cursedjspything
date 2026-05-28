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
  pyFloat,
  pyInt,
  pyList,
  pyTuple,
  pyStr,
  pyTrue,
  pyBytes,
  pyNone,
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
import { FormatKeywordMapping } from "../../src/runtime/builtins/str-format.js";

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

  it("formats named fields via kwargs wrapper", () => {
    const kwargs = new FormatKeywordMapping(
      pyDict([[pyStr("name"), pyStr("Fred")]]),
    );
    expect(asStr(format("My name is {name}", kwargs))).toBe("My name is Fred");
  });

  it("formats mixed positional and kwargs fields", () => {
    const kwargs = new FormatKeywordMapping(
      pyDict([[pyStr("name"), pyStr("b")]]),
    );
    expect(asStr(format("{0} {name}", pyStr("a"), kwargs))).toBe("a b");
    expect(asStr(format("{} {name}", pyStr("a"), kwargs))).toBe("a b");
  });

  it("raises KeyError for missing kwargs keys", () => {
    const kwargs = new FormatKeywordMapping(pyDict([]));
    expect(() => format("{missing}", kwargs)).toThrow(PyKeyError);
  });

  it("rejects non-mapping FormatKeywordMapping payload", () => {
    expect(() => new FormatKeywordMapping({} as PyObject)).toThrow(PyTypeError);
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

  it("resolves arbitrary string bracket keys", () => {
    const mapping = pyDict([
      [pyStr("a-b"), pyStr("hyphen")],
      [pyStr("space test"), pyStr("spaced")],
      [pyStr("-1"), pyStr("neg")],
    ]);
    expect(asStr(format("{0[a-b]}", mapping))).toBe("hyphen");
    expect(asStr(format("{0[space test]}", mapping))).toBe("spaced");
    expect(asStr(format("{0[-1]}", mapping))).toBe("neg");
  });

  it("rejects empty bracket keys and string keys on lists", () => {
    expect(() => format("{0[]}", pyDict([]))).toThrow(PyValueError);
    expect(() => format("{0[-1]}", pyList([pyInt(1)]))).toThrow(PyTypeError);
  });

  it("raises ValueError for invalid dotted field names", () => {
    expect(() => format("{0.}", pyInt(1))).toThrow(PyValueError);
    expect(() => format("{.name}", pyInt(1))).toThrow(PyValueError);
  });

  it("formats nested format_spec fields", () => {
    expect(asStr(format("{0:{1}}", pyStr("hello"), pyInt(10)))).toBe(
      "hello     ",
    );
    expect(asStr(format("{0:.{1}f}", pyFloat(1.5), pyInt(2)))).toBe("1.50");
    expect(asStr(format("{:{}}", pyStr("x"), pyInt(3)))).toBe("x  ");

    const mapping = pyDict([
      [pyStr("name"), pyStr("hi")],
      [pyStr("width"), pyInt(5)],
    ]);
    expect(asStr(formatMap("{name:{width}}", mapping))).toBe("hi   ");
  });

  it("uses ascii conversion on non-ASCII str", () => {
    expect(asStr(format("{0!a}", pyStr("hello")))).toBe("'hello'");
    expect(asStr(format("{0!a}", pyStr("caf\u00e9")))).toBe("'caf\\xe9'");
    expect(asStr(format("{0!a}", pyStr("\u1234")))).toBe("'\\u1234'");
    expect(asStr(format("{0!a}", pyInt(42)))).toBe("42");
    expect(asStr(format("{0!a}", pyList([])))).toBe("[]");
    expect(() => format("{0!x}", pyStr("x"))).toThrow(PyValueError);
  });

  it("applies format_spec after conversion flags", () => {
    expect(asStr(format("{0!r:10}", pyList([])))).toBe("[]        ");
    expect(asStr(format("{0!s:10}", pyStr("hi")))).toBe("hi        ");
    expect(asStr(format("{0!a:10}", pyStr("caf\u00e9")))).toBe("'caf\\xe9' ");
    expect(asStr(format("{0!r:>10}", pyList([])))).toBe("        []");
    expect(asStr(format("{0!r:<10}", pyList([])))).toBe("[]        ");
  });

  it("formats bool and bytes fields via __format__", () => {
    expect(asStr(format("{0:10}", pyTrue))).toBe("         1");
    expect(asStr(format("{0}", pyBytes(new Uint8Array([104, 105]))))).toBe("b'hi'");
    expect(() =>
      format("{0:10}", pyBytes(new Uint8Array([104, 105]))),
    ).toThrow(PyTypeError);
    expect(() =>
      format("{0:10}", pyBytes(new Uint8Array([104, 105]))),
    ).toThrow(/unsupported format string passed to bytes\.__format__/);
  });

  it("formats None fields via __format__", () => {
    expect(asStr(format("{0}", pyNone))).toBe("None");
    expect(() => format("{0:10}", pyNone)).toThrow(PyTypeError);
    expect(() => format("{0:10}", pyNone)).toThrow(
      /unsupported format string passed to NoneType\.__format__/,
    );
  });

  it("formats list fields via __format__", () => {
    expect(asStr(format("{0}", pyList([pyInt(1), pyInt(2)])))).toBe("[1, 2]");
    expect(() => format("{0:10}", pyList([]))).toThrow(PyTypeError);
    expect(() => format("{0:10}", pyList([]))).toThrow(
      /unsupported format string passed to list\.__format__/,
    );
  });

  it("formats tuple fields via __format__", () => {
    expect(asStr(format("{0}", pyTuple([pyInt(1)])))).toBe("(1,)");
    expect(asStr(format("{0}", pyTuple([pyInt(1), pyInt(2)])))).toBe("(1, 2)");
    expect(() => format("{0:10}", pyTuple([]))).toThrow(PyTypeError);
    expect(() => format("{0:10}", pyTuple([]))).toThrow(
      /unsupported format string passed to tuple\.__format__/,
    );
  });

  it("formats dict fields via __format__", () => {
    expect(asStr(format("{0}", pyDict([[pyStr("a"), pyInt(1)]])))).toBe("{'a': 1}");
    expect(() => format("{0:10}", pyDict([]))).toThrow(PyTypeError);
    expect(() => format("{0:10}", pyDict([]))).toThrow(
      /unsupported format string passed to dict\.__format__/,
    );
  });

  it("uses repr conversion and int format spec", () => {
    expect(asStr(format("{0!r}", pyList([])))).toBe("[]");
    expect(asStr(format("{0:x}", pyInt(255)))).toBe("ff");
    expect(asStr(format("{:04d}", pyInt(1)))).toBe("0001");
    expect(asStr(format("{0:04x}", pyInt(255)))).toBe("00ff");
    expect(asStr(format("{:+04d}", pyInt(1)))).toBe("+001");
    expect(asStr(format("{: d}", pyInt(1)))).toBe(" 1");
    expect(asStr(format("{:.2f}", pyInt(1)))).toBe("1.00");
    expect(asStr(format("{:10.2f}", pyInt(1)))).toBe("      1.00");
    expect(asStr(format("{:.3g}", pyInt(999999)))).toBe("1e+06");
    expect(asStr(format("{:.2%}", pyInt(255)))).toBe("25500.00%");
    expect(asStr(format("{:12g}", pyInt(1000000)))).toBe("       1e+06");
    expect(asStr(format("{:<10}", pyStr("hello")))).toBe("hello     ");
    expect(asStr(format("{:*^10}", pyStr("hello")))).toBe("**hello***");
    expect(asStr(format("{:.3}", pyStr("hello")))).toBe("hel");
    expect(asStr(format("{:.2f}", pyFloat(1.5)))).toBe("1.50");
  });

  it("raises ValueError for invalid int format specs in fields", () => {
    expect(() => format("{:.2}", pyInt(1))).toThrow(PyValueError);
    expect(() => format("{0:s}", pyInt(1))).toThrow(PyValueError);
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
