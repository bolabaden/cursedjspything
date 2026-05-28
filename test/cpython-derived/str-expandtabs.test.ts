/**
 * CPython: str.expandtabs tab expansion.
 */
import { describe, it, expect } from "vitest";
import {
  PyObject,
  getAttr,
  pyInt,
  pyStr,
  unwrap,
} from "../../src/index.js";
import { PyTypeError } from "../../src/runtime/core/errors.js";

type ExpandtabsFn = (self: PyObject, tabsize?: unknown) => unknown;

describe("cpython-derived str expandtabs", () => {
  function expandtabs(text: string, tabsize?: unknown): unknown {
    const self = pyStr(text);
    const fn = getAttr(self, "expandtabs") as ExpandtabsFn;
    if (tabsize !== undefined) return fn(self, tabsize);
    return fn(self);
  }

  function asStr(v: unknown): string {
    return unwrap<string>(v as PyObject);
  }

  it("expands tabs to the next stop with explicit or default tabsize", () => {
    expect(asStr(expandtabs("hello\tworld", pyInt(8)))).toBe("hello   world");
    expect(asStr(expandtabs("x\ty"))).toBe("x       y");
    expect(asStr(expandtabs("\t", pyInt(4)))).toBe("    ");
  });

  it("returns unchanged str when there are no tabs or tabsize is zero", () => {
    expect(asStr(expandtabs("hello", pyInt(8)))).toBe("hello");
    expect(asStr(expandtabs("x\ty", pyInt(0)))).toBe("xy");
  });

  it("counts Unicode code points for tab stops", () => {
    expect(asStr(expandtabs("😀\tx", pyInt(8)))).toBe("😀       x");
  });

  it("rejects non-integer tabsize", () => {
    expect(() => expandtabs("x\ty", pyStr("8"))).toThrow(PyTypeError);
    expect(() => expandtabs("x\ty", pyStr("8"))).toThrow(
      /'str' object cannot be interpreted as an integer/,
    );
  });
});
