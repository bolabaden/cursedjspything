/**
 * CPython: str.capitalize case conversion.
 */
import { describe, it, expect } from "vitest";
import { PyObject, getAttr, pyStr, strType, unwrap } from "../../src/index.js";

type CapitalizeFn = (self: PyObject) => unknown;

describe("cpython-derived str capitalize", () => {
  function capitalize(text: string): unknown {
    const self = pyStr(text);
    const fn = getAttr(self, "capitalize") as CapitalizeFn;
    return fn(self);
  }

  function asStr(v: unknown): string {
    expect((v as PyObject).type).toBe(strType);
    return unwrap<string>(v as PyObject);
  }

  it("uppercases first character and lowercases the rest", () => {
    expect(asStr(capitalize("hello WORLD"))).toBe("Hello world");
    expect(asStr(capitalize("hELLO"))).toBe("Hello");
  });

  it("leaves leading non-letters unchanged", () => {
    expect(asStr(capitalize("49abc"))).toBe("49abc");
    expect(asStr(capitalize(" abc"))).toBe(" abc");
  });

  it("handles empty string and Unicode samples", () => {
    expect(asStr(capitalize(""))).toBe("");
    expect(asStr(capitalize("café WORLD"))).toBe("Café world");
  });
});
