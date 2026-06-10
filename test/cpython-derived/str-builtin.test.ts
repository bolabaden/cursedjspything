/**
 * CPython: builtin str constructor.
 */
import { describe, it, expect } from "vitest";
import {
  pyBytes,
  pyInt,
  pyStr,
  str,
  strType,
  unwrap,
} from "../../src/index.js";
import { PyTypeError } from "../../src/runtime/core/errors.js";

describe("cpython-derived str builtin", () => {
  it("str() returns empty str", () => {
    const s = str();
    expect(s.type).toBe(strType);
    expect(unwrap(s)).toBe("");
  });

  it("str(obj) uses __str__ / repr fallback", () => {
    expect(unwrap(str(pyInt(65)))).toBe("65");
    expect(unwrap(str(pyStr("hello")))).toBe("hello");
    expect(unwrap(str(pyBytes(new Uint8Array([104, 105]))))).toBe("b'hi'");
  });

  it("rejects encoding form until decode slice lands", () => {
    expect(() => str(pyInt(1), pyInt(2))).toThrow(PyTypeError);
    expect(() => str(pyInt(1), pyInt(2))).toThrow(
      /argument 'encoding' must be str, not int/,
    );
  });
});
