/**
 * CPython: str.maketrans / str.translate.
 */
import { describe, it, expect } from "vitest";
import {
  PyObject,
  getAttr,
  pyDict,
  pyInt,
  pyStr,
  strType,
  unwrap,
} from "../../src/index.js";
import { PyTypeError, PyValueError } from "../../src/runtime/core/errors.js";

type MaketransFn = (_cls: unknown, frm: unknown, to: unknown) => unknown;
type TranslateFn = (self: PyObject, table: unknown) => unknown;

describe("cpython-derived str translate", () => {
  function maketrans(frm: string, to: string): Record<number, number> {
    const fn = strType.typeDict.get("maketrans") as MaketransFn;
    const table = fn(strType, pyStr(frm), pyStr(to)) as PyObject;
    const m = unwrap<Map<unknown, PyObject>>(table);
    const out: Record<number, number> = {};
    for (const [k, v] of m) {
      out[unwrap<number>(k as PyObject)] = unwrap<number>(v);
    }
    return out;
  }

  function translate(text: string, table: PyObject): string {
    const self = pyStr(text);
    const fn = getAttr(self, "translate") as TranslateFn;
    return unwrap<string>(fn(self, table) as PyObject);
  }

  it("maketrans builds a dict and translate applies it", () => {
    const mapping = maketrans("ab", "12");
    expect(mapping[97]).toBe(49);
    expect(mapping[98]).toBe(50);
    const table = pyDict([
      [pyInt(97), pyInt(49)],
      [pyInt(98), pyInt(50)],
    ]);
    expect(translate("abc", table)).toBe("12c");
  });

  it("translate with empty maketrans leaves str unchanged", () => {
    const fn = strType.typeDict.get("maketrans") as MaketransFn;
    const table = fn(strType, pyStr(""), pyStr("")) as PyObject;
    expect(translate("abc", table)).toBe("abc");
    expect(translate("", table)).toBe("");
  });

  it("pairs Unicode code points in maketrans", () => {
    const mapping = maketrans("é", "e");
    expect(mapping[0xe9]).toBe(0x65);
    const table = pyDict([[pyInt(0xe9), pyInt(0x65)]]);
    expect(translate("café", table)).toBe("cafe");
  });

  it("raises ValueError on length mismatch", () => {
    expect(() => maketrans("a", "bc")).toThrow(PyValueError);
    expect(() => maketrans("a", "bc")).toThrow(/equal length/);
  });

  it("raises TypeError on non-str maketrans operands or non-dict table", () => {
    const fn = strType.typeDict.get("maketrans") as MaketransFn;
    expect(() => fn(strType, pyInt(1), pyStr("a"))).toThrow(PyTypeError);
    const self = pyStr("abc");
    const tr = getAttr(self, "translate") as TranslateFn;
    expect(() => tr(self, pyInt(1))).toThrow(PyTypeError);
    expect(() => tr(self, pyStr("x"))).toThrow(/must be dict, not str/);
  });
});
