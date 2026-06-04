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

  it("encodes empty str to empty bytes", () => {
    expect(Array.from(asBytes(encoded("")))).toEqual([]);
    expect(Array.from(asBytes(encoded("", pyStr("utf-8"))))).toEqual([]);
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

  it("surrogateescape round-trips U+DC80–U+DCFF", () => {
    expect(Array.from(asBytes(encoded("\udc80", pyStr("ascii"), pyStr("surrogateescape"))))).toEqual(
      [128],
    );
    expect(Array.from(asBytes(encoded("\udcff", pyStr("utf-8"), pyStr("surrogateescape"))))).toEqual(
      [255],
    );
    expect(Array.from(asBytes(encoded("\udc80", pyStr("latin-1"), pyStr("surrogateescape"))))).toEqual(
      [128],
    );
  });

  it("surrogateescape encode rejects U+DC00 on utf-8", () => {
    expect(() => encoded("\udc00", pyStr("utf-8"), pyStr("surrogateescape"))).toThrow(
      PyUnicodeEncodeError,
    );
    expect(() => encoded("\udc00", pyStr("utf-8"), pyStr("surrogateescape"))).toThrow(
      /surrogates not allowed/,
    );
  });

  it("backslashreplace escapes non-encodable code points", () => {
    expect(Array.from(asBytes(encoded("caf\u00e9", pyStr("ascii"), pyStr("backslashreplace"))))).toEqual(
      [99, 97, 102, 92, 120, 101, 57],
    );
    expect(
      Array.from(asBytes(encoded("\u0100", pyStr("latin-1"), pyStr("backslashreplace")))),
    ).toEqual([92, 117, 48, 49, 48, 48]);
  });

  it("latin-1 strict rejects code points above 255", () => {
    expect(() => encoded("\u0100", pyStr("latin-1"))).toThrow(
      PyUnicodeEncodeError,
    );
  });

  it("unknown encoding raises LookupError", () => {
    expect(() => encoded("x", pyStr("nope"))).toThrow(PyLookupError);
    expect(() => encoded("x", pyStr("nope"))).toThrow(/unknown encoding: nope/);
  });

  it("unknown errors handler raises ValueError", () => {
    expect(() => encoded("x", pyStr("ascii"), pyStr("nope"))).toThrow(
      PyValueError,
    );
    expect(() => encoded("x", pyStr("ascii"), pyStr("nope"))).toThrow(
      /unknown errors handler: 'nope'/,
    );
  });

  it("non-str encoding raises TypeError", () => {
    const s = pyStr("ab");
    const encodeFn = encodeMethod(s);
    expect(() => encodeFn(s, pyInt(1))).toThrow(PyTypeError);
    expect(() => encodeFn(s, pyInt(1))).toThrow(
      /encode\(\) argument 'encoding' must be str, not int/,
    );
  });

  it("non-str errors raises TypeError", () => {
    const s = pyStr("ab");
    const encodeFn = encodeMethod(s);
    expect(() => encodeFn(s, pyStr("utf-8"), pyInt(1))).toThrow(PyTypeError);
    expect(() => encodeFn(s, pyStr("utf-8"), pyInt(1))).toThrow(
      /encode\(\) argument 'errors' must be str, not int/,
    );
  });
});
