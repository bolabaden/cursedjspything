/**
 * CPython: bytes.decode returns str; UTF-8 default and latin-1 identity.
 */
import { describe, it, expect } from "vitest";
import {
  PyObject,
  bytes,
  pyBytes,
  pyInt,
  pyStr,
  strType,
  unwrap,
  getAttr,
} from "../../src/index.js";
import {
  PyLookupError,
  PyTypeError,
  PyUnicodeDecodeError,
} from "../../src/runtime/core/errors.js";

type DecodeFn = (self: PyObject, encoding?: unknown) => unknown;

describe("cpython-derived bytes decode", () => {
  function decodeMethod(b: PyObject): DecodeFn {
    return getAttr(b, "decode") as DecodeFn;
  }

  function decoded(data: Uint8Array, encoding?: ReturnType<typeof pyStr>): unknown {
    const b = pyBytes(data);
    const decodeFn = decodeMethod(b);
    return encoding === undefined ? decodeFn(b) : decodeFn(b, encoding);
  }

  it("decode default utf-8", () => {
    const s = decoded(new Uint8Array([104, 101, 108, 108, 111]));
    expect((s as ReturnType<typeof pyStr>).type).toBe(strType);
    expect(unwrap<string>(s as ReturnType<typeof pyStr>)).toBe("hello");
  });

  it("decode explicit utf-8", () => {
    const s = decoded(new Uint8Array([97, 98]), pyStr("utf-8"));
    expect(unwrap<string>(s as ReturnType<typeof pyStr>)).toBe("ab");
  });

  it("decode latin-1 maps bytes to code points", () => {
    const s = decoded(new Uint8Array([255]), pyStr("latin-1"));
    expect(unwrap<string>(s as ReturnType<typeof pyStr>)).toBe("\xff");
  });

  it("invalid utf-8 raises UnicodeDecodeError", () => {
    expect(() => decoded(new Uint8Array([255]))).toThrow(PyUnicodeDecodeError);
    expect(() => decoded(new Uint8Array([255]))).toThrow(
      /invalid start byte/,
    );
  });

  it("unknown encoding raises LookupError", () => {
    expect(() => decoded(new Uint8Array([120]), pyStr("nope"))).toThrow(
      PyLookupError,
    );
    expect(() => decoded(new Uint8Array([120]), pyStr("nope"))).toThrow(
      /unknown encoding: nope/,
    );
  });

  it("non-str encoding raises TypeError", () => {
    const b = bytes(pyStr("ab")) as PyObject;
    const decodeFn = decodeMethod(b);
    expect(() => decodeFn(b, pyInt(1))).toThrow(PyTypeError);
    expect(() => decodeFn(b, pyInt(1))).toThrow(/encoding' must be str, not int/);
  });
});
