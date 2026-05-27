import { PyObject, NotImplemented } from "../core/object.js";
import { Slot, Hook } from "../core/slots.js";
import { makeClass } from "../class/class.js";
import { PyStopIteration } from "../core/lookup.js";
import {
  PyIndexError,
  PyLookupError,
  PyTypeError,
  PyUnicodeEncodeError,
  PyValueError,
} from "../core/errors.js";
import { nativeVal, setNative } from "./native.js";
import { sequenceRepeatCount } from "./int.js";
import { pyBytes } from "./bytes.js";
import { pyFalse, pyTrue } from "./bool.js";

function repeatStr(self: PyObject, other: PyObject) {
  const n = sequenceRepeatCount(other);
  if (n === null) return NotImplemented;
  return pyStr(nativeVal<string>(self).repeat(n));
}

function normalizeEncodingName(raw: string): string {
  return raw.toLowerCase().replace(/_/g, "-");
}

function encodeEncodingArg(encoding: unknown): string {
  if (encoding === undefined || encoding === null) return "utf-8";
  if (encoding instanceof PyObject && encoding.type === strType) {
    return nativeVal<string>(encoding);
  }
  const kind =
    encoding instanceof PyObject ? encoding.type.name : typeof encoding;
  throw new PyTypeError(
    `encode() argument 'encoding' must be str, not ${kind}`,
  );
}

type EncodeErrors = "strict" | "replace" | "ignore" | "backslashreplace" | "surrogateescape";

const SURROGATE_ESCAPE_BASE = 0xdc00;
const SURROGATE_ESCAPE_MIN = 0xdc80;
const SURROGATE_ESCAPE_MAX = 0xdcff;

function isSurrogateEscapeCodePoint(cp: number): boolean {
  return cp >= SURROGATE_ESCAPE_MIN && cp <= SURROGATE_ESCAPE_MAX;
}

function isDisallowedSurrogate(cp: number): boolean {
  return cp >= 0xd800 && cp <= 0xdfff && !isSurrogateEscapeCodePoint(cp);
}

function encodeErrorsArg(errors: unknown): EncodeErrors {
  if (errors === undefined || errors === null) return "strict";
  if (errors instanceof PyObject && errors.type === strType) {
    const name = nativeVal<string>(errors);
    if (
      name === "strict" ||
      name === "replace" ||
      name === "ignore" ||
      name === "backslashreplace" ||
      name === "surrogateescape"
    ) {
      return name;
    }
    throw new PyValueError(`unknown errors handler: '${name}'`);
  }
  const kind = errors instanceof PyObject ? errors.type.name : typeof errors;
  throw new PyTypeError(`encode() argument 'errors' must be str, not ${kind}`);
}

function appendBackslashReplaceBytes(out: number[], cp: number): void {
  if (cp <= 0xff) {
    const hex = cp.toString(16).padStart(2, "0");
    out.push(0x5c, 0x78, hex.charCodeAt(0)!, hex.charCodeAt(1)!);
    return;
  }
  if (cp <= 0xffff) {
    const hex = cp.toString(16).padStart(4, "0");
    out.push(0x5c, 0x75);
    for (let i = 0; i < 4; i++) out.push(hex.charCodeAt(i)!);
    return;
  }
  const hex = cp.toString(16).padStart(8, "0");
  out.push(0x5c, 0x55);
  for (let i = 0; i < 8; i++) out.push(hex.charCodeAt(i)!);
}

function formatEncodeChar(cp: number): string {
  if (cp <= 0xff) {
    return `'\\x${cp.toString(16).padStart(2, "0")}'`;
  }
  const hex = cp.toString(16).padStart(4, "0");
  return `'\\u${hex}'`;
}

function appendUtf8CodePoint(out: number[], cp: number): void {
  if (cp <= 0x7f) {
    out.push(cp);
  } else if (cp <= 0x7ff) {
    out.push(0xc0 | (cp >> 6), 0x80 | (cp & 0x3f));
  } else if (cp <= 0xffff) {
    out.push(
      0xe0 | (cp >> 12),
      0x80 | ((cp >> 6) & 0x3f),
      0x80 | (cp & 0x3f),
    );
  } else {
    out.push(
      0xf0 | (cp >> 18),
      0x80 | ((cp >> 12) & 0x3f),
      0x80 | ((cp >> 6) & 0x3f),
      0x80 | (cp & 0x3f),
    );
  }
}

function encodeUtf8SurrogateEscape(text: string): Uint8Array {
  const out: number[] = [];
  for (let i = 0; i < text.length; ) {
    const cp = text.codePointAt(i)!;
    const width = cp > 0xffff ? 2 : 1;
    if (isSurrogateEscapeCodePoint(cp)) {
      out.push(cp - SURROGATE_ESCAPE_BASE);
    } else if (isDisallowedSurrogate(cp)) {
      throw new PyUnicodeEncodeError(
        `'utf-8' codec can't encode character '\\u${cp.toString(16).padStart(4, "0")}' in position ${i}: surrogates not allowed`,
      );
    } else {
      appendUtf8CodePoint(out, cp);
    }
    i += width;
  }
  return new Uint8Array(out);
}

function encodeLimited(
  text: string,
  codec: string,
  max: number,
  errors: EncodeErrors,
): Uint8Array {
  const out: number[] = [];
  for (let i = 0; i < text.length; ) {
    const cp = text.codePointAt(i)!;
    const width = cp > 0xffff ? 2 : 1;
    if (isSurrogateEscapeCodePoint(cp)) {
      out.push(cp - SURROGATE_ESCAPE_BASE);
    } else if (cp <= max) {
      out.push(cp);
    } else if (errors === "strict") {
      throw new PyUnicodeEncodeError(
        `'${codec}' codec can't encode character ${formatEncodeChar(cp)} in position ${i}: ordinal not in range(${max + 1})`,
      );
    } else if (errors === "replace") {
      out.push(0x3f);
    } else if (errors === "backslashreplace") {
      appendBackslashReplaceBytes(out, cp);
    }
    i += width;
  }
  return new Uint8Array(out);
}

function encodeStrPayload(
  text: string,
  encoding: string,
  errors: EncodeErrors,
): Uint8Array {
  const enc = normalizeEncodingName(encoding);
  if (enc === "utf-8" || enc === "utf8") {
    if (errors === "surrogateescape") {
      return encodeUtf8SurrogateEscape(text);
    }
    return new TextEncoder().encode(text);
  }
  if (enc === "ascii") {
    return encodeLimited(text, "ascii", 0x7f, errors);
  }
  if (enc === "latin-1" || enc === "latin1" || enc === "iso-8859-1") {
    return encodeLimited(text, "latin-1", 0xff, errors);
  }
  throw new PyLookupError(`unknown encoding: ${encoding}`);
}

function encodeStr(
  self: PyObject,
  encoding?: unknown,
  errors?: unknown,
): PyObject {
  const text = nativeVal<string>(self);
  const enc = encodeEncodingArg(encoding);
  const errMode = encodeErrorsArg(errors);
  return pyBytes(encodeStrPayload(text, enc, errMode));
}

function strCapitalize(text: string): string {
  if (text.length === 0) return text;
  const lower = text.toLowerCase();
  const cp0 = lower.codePointAt(0)!;
  const w0 = cp0 > 0xffff ? 2 : 1;
  const up = String.fromCodePoint(cp0).toUpperCase();
  const head = up.length > w0 ? up.slice(0, w0) : up;
  return head + lower.slice(w0);
}

function strIsascii(text: string): PyObject {
  for (let i = 0; i < text.length; ) {
    const cp = text.codePointAt(i)!;
    if (cp > 0x7f) return pyFalse;
    i += cp > 0xffff ? 2 : 1;
  }
  return pyTrue;
}

// ── pyStr ─────────────────────────────────────────────────────────────

export const strType = makeClass({
  name: "str",
  dict: new Map<string | symbol, unknown>([
    [Slot.repr, (self: PyObject) => `'${nativeVal<string>(self)}'`],
    [Slot.str, (self: PyObject) => nativeVal<string>(self)],
    [Slot.hash, (self: PyObject) => {
      const s = nativeVal<string>(self);
      let h = 0;
      for (let i = 0; i < s.length; i++) {
        h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
      }
      return h;
    }],
    [Slot.bool, (self: PyObject) => nativeVal<string>(self).length > 0],
    [Slot.len, (self: PyObject) => nativeVal<string>(self).length],
    [Slot.eq, (self: PyObject, other: PyObject) => {
      if (other.type !== strType) return NotImplemented;
      return nativeVal<string>(self) === nativeVal<string>(other);
    }],
    [Slot.lt, (self: PyObject, other: PyObject) => {
      if (other.type !== strType) return NotImplemented;
      return nativeVal<string>(self) < nativeVal<string>(other);
    }],
    [Slot.le, (self: PyObject, other: PyObject) => {
      if (other.type !== strType) return NotImplemented;
      return nativeVal<string>(self) <= nativeVal<string>(other);
    }],
    [Slot.gt, (self: PyObject, other: PyObject) => {
      if (other.type !== strType) return NotImplemented;
      return nativeVal<string>(self) > nativeVal<string>(other);
    }],
    [Slot.ge, (self: PyObject, other: PyObject) => {
      if (other.type !== strType) return NotImplemented;
      return nativeVal<string>(self) >= nativeVal<string>(other);
    }],
    [Slot.ne, (self: PyObject, other: PyObject) => {
      if (other.type !== strType) return NotImplemented;
      return nativeVal<string>(self) !== nativeVal<string>(other);
    }],
    [Slot.add, (self: PyObject, other: PyObject) => {
      if (other.type !== strType) return NotImplemented;
      return pyStr(nativeVal<string>(self) + nativeVal<string>(other));
    }],
    [Slot.mul, repeatStr],
    [Slot.rmul, repeatStr],
    [Slot.contains, (self: PyObject, item: unknown) => {
      if (!(item instanceof PyObject) || item.type !== strType) {
        throw new PyTypeError("'in <string>' requires string as left operand, not int");
      }
      return nativeVal<string>(self).includes(nativeVal<string>(item));
    }],
    [Slot.getitem, (self: PyObject, key: unknown) => {
      const s = nativeVal<string>(self);
      if (typeof key === "number") {
        const idx = key < 0 ? s.length + key : key;
        if (idx < 0 || idx >= s.length) throw new PyIndexError("string index out of range");
        return pyStr(s[idx]);
      }
      throw new PyTypeError("string indices must be integers");
    }],
    [Slot.iter, (self: PyObject) => {
      const s = nativeVal<string>(self);
      let i = 0;
      const iterType = makeClass({
        name: "str_iterator",
        dict: new Map<string | symbol, unknown>([
          [Slot.iter, (it: PyObject) => it],
          [Slot.next, (_it: PyObject) => {
            if (i >= s.length) throw new PyStopIteration();
            return pyStr(s[i++]);
          }],
        ]),
      });
      return new PyObject(iterType);
    }],
    [Hook.format, (self: PyObject, spec: string) => {
      if (spec === "" || spec === "s") return nativeVal<string>(self);
      return nativeVal<string>(self);
    }],
    [Hook.bytes, (self: PyObject) => encodeStr(self)],
    ["encode", (self: PyObject, encoding?: unknown, errors?: unknown) => {
      return encodeStr(self, encoding, errors);
    }],
    ["upper", (self: PyObject) => pyStr(nativeVal<string>(self).toUpperCase())],
    ["lower", (self: PyObject) => pyStr(nativeVal<string>(self).toLowerCase())],
    ["capitalize", (self: PyObject) => pyStr(strCapitalize(nativeVal<string>(self)))],
    ["isascii", (self: PyObject) => strIsascii(nativeVal<string>(self))],
  ]),
});

export function pyStr(v: string): PyObject {
  const obj = new PyObject(strType);
  setNative(obj, v);
  return obj;
}
