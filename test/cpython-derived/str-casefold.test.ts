/**
 * CPython: str.casefold returns a casefolded copy for caseless matching.
 */
import { describe, it, expect } from "vitest";
import { PyObject, getAttr, pyStr, strType, unwrap } from "../../src/index.js";

type CasefoldFn = (self: PyObject) => unknown;

describe("cpython-derived str casefold", () => {
  function casefold(text: string): unknown {
    const self = pyStr(text);
    const fn = getAttr(self, "casefold") as CasefoldFn;
    return fn(self);
  }

  function asStr(v: unknown): string {
    expect((v as PyObject).type).toBe(strType);
    return unwrap<string>(v as PyObject);
  }

  it("folds ASCII and mixed case", () => {
    expect(asStr(casefold("hello"))).toBe("hello");
    expect(asStr(casefold("hELlo"))).toBe("hello");
  });

  it("folds eszett and fi ligature", () => {
    expect(asStr(casefold("ß"))).toBe("ss");
    expect(asStr(casefold("ﬁ"))).toBe("fi");
  });

  it("folds Greek sigma samples", () => {
    expect(asStr(casefold("\u03a3"))).toBe("\u03c3");
    expect(asStr(casefold("A\u0345\u03a3"))).toBe("a\u03b9\u03c3");
  });

  it("folds micro sign to mu", () => {
    expect(asStr(casefold("\u00b5"))).toBe("\u03bc");
  });

  it("handles empty string", () => {
    expect(asStr(casefold(""))).toBe("");
  });
});
