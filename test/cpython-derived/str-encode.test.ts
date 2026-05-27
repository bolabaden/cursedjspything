/**
 * CPython: str.encode returns bytes with encoding and errors handling.
 */
import { describe, it, expect } from "vitest";
import {
  PyObject,
  bytesType,
  getAttr,
  pyInt,
  pyStr,
  unwrap,
} from "../../src/index.js";
import {
  PyLookupError,
  PyTypeError,
  PyUnicodeEncodeError,
  PyValueError,
} from "../../src/runtime/core/errors.js";

type EncodeFn = (self: PyObject, encoding?: unknown, errors?: unknown) => unknown;

describe("cpython-derived str encode", () => {
  function encodeMethod(s: PyObject): EncodeFn {
    return getAttr(s, "encode") as EncodeFn;
  }

  function encoded(
    text: string,
    encoding?: ReturnType<typeof pyStr>,
    errors?: ReturnType<typeof pyStr>,
  ): unknown {
    const s = pyStr(text);
    const encodeFn = encodeMethod(s);
    if (encoding === undefined) return encodeFn(s);
    if (errors === undefined) return encodeFn(s, encoding);
    return encodeFn(s, encoding, errors);
  }

  function asBytes(v: unknown): Uint8Array {
    return unwrap<Uint8Array>(v as PyObject);
  }

  it("encode default utf-8", () => {
    const out = encoded("ab");
    expect((out as PyObject).type).toBe(bytesType);
    expect(Array.from(asBytes(out))).toEqual([97, 98]);
  });

  it("ascii strict rejects non-ascii", () => {
    expect(() => encoded("caf\u00e9", pyStr("ascii"))).toThrow(
      PyUnicodeEncodeError,
    );
    expect(() => encoded("caf\u00e9", pyStr("ascii"))).toThrow(
      /ordinal not in range\(128\)/,
    );
  });

  it("ascii replace substitutes question mark", () => {
    const out = encoded("caf\u00e9", pyStr("ascii"), pyStr("replace"));
    expect(Array.from(asBytes(out))).toEqual([99, 97, 102, 63]);
  });

  it("ascii ignore omits non-ascii", () => {
    const out = encoded("a\u00e9b", pyStr("ascii"), pyStr("ignore"));
    expect(Array.from(asBytes(out))).toEqual([97, 98]);
  });

  it("latin-1 strict rejects code points above 255", () => {
    expect(() => encoded("\u0100", pyStr("latin-1"))).toThrow(
      PyUnicodeEncodeError,
    );
  });

  it("unknown encoding raises LookupError", () => {
    expect(() => encoded("x", pyStr("nope"))).toThrow(PyLookupError);
  });

  it("unknown errors handler raises ValueError", () => {
    expect(() => encoded("x", pyStr("ascii"), pyStr("nope"))).toThrow(
      PyValueError,
    );
  });

  it("non-str encoding raises TypeError", () => {
    const s = pyStr("ab");
    const encodeFn = encodeMethod(s);
    expect(() => encodeFn(s, pyInt(1))).toThrow(PyTypeError);
  });
});
