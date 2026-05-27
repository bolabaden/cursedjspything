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
  PyValueError,
} from "../../src/runtime/core/errors.js";

type DecodeFn = (self: PyObject, encoding?: unknown, errors?: unknown) => unknown;

describe("cpython-derived bytes decode", () => {
  function decodeMethod(b: PyObject): DecodeFn {
    return getAttr(b, "decode") as DecodeFn;
  }

  function decoded(
    data: Uint8Array,
    encoding?: ReturnType<typeof pyStr>,
    errors?: ReturnType<typeof pyStr>,
  ): unknown {
    const b = pyBytes(data);
    const decodeFn = decodeMethod(b);
    if (encoding === undefined) return decodeFn(b);
    if (errors === undefined) return decodeFn(b, encoding);
    return decodeFn(b, encoding, errors);
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

  it("decode ascii strict, replace, and ignore", () => {
    expect(unwrap<string>(decoded(new Uint8Array([104, 105]), pyStr("ascii")) as ReturnType<typeof pyStr>)).toBe("hi");
    expect(() => decoded(new Uint8Array([255]), pyStr("ascii"))).toThrow(PyUnicodeDecodeError);
    expect(() => decoded(new Uint8Array([255]), pyStr("ascii"))).toThrow(
      /ordinal not in range\(128\)/,
    );
    expect(
      unwrap<string>(
        decoded(new Uint8Array([255]), pyStr("ascii"), pyStr("replace")) as ReturnType<typeof pyStr>,
      ),
    ).toBe("\ufffd");
    expect(
      unwrap<string>(
        decoded(new Uint8Array([97, 255, 98]), pyStr("ascii"), pyStr("ignore")) as ReturnType<typeof pyStr>,
      ),
    ).toBe("ab");
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

  it("decode utf-8 replace substitutes replacement char", () => {
    const s = decoded(new Uint8Array([255]), pyStr("utf-8"), pyStr("replace"));
    expect(unwrap<string>(s as ReturnType<typeof pyStr>)).toBe("\ufffd");
  });

  it("decode utf-8 ignore skips invalid bytes", () => {
    const s = decoded(
      new Uint8Array([97, 255, 98]),
      pyStr("utf-8"),
      pyStr("ignore"),
    );
    expect(unwrap<string>(s as ReturnType<typeof pyStr>)).toBe("ab");
  });

  it("decode strict remains default for invalid utf-8", () => {
    expect(() =>
      decoded(new Uint8Array([255]), pyStr("utf-8"), pyStr("strict")),
    ).toThrow(PyUnicodeDecodeError);
  });

  it("unknown errors handler raises ValueError", () => {
    expect(() =>
      decoded(new Uint8Array([97]), pyStr("utf-8"), pyStr("nope")),
    ).toThrow(PyValueError);
    expect(() =>
      decoded(new Uint8Array([97]), pyStr("utf-8"), pyStr("nope")),
    ).toThrow(/unknown errors handler/);
  });

  it("non-str errors raises TypeError", () => {
    const b = bytes(pyStr("ab")) as PyObject;
    const decodeFn = decodeMethod(b);
    expect(() => decodeFn(b, pyStr("utf-8"), pyInt(1))).toThrow(PyTypeError);
    expect(() => decodeFn(b, pyStr("utf-8"), pyInt(1))).toThrow(
      /errors' must be str, not int/,
    );
  });
});
