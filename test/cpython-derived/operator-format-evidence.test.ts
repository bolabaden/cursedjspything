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

  it("formats str with empty spec", () => {
    expect(format(pyStr("ab"), "")).toBe("ab");
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

  it("non-empty spec on float raises TypeError", () => {
    expect(() => format(pyFloat(1.0), ".2f")).toThrow(PyTypeError);
    expect(() => format(pyFloat(1.0), ".2f")).toThrow(
      /unsupported format string passed to float\.__format__/,
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
