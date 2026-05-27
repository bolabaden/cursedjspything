/**
 * CPython: str.upper / str.lower case conversion.
 */
import { describe, it, expect } from "vitest";
import { PyObject, getAttr, pyStr, strType, unwrap } from "../../src/index.js";

type CaseFn = (self: PyObject) => unknown;

describe("cpython-derived str upper lower", () => {
  function upper(text: string): unknown {
    const self = pyStr(text);
    const fn = getAttr(self, "upper") as CaseFn;
    return fn(self);
  }

  function lower(text: string): unknown {
    const self = pyStr(text);
    const fn = getAttr(self, "lower") as CaseFn;
    return fn(self);
  }

  function asStr(v: unknown): string {
    expect((v as PyObject).type).toBe(strType);
    return unwrap<string>(v as PyObject);
  }

  it("converts ASCII letters", () => {
    expect(asStr(upper("AbC123"))).toBe("ABC123");
    expect(asStr(lower("AbC123"))).toBe("abc123");
  });

  it("handles empty string", () => {
    expect(asStr(upper(""))).toBe("");
    expect(asStr(lower(""))).toBe("");
  });

  it("matches CPython Unicode case samples", () => {
    expect(asStr(upper("café"))).toBe("CAFÉ");
    expect(asStr(lower("café"))).toBe("café");
    expect(asStr(upper("Σ"))).toBe("Σ");
    expect(asStr(lower("Σ"))).toBe("σ");
    expect(asStr(upper("straße"))).toBe("STRASSE");
    expect(asStr(lower("straße"))).toBe("straße");
  });
});
