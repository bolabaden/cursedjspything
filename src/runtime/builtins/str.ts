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
import { sequenceRepeatCount, intType } from "./int.js";
import { pyBytes } from "./bytes.js";
import { pyFalse, pyTrue } from "./bool.js";
import { pyList } from "./list.js";
import { pyTuple } from "./tuple.js";

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

function strTitle(text: string): string {
  const out: string[] = [];
  let newWord = true;
  for (let i = 0; i < text.length; ) {
    const cp = text.codePointAt(i)!;
    const w = cp > 0xffff ? 2 : 1;
    const ch = String.fromCodePoint(cp);
    const upper = ch.toUpperCase();
    const lower = ch.toLowerCase();
    if (upper !== lower) {
      out.push(newWord ? upper : lower);
      newWord = false;
    } else {
      out.push(ch);
      newWord = true;
    }
    i += w;
  }
  return out.join("");
}

function strSwapcase(text: string): string {
  const out: string[] = [];
  for (let i = 0; i < text.length; ) {
    const cp = text.codePointAt(i)!;
    const w = cp > 0xffff ? 2 : 1;
    const ch = String.fromCodePoint(cp);
    const upper = ch.toUpperCase();
    const lower = ch.toLowerCase();
    if (upper !== lower) {
      out.push(ch === upper ? lower : ch === lower ? upper : ch);
    } else {
      out.push(ch);
    }
    i += w;
  }
  return out.join("");
}

function strIsascii(text: string): PyObject {
  for (let i = 0; i < text.length; ) {
    const cp = text.codePointAt(i)!;
    if (cp > 0x7f) return pyFalse;
    i += cp > 0xffff ? 2 : 1;
  }
  return pyTrue;
}

function strStripPredicate(chars: unknown): (cp: number) => boolean {
  if (chars === undefined || chars === null) {
    return (cp) => /^\s$/u.test(String.fromCodePoint(cp));
  }
  if (chars instanceof PyObject && chars.type === strType) {
    const data = nativeVal<string>(chars);
    if (data.length === 0) return () => false;
    const set = new Set<number>();
    for (let i = 0; i < data.length; ) {
      const cp = data.codePointAt(i)!;
      set.add(cp);
      i += cp > 0xffff ? 2 : 1;
    }
    return (cp) => set.has(cp);
  }
  throw new PyTypeError("strip arg must be None or str");
}

function stripStr(
  text: string,
  chars: unknown,
  side: "both" | "left" | "right",
): string {
  if (chars === undefined || chars === null) {
    if (side === "both") return text.trim();
    if (side === "left") return text.trimStart();
    return text.trimEnd();
  }
  const shouldStrip = strStripPredicate(chars);
  const cps: number[] = [];
  for (let i = 0; i < text.length; ) {
    const cp = text.codePointAt(i)!;
    cps.push(cp);
    i += cp > 0xffff ? 2 : 1;
  }
  let start = 0;
  let end = cps.length;
  if (side === "both" || side === "left") {
    while (start < end && shouldStrip(cps[start]!)) start += 1;
  }
  if (side === "both" || side === "right") {
    while (end > start && shouldStrip(cps[end - 1]!)) end -= 1;
  }
  if (start >= end) return "";
  return String.fromCodePoint(...cps.slice(start, end));
}

function splitMaxsplitArg(maxsplit: unknown): number {
  if (maxsplit === undefined || maxsplit === null) return -1;
  if (typeof maxsplit === "number") return maxsplit;
  if (maxsplit instanceof PyObject) {
    if (maxsplit.type === intType) {
      return nativeVal<number>(maxsplit);
    }
    const n = sequenceRepeatCount(maxsplit);
    if (n !== null) return n;
  }
  const kind =
    maxsplit instanceof PyObject ? maxsplit.type.name : typeof maxsplit;
  throw new PyTypeError(`'${kind}' object cannot be interpreted as an integer`);
}

function splitStrSepArg(sep: unknown): string | null {
  if (sep === undefined || sep === null) return null;
  if (sep instanceof PyObject && sep.type === strType) {
    return nativeVal<string>(sep);
  }
  const kind = sep instanceof PyObject ? sep.type.name : typeof sep;
  throw new PyTypeError(`must be str or None, not ${kind}`);
}

function isStrWhitespaceCodePoint(cp: number): boolean {
  return /^\s$/u.test(String.fromCodePoint(cp));
}

function strWhitespaceWidth(text: string, pos: number): number {
  if (pos >= text.length) return 0;
  const cp = text.codePointAt(pos)!;
  if (!isStrWhitespaceCodePoint(cp)) return 0;
  return cp > 0xffff ? 2 : 1;
}

function splitStrWithSep(text: string, sep: string, maxsplit: number): string[] {
  if (sep.length === 0) {
    throw new PyValueError("empty separator");
  }
  if (maxsplit === 0) return [text];
  const parts: string[] = [];
  let start = 0;
  let splits = 0;
  let i = 0;
  while (i <= text.length - sep.length) {
    if (text.startsWith(sep, i)) {
      if (maxsplit >= 0 && splits >= maxsplit) break;
      parts.push(text.slice(start, i));
      start = i + sep.length;
      i = start;
      splits += 1;
      continue;
    }
    i += 1;
  }
  parts.push(text.slice(start));
  return parts;
}

function splitStrWhitespace(text: string, maxsplit: number): string[] {
  if (maxsplit === 0) return [text];
  const parts: string[] = [];
  let i = 0;
  const n = text.length;
  while (i < n) {
    let w = strWhitespaceWidth(text, i);
    while (w > 0) {
      i += w;
      w = strWhitespaceWidth(text, i);
    }
    if (i >= n) break;
    const start = i;
    while (i < n) {
      w = strWhitespaceWidth(text, i);
      if (w > 0) break;
      const cp = text.codePointAt(i)!;
      i += cp > 0xffff ? 2 : 1;
    }
    parts.push(text.slice(start, i));
    if (maxsplit >= 0 && parts.length >= maxsplit) {
      while (i < n) {
        w = strWhitespaceWidth(text, i);
        if (w === 0) break;
        i += w;
      }
      if (i < n) parts.push(text.slice(i));
      return parts;
    }
    while (i < n) {
      w = strWhitespaceWidth(text, i);
      if (w === 0) break;
      i += w;
    }
  }
  return parts;
}

function splitStr(text: string, sep: unknown, maxsplit: unknown): PyObject {
  const limit = splitMaxsplitArg(maxsplit);
  const sepStr = splitStrSepArg(sep);
  const chunks =
    sepStr === null
      ? splitStrWhitespace(text, limit)
      : splitStrWithSep(text, sepStr, limit);
  return pyList(chunks.map((chunk) => pyStr(chunk)));
}

function rsplitStrWithSep(text: string, sep: string, maxsplit: number): string[] {
  if (sep.length === 0) {
    throw new PyValueError("empty separator");
  }
  if (maxsplit === 0) return [text];
  const parts: string[] = [];
  let end = text.length;
  let splits = 0;
  while (true) {
    if (maxsplit >= 0 && splits >= maxsplit) break;
    let found = -1;
    for (let i = end - sep.length; i >= 0; i--) {
      if (text.startsWith(sep, i)) {
        found = i;
        break;
      }
    }
    if (found < 0) break;
    parts.unshift(text.slice(found + sep.length, end));
    end = found;
    splits += 1;
  }
  parts.unshift(text.slice(0, end));
  return parts;
}

function rsplitStrWhitespace(text: string, maxsplit: number): string[] {
  if (maxsplit === 0) return [text];
  const cps: number[] = [];
  for (let i = 0; i < text.length; ) {
    const cp = text.codePointAt(i)!;
    cps.push(cp);
    i += cp > 0xffff ? 2 : 1;
  }
  const parts: string[] = [];
  let i = cps.length;
  while (i > 0) {
    while (i > 0 && isStrWhitespaceCodePoint(cps[i - 1]!)) i -= 1;
    if (i === 0) break;
    const end = i;
    while (i > 0 && !isStrWhitespaceCodePoint(cps[i - 1]!)) i -= 1;
    parts.unshift(String.fromCodePoint(...cps.slice(i, end)));
    if (maxsplit >= 0 && parts.length >= maxsplit) {
      while (i > 0 && isStrWhitespaceCodePoint(cps[i - 1]!)) i -= 1;
      if (i > 0) parts.unshift(String.fromCodePoint(...cps.slice(0, i)));
      return parts;
    }
  }
  return parts;
}

function rsplitStr(text: string, sep: unknown, maxsplit: unknown): PyObject {
  const limit = splitMaxsplitArg(maxsplit);
  const sepStr = splitStrSepArg(sep);
  const chunks =
    sepStr === null
      ? rsplitStrWhitespace(text, limit)
      : rsplitStrWithSep(text, sepStr, limit);
  return pyList(chunks.map((chunk) => pyStr(chunk)));
}

function requirePartitionStrSep(sep: unknown): string {
  if (sep instanceof PyObject && sep.type === strType) {
    const s = nativeVal<string>(sep);
    if (s.length === 0) {
      throw new PyValueError("empty separator");
    }
    return s;
  }
  const kind = sep instanceof PyObject ? sep.type.name : typeof sep;
  throw new PyTypeError(`must be str, not ${kind}`);
}

function findStrSepIndex(text: string, sep: string, fromRight: boolean): number {
  if (fromRight) {
    for (let i = text.length - sep.length; i >= 0; i--) {
      if (text.startsWith(sep, i)) return i;
    }
    return -1;
  }
  for (let i = 0; i <= text.length - sep.length; i++) {
    if (text.startsWith(sep, i)) return i;
  }
  return -1;
}

function partitionStr(text: string, sep: unknown): PyObject {
  const sepStr = requirePartitionStrSep(sep);
  const idx = findStrSepIndex(text, sepStr, false);
  if (idx < 0) {
    return pyTuple([pyStr(text), pyStr(""), pyStr("")]);
  }
  return pyTuple([
    pyStr(text.slice(0, idx)),
    pyStr(sepStr),
    pyStr(text.slice(idx + sepStr.length)),
  ]);
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
    ["title", (self: PyObject) => pyStr(strTitle(nativeVal<string>(self)))],
    ["swapcase", (self: PyObject) => pyStr(strSwapcase(nativeVal<string>(self)))],
    ["isascii", (self: PyObject) => strIsascii(nativeVal<string>(self))],
    ["strip", (self: PyObject, chars?: unknown) =>
      pyStr(stripStr(nativeVal<string>(self), chars, "both"))],
    ["lstrip", (self: PyObject, chars?: unknown) =>
      pyStr(stripStr(nativeVal<string>(self), chars, "left"))],
    ["rstrip", (self: PyObject, chars?: unknown) =>
      pyStr(stripStr(nativeVal<string>(self), chars, "right"))],
    ["split", (self: PyObject, sep?: unknown, maxsplit?: unknown) =>
      splitStr(nativeVal<string>(self), sep, maxsplit)],
    ["rsplit", (self: PyObject, sep?: unknown, maxsplit?: unknown) =>
      rsplitStr(nativeVal<string>(self), sep, maxsplit)],
    ["partition", (self: PyObject, sep: unknown) =>
      partitionStr(nativeVal<string>(self), sep)],
  ]),
});

export function pyStr(v: string): PyObject {
  const obj = new PyObject(strType);
  setNative(obj, v);
  return obj;
}
