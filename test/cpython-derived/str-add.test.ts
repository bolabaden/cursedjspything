/**
 * CPython: str __add__ concatenates same-type strings (plan 638).
 */
import { describe, it, expect } from "vitest";
import { add, eq, pyStr, unwrap } from "../../src/index.js";

describe("str __add__", () => {
  it("str + str returns concatenated string", () => {
    const a = pyStr("ab");
    const b = pyStr("cd");
    const result = add(a, b) as ReturnType<typeof pyStr>;
    expect(unwrap<string>(result)).toBe("abcd");
    expect(eq(result, pyStr("abcd"))).toBe(true);
    expect(result).not.toBe(a);
    expect(result).not.toBe(b);
  });

  it("empty str concatenation", () => {
    expect(unwrap<string>(add(pyStr(""), pyStr("x")) as ReturnType<typeof pyStr>)).toBe(
      "x",
    );
    expect(unwrap<string>(add(pyStr("x"), pyStr("")) as ReturnType<typeof pyStr>)).toBe(
      "x",
    );
    expect(unwrap<string>(add(pyStr(""), pyStr("")) as ReturnType<typeof pyStr>)).toBe(
      "",
    );
  });
});
