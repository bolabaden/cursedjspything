/**
 * CPython: float.hex and float.fromhex.
 */
import { describe, it, expect } from "vitest";
import {
  PyObject,
  floatType,
  getAttr,
  pyFloat,
  pyInt,
  pyStr,
  strType,
  unwrap,
} from "../../src/index.js";
import { floatFromHex, floatToHex } from "../../src/runtime/builtins/float.js";
import {
  PyOverflowError,
  PyTypeError,
  PyValueError,
} from "../../src/runtime/core/errors.js";

describe("cpython-derived float hex fromhex", () => {
  type FromhexFn = (cls: unknown, arg: unknown) => PyObject;

  function hexValue(v: number): string {
    const self = pyFloat(v);
    const fn = getAttr(self, "hex") as (self: PyObject) => PyObject;
    const result = fn(self);
    expect(result.type).toBe(strType);
    return unwrap(result);
  }

  function fromhex(s: string): number {
    const fn = floatType.typeDict.get("fromhex") as FromhexFn;
    return unwrap(fn(floatType, pyStr(s)));
  }

  it("hex matches CPython for specials and representative finite values", () => {
    expect(hexValue(3.14)).toBe("0x1.91eb851eb851fp+1");
    expect(hexValue(-3.14)).toBe("-0x1.91eb851eb851fp+1");
    expect(hexValue(0)).toBe("0x0.0p+0");
    expect(hexValue(-0)).toBe("-0x0.0p+0");
    expect(hexValue(1)).toBe("0x1.0000000000000p+0");
    expect(hexValue(0.1)).toBe("0x1.999999999999ap-4");
    expect(hexValue(Number.POSITIVE_INFINITY)).toBe("inf");
    expect(hexValue(Number.NEGATIVE_INFINITY)).toBe("-inf");
    expect(hexValue(Number.NaN)).toBe("nan");
    expect(hexValue(5e-324)).toBe("0x0.0000000000001p-1022");
    expect(hexValue(2.2250738585072014e-308)).toBe("0x1.0000000000000p-1022");
    expect(hexValue(Number.MAX_VALUE)).toBe("0x1.fffffffffffffp+1023");
  });

  it("fromhex round-trips hex() output", () => {
    const values = [
      3.14,
      -3.14,
      0,
      -0,
      1,
      0.1,
      5e-324,
      2.2250738585072014e-308,
      Number.MAX_VALUE,
      Number.MIN_VALUE,
    ];
    for (const v of values) {
      const h = floatToHex(v);
      const back = floatFromHex(h);
      if (Number.isNaN(v)) {
        expect(Number.isNaN(back)).toBe(true);
      } else {
        expect(back).toBe(v);
      }
    }
  });

  it("fromhex parses inf, nan, and permissive hex literals", () => {
    expect(fromhex("inf")).toBe(Number.POSITIVE_INFINITY);
    expect(fromhex("-INF")).toBe(Number.NEGATIVE_INFINITY);
    expect(fromhex("nan")).toBeNaN();
    expect(fromhex("0x1.91eb851eb851fp+1")).toBeCloseTo(3.14, 15);
    expect(fromhex("abc")).toBe(2748);
    expect(fromhex("0x1p4")).toBe(16);
    expect(fromhex("0x1.8p3")).toBe(12);
  });

  it("fromhex rejects empty and invalid strings", () => {
    expect(() => fromhex("")).toThrow(PyValueError);
    expect(() => fromhex("")).toThrow(/invalid hexadecimal floating-point string/);
    expect(() => fromhex("hello")).toThrow(PyValueError);
    expect(() => fromhex("0x1.zzp0")).toThrow(PyValueError);
  });

  it("fromhex raises OverflowError for values too large to represent", () => {
    for (const s of ["1p9999", "0x1p+1024", "-0x1p+1024"]) {
      expect(() => fromhex(s)).toThrow(PyOverflowError);
      expect(() => fromhex(s)).toThrow(
        /hexadecimal value too large to represent as a float/,
      );
    }
  });

  it("fromhex rejects non-str arguments", () => {
    const fn = floatType.typeDict.get("fromhex") as FromhexFn;
    expect(() => fn(floatType, pyInt(1))).toThrow(PyTypeError);
    expect(() => fn(floatType, pyInt(1))).toThrow(/bad argument type for built-in operation/);
  });
});
