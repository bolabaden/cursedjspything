/**
 * CPython: format() dispatches __format__; empty spec falls back to str().
 */
import { describe, it, expect } from "vitest";
import {
  format,
  pyFloat,
  pyInt,
  pyList,
  pyStr,
} from "../../src/index.js";
import { PyTypeError, PyValueError } from "../../src/runtime/core/errors.js";

describe("cpython-derived format on builtins with __format__", () => {
  it("formats int with hex spec", () => {
    expect(format(pyInt(255), "x")).toBe("ff");
  });

  it("formats int with zero-padded decimal and hex width", () => {
    expect(format(pyInt(1), "04")).toBe("0001");
    expect(format(pyInt(1), "4")).toBe("   1");
    expect(format(pyInt(255), "04x")).toBe("00ff");
  });

  it("formats int with sign options", () => {
    expect(format(pyInt(1), "+04d")).toBe("+001");
    expect(format(pyInt(-1), "+04d")).toBe("-001");
    expect(format(pyInt(1), "+4d")).toBe("  +1");
    expect(format(pyInt(-1), "+4d")).toBe("  -1");
    expect(format(pyInt(1), " d")).toBe(" 1");
    expect(format(pyInt(-1), " d")).toBe("-1");
    expect(format(pyInt(1), "-04d")).toBe("0001");
    expect(format(pyInt(1), "+04x")).toBe("+001");
    expect(format(pyInt(-1), "+04x")).toBe("-001");
  });

  it("formats int with float presentation specs", () => {
    expect(format(pyInt(1), "f")).toBe("1.000000");
    expect(format(pyInt(-1), "f")).toBe("-1.000000");
    expect(format(pyInt(1), ".2f")).toBe("1.00");
    expect(format(pyInt(1), "10f")).toBe("  1.000000");
    expect(format(pyInt(255), ".2e")).toBe("2.55e+02");
    expect(format(pyInt(1), "+.2f")).toBe("+1.00");
    expect(format(pyInt(-1), "+.2f")).toBe("-1.00");
    expect(() => format(pyInt(1), ".2")).toThrow(PyValueError);
  });

  it("formats int with general and percent presentation specs", () => {
    expect(format(pyInt(1), "g")).toBe("1");
    expect(format(pyInt(255), "g")).toBe("255");
    expect(format(pyInt(1000000), "g")).toBe("1e+06");
    expect(format(pyInt(999999), ".3g")).toBe("1e+06");
    expect(format(pyInt(1234567), ".6g")).toBe("1.23457e+06");
    expect(format(pyInt(1000000), "G")).toBe("1E+06");
    expect(format(pyInt(1), "%")).toBe("100.000000%");
    expect(format(pyInt(255), ".2%")).toBe("25500.00%");
    expect(format(pyInt(-1), ".2%")).toBe("-100.00%");
    expect(format(pyInt(1), "+.2g")).toBe("+1");
    expect(format(pyInt(-1), "+.2g")).toBe("-1");
    expect(format(pyInt(1000000), "+.2g")).toBe("+1e+06");
    expect(format(pyInt(1000000), "12g")).toBe("       1e+06");
  });

  it("formats float with presentation specs", () => {
    expect(format(pyFloat(1.5), "")).toBe("1.5");
    expect(format(pyFloat(1.5), ".2f")).toBe("1.50");
    expect(format(pyFloat(1.5), "10.2f")).toBe("      1.50");
    expect(format(pyFloat(1.5), ".2e")).toBe("1.50e+00");
    expect(format(pyFloat(1.5), "g")).toBe("1.5");
    expect(format(pyFloat(1.5), ".2%")).toBe("150.00%");
    expect(format(pyFloat(-1.5), "+.2f")).toBe("-1.50");
    expect(format(pyFloat(-0), ".2f")).toBe("-0.00");
    expect(format(pyFloat(Number.POSITIVE_INFINITY), ".2f")).toBe("inf");
    expect(format(pyFloat(Number.POSITIVE_INFINITY), "+.2f")).toBe("+inf");
    expect(format(pyFloat(Number.NaN), "g")).toBe("nan");
  });

  it("rejects invalid float format specs", () => {
    expect(() => format(pyFloat(1.5), "d")).toThrow(PyValueError);
    expect(() => format(pyFloat(1.5), "d")).toThrow(
      /Unknown format code 'd' for object of type 'float'/,
    );
  });

  it("formats str with empty spec", () => {
    expect(format(pyStr("ab"), "")).toBe("ab");
  });

  it("formats str with alignment, width, and precision specs", () => {
    expect(format(pyStr("hello"), "<10")).toBe("hello     ");
    expect(format(pyStr("hello"), ">10")).toBe("     hello");
    expect(format(pyStr("hello"), "^10")).toBe("  hello   ");
    expect(format(pyStr("hello"), "*^10")).toBe("**hello***");
    expect(format(pyStr("hello"), ".3")).toBe("hel");
    expect(format(pyStr("hello"), "10.3")).toBe("hel       ");
    expect(format(pyStr("hi"), "010")).toBe("hi00000000");
    expect(format(pyStr("hello"), "10s")).toBe("hello     ");
  });

  it("rejects invalid str format specs", () => {
    expect(() => format(pyStr("hello"), "+10")).toThrow(PyValueError);
    expect(() => format(pyStr("hello"), "+10")).toThrow(
      /Sign not allowed in string format specifier/,
    );
    expect(() => format(pyStr("hello"), "#10")).toThrow(PyValueError);
    expect(() => format(pyStr("hello"), "#10")).toThrow(
      /Alternate form \(#\) not allowed in string format specifier/,
    );
    expect(() => format(pyStr("hello"), "=10")).toThrow(PyValueError);
    expect(() => format(pyStr("hello"), "=10")).toThrow(
      /'=' alignment not allowed in string format specifier/,
    );
    expect(() => format(pyStr("hello"), "x")).toThrow(PyValueError);
    expect(() => format(pyStr("hello"), "x")).toThrow(
      /Unknown format code 'x' for object of type 'str'/,
    );
    expect(() => format(pyStr("hello"), "^")).toThrow(PyValueError);
  });
});

describe("cpython-derived format fallback and errors", () => {
  it("empty spec on type without __format__ uses str()", () => {
    expect(format(pyList([]), "")).toBe("[]");
  });

  it("non-empty spec on list raises TypeError", () => {
    expect(() => format(pyList([]), "s")).toThrow(PyTypeError);
    expect(() => format(pyList([]), "s")).toThrow(
      /unsupported format string passed to list\.__format__/,
    );
  });

  it("invalid int format specs raise ValueError", () => {
    expect(() => format(pyInt(1), ".2")).toThrow(PyValueError);
    expect(() => format(pyInt(1), ".2")).toThrow(
      /Precision not allowed in integer format specifier/,
    );
    expect(() => format(pyInt(1), "s")).toThrow(PyValueError);
    expect(() => format(pyInt(1), "s")).toThrow(
      /Unknown format code 's' for object of type 'int'/,
    );
  });
});
