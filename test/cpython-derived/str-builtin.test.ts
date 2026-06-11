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
import {
  PyTypeError,
  PyUnicodeDecodeError,
} from "../../src/runtime/core/errors.js";

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

  it("str(bytes, encoding) decodes payload", () => {
    expect(unwrap(str(pyBytes(new Uint8Array([104, 101, 108, 108, 111])), pyStr("utf-8")))).toBe(
      "hello",
    );
    expect(unwrap(str(pyBytes(new Uint8Array([255])), pyStr("latin-1")))).toBe("ÿ");
  });

  it("str(bytes, encoding, errors) forwards errors mode", () => {
    expect(
      unwrap(
        str(
          pyBytes(new Uint8Array([255])),
          pyStr("utf-8"),
          pyStr("replace"),
        ),
      ),
    ).toBe("\ufffd");
    expect(() =>
      str(pyBytes(new Uint8Array([255])), pyStr("ascii")),
    ).toThrow(PyUnicodeDecodeError);
  });

  it("rejects decode on non-bytes object", () => {
    expect(() => str(pyStr("a"), pyStr("utf-8"))).toThrow(PyTypeError);
    expect(() => str(pyStr("a"), pyStr("utf-8"))).toThrow(
      /decoding str is not supported/,
    );
    expect(() => str(pyInt(1), pyInt(2))).toThrow(PyTypeError);
    expect(() => str(pyInt(1), pyInt(2))).toThrow(/decoding str is not supported/);
  });

  it("rejects bad encoding and errors types", () => {
    expect(() => str(pyBytes(new Uint8Array([97])), pyInt(1))).toThrow(PyTypeError);
    expect(() => str(pyBytes(new Uint8Array([97])), pyInt(1))).toThrow(
      /argument 'encoding' must be str, not int/,
    );
    expect(() =>
      str(pyBytes(new Uint8Array([97])), pyStr("utf-8"), pyInt(1)),
    ).toThrow(PyTypeError);
    expect(() =>
      str(pyBytes(new Uint8Array([97])), pyStr("utf-8"), pyInt(1)),
    ).toThrow(/argument 'errors' must be str, not int/);
  });

  it("rejects too many arguments", () => {
    expect(() =>
      str(
        pyBytes(new Uint8Array([97])),
        pyStr("utf-8"),
        pyStr("strict"),
        pyStr("x"),
      ),
    ).toThrow(PyTypeError);
    expect(() =>
      str(
        pyBytes(new Uint8Array([97])),
        pyStr("utf-8"),
        pyStr("strict"),
        pyStr("x"),
      ),
    ).toThrow(/expected at most 3 arguments, got 4/);
  });
});
