/**
 * CPython: str.swapcase case inversion.
 */
import { describe, it, expect } from "vitest";
import { PyObject, getAttr, pyStr, strType, unwrap } from "../../src/index.js";

type SwapcaseFn = (self: PyObject) => unknown;

describe("cpython-derived str swapcase", () => {
  function swapcase(text: string): unknown {
    const self = pyStr(text);
    const fn = getAttr(self, "swapcase") as SwapcaseFn;
    return fn(self);
  }

  function asStr(v: unknown): string {
    expect((v as PyObject).type).toBe(strType);
    return unwrap<string>(v as PyObject);
  }

  const mixed = "AbC";

  it("swaps letter case", () => {
    expect(asStr(swapcase(mixed))).toBe("aBc");
  });

  it("preserves non-letters and digits", () => {
    expect(asStr(swapcase("123"))).toBe("123");
    expect(asStr(swapcase("AbC\u00ff49"))).toBe("aBc\u017849");
  });

  it("handles empty string, Unicode, and double swap", () => {
    expect(asStr(swapcase(""))).toBe("");
    expect(asStr(swapcase("café"))).toBe("CAFÉ");
    const once = asStr(swapcase(mixed));
    expect(asStr(swapcase(once))).toBe(mixed);
  });
});
