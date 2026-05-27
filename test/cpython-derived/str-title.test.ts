/**
 * CPython: str.title case conversion.
 */
import { describe, it, expect } from "vitest";
import { PyObject, getAttr, pyStr, strType, unwrap } from "../../src/index.js";

type TitleFn = (self: PyObject) => unknown;

describe("cpython-derived str title", () => {
  function title(text: string): unknown {
    const self = pyStr(text);
    const fn = getAttr(self, "title") as TitleFn;
    return fn(self);
  }

  function asStr(v: unknown): string {
    expect((v as PyObject).type).toBe(strType);
    return unwrap<string>(v as PyObject);
  }

  it("title-cases space- and hyphen-delimited words", () => {
    expect(asStr(title("hello world"))).toBe("Hello World");
    expect(asStr(title("hello-world"))).toBe("Hello-World");
    expect(asStr(title("hello WORLD"))).toBe("Hello World");
  });

  it("starts a new word after digits and other non-letters", () => {
    expect(asStr(title("49abc"))).toBe("49Abc");
    expect(asStr(title("a1b"))).toBe("A1B");
  });

  it("handles empty string and Unicode samples", () => {
    expect(asStr(title(""))).toBe("");
    expect(asStr(title("café WORLD"))).toBe("Café World");
  });
});
