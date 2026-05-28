import { PyObject, NotImplemented } from "../core/object.js";
import { Slot, Hook } from "../core/slots.js";
import { makeClass } from "../class/class.js";
import { PyStopIteration } from "../core/lookup.js";
import { iter, next } from "../dispatch/protocols.js";
import {
  PyIndexError,
  PyLookupError,
  PyTypeError,
  PyUnicodeEncodeError,
  PyValueError,
} from "../core/errors.js";
import { nativeVal, setNative } from "./native.js";
import { sequenceRepeatCount, intType, pyInt } from "./int.js";
import { pyBytes } from "./bytes.js";
import { pyFalse, pyTrue, boolType } from "./bool.js";
import { pyList } from "./list.js";
import { pyTuple, tupleType } from "./tuple.js";
import { dictType, pyDict } from "./dict.js";
import { dictGet } from "../collections/dict-keys.js";

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

function strIsalpha(text: string): PyObject {
  if (text.length === 0) return pyFalse;
  for (let i = 0; i < text.length; ) {
    const cp = text.codePointAt(i)!;
    if (!/^\p{L}$/u.test(String.fromCodePoint(cp))) return pyFalse;
    i += cp > 0xffff ? 2 : 1;
  }
  return pyTrue;
}

function strIsdigit(text: string): PyObject {
  if (text.length === 0) return pyFalse;
  for (let i = 0; i < text.length; ) {
    const cp = text.codePointAt(i)!;
    if (!/^\p{Nd}$/u.test(String.fromCodePoint(cp))) return pyFalse;
    i += cp > 0xffff ? 2 : 1;
  }
  return pyTrue;
}

function strIsalnum(text: string): PyObject {
  if (text.length === 0) return pyFalse;
  for (let i = 0; i < text.length; ) {
    const cp = text.codePointAt(i)!;
    const ch = String.fromCodePoint(cp);
    if (!/^\p{L}$/u.test(ch) && !/^\p{Nd}$/u.test(ch)) return pyFalse;
    i += cp > 0xffff ? 2 : 1;
  }
  return pyTrue;
}

function strHasCasedCharacter(text: string): boolean {
  for (let i = 0; i < text.length; ) {
    const cp = text.codePointAt(i)!;
    const ch = String.fromCodePoint(cp);
    if (ch.toUpperCase() !== ch.toLowerCase()) return true;
    i += cp > 0xffff ? 2 : 1;
  }
  return false;
}

function strIslower(text: string): PyObject {
  if (text.length === 0) return pyFalse;
  let cased = false;
  for (let i = 0; i < text.length; ) {
    const cp = text.codePointAt(i)!;
    const ch = String.fromCodePoint(cp);
    const upper = ch.toUpperCase();
    const lower = ch.toLowerCase();
    if (upper !== lower) {
      cased = true;
      if (ch !== lower) return pyFalse;
    }
    i += cp > 0xffff ? 2 : 1;
  }
  return cased ? pyTrue : pyFalse;
}

function strIsupper(text: string): PyObject {
  if (text.length === 0) return pyFalse;
  let cased = false;
  for (let i = 0; i < text.length; ) {
    const cp = text.codePointAt(i)!;
    const ch = String.fromCodePoint(cp);
    const upper = ch.toUpperCase();
    const lower = ch.toLowerCase();
    if (upper !== lower) {
      cased = true;
      if (ch !== upper) return pyFalse;
    }
    i += cp > 0xffff ? 2 : 1;
  }
  return cased ? pyTrue : pyFalse;
}

function strIstitle(text: string): PyObject {
  if (text.length === 0) return pyFalse;
  if (strTitle(text) !== text) return pyFalse;
  return strHasCasedCharacter(text) ? pyTrue : pyFalse;
}

function strIsspace(text: string): PyObject {
  if (text.length === 0) return pyFalse;
  for (let i = 0; i < text.length; ) {
    const cp = text.codePointAt(i)!;
    if (!isStrWhitespaceCodePoint(cp)) return pyFalse;
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

function parseBoundIndex(value: unknown, length: number): number {
  if (typeof value === "number") return value;
  if (value instanceof PyObject) {
    if (value.type === intType) {
      return nativeVal<number>(value);
    }
    const n = sequenceRepeatCount(value);
    if (n !== null) return n;
  }
  const kind = value instanceof PyObject ? value.type.name : typeof value;
  throw new PyTypeError(`slice indices must be integers or None or have an __index__ method`);
}

function strSliceBounds(
  length: number,
  start: unknown,
  end: unknown,
): [number, number] {
  let a =
    start === undefined || start === null ? 0 : parseBoundIndex(start, length);
  let b =
    end === undefined || end === null ? length : parseBoundIndex(end, length);
  if (a < 0) a += length;
  if (b < 0) b += length;
  a = Math.max(0, Math.min(a, length));
  b = Math.max(0, Math.min(b, length));
  return [a, b];
}

function requireFindStrSub(sub: unknown): string {
  if (sub instanceof PyObject && sub.type === strType) {
    return nativeVal<string>(sub);
  }
  const kind = sub instanceof PyObject ? sub.type.name : typeof sub;
  throw new PyTypeError(`must be str, not ${kind}`);
}

function findSubInStrRange(
  text: string,
  sub: string,
  start: number,
  end: number,
  fromRight: boolean,
): number {
  if (start > end) return -1;
  if (sub.length === 0) {
    return fromRight ? end : start;
  }
  const slice = text.slice(start, end);
  const rel = findStrSepIndex(slice, sub, fromRight);
  return rel < 0 ? -1 : rel + start;
}

function findStr(
  text: string,
  sub: unknown,
  start?: unknown,
  end?: unknown,
): PyObject {
  const subStr = requireFindStrSub(sub);
  const [a, b] = strSliceBounds(text.length, start, end);
  return pyInt(findSubInStrRange(text, subStr, a, b, false));
}

function rfindStr(
  text: string,
  sub: unknown,
  start?: unknown,
  end?: unknown,
): PyObject {
  const subStr = requireFindStrSub(sub);
  const [a, b] = strSliceBounds(text.length, start, end);
  return pyInt(findSubInStrRange(text, subStr, a, b, true));
}

function indexStr(
  text: string,
  sub: unknown,
  start?: unknown,
  end?: unknown,
): PyObject {
  const subStr = requireFindStrSub(sub);
  const [a, b] = strSliceBounds(text.length, start, end);
  const idx = findSubInStrRange(text, subStr, a, b, false);
  if (idx < 0) throw new PyValueError("substring not found");
  return pyInt(idx);
}

function rindexStr(
  text: string,
  sub: unknown,
  start?: unknown,
  end?: unknown,
): PyObject {
  const subStr = requireFindStrSub(sub);
  const [a, b] = strSliceBounds(text.length, start, end);
  const idx = findSubInStrRange(text, subStr, a, b, true);
  if (idx < 0) throw new PyValueError("substring not found");
  return pyInt(idx);
}

function countSubInStrRange(
  text: string,
  sub: string,
  start: number,
  end: number,
): number {
  if (start > end) return 0;
  if (sub.length === 0) return end - start + 1;
  let count = 0;
  let pos = start;
  while (pos <= end - sub.length) {
    const slice = text.slice(pos, end);
    const rel = findStrSepIndex(slice, sub, false);
    if (rel < 0) break;
    count += 1;
    pos += rel + sub.length;
  }
  return count;
}

function countStr(
  text: string,
  sub: unknown,
  start?: unknown,
  end?: unknown,
): PyObject {
  const subStr = requireFindStrSub(sub);
  const [a, b] = strSliceBounds(text.length, start, end);
  return pyInt(countSubInStrRange(text, subStr, a, b));
}

function strAffixCandidates(
  affix: unknown,
  method: "startswith" | "endswith",
): string[] {
  if (affix instanceof PyObject && affix.type === strType) {
    return [nativeVal<string>(affix)];
  }
  if (affix instanceof PyObject && affix.type === tupleType) {
    const items = nativeVal<readonly PyObject[]>(affix);
    const out: string[] = [];
    for (const item of items) {
      if (item.type !== strType) {
        const kind = item.type.name;
        throw new PyTypeError(`must be str, not ${kind}`);
      }
      out.push(nativeVal<string>(item));
    }
    return out;
  }
  const kind = affix instanceof PyObject ? affix.type.name : typeof affix;
  throw new PyTypeError(
    `${method} first arg must be str or a tuple of str, not ${kind}`,
  );
}

function strStartsWithSlice(slice: string, prefix: string): boolean {
  return slice.startsWith(prefix);
}

function strEndsWithSlice(slice: string, suffix: string): boolean {
  return slice.endsWith(suffix);
}

function strStartswith(
  text: string,
  prefix: unknown,
  start?: unknown,
  end?: unknown,
): PyObject {
  const [a, b] = strSliceBounds(text.length, start, end);
  const slice = text.slice(a, b);
  const candidates = strAffixCandidates(prefix, "startswith");
  for (const candidate of candidates) {
    if (strStartsWithSlice(slice, candidate)) return pyTrue;
  }
  return pyFalse;
}

function strEndswith(
  text: string,
  suffix: unknown,
  start?: unknown,
  end?: unknown,
): PyObject {
  const [a, b] = strSliceBounds(text.length, start, end);
  const slice = text.slice(a, b);
  const candidates = strAffixCandidates(suffix, "endswith");
  for (const candidate of candidates) {
    if (strEndsWithSlice(slice, candidate)) return pyTrue;
  }
  return pyFalse;
}

function requireAffixStr(affix: unknown): string {
  if (affix instanceof PyObject && affix.type === strType) {
    return nativeVal<string>(affix);
  }
  const kind = affix instanceof PyObject ? affix.type.name : typeof affix;
  throw new PyTypeError(`must be str, not ${kind}`);
}

function removePrefixStr(text: string, prefix: unknown): PyObject {
  const pre = requireAffixStr(prefix);
  if (strStartsWithSlice(text, pre)) {
    return pyStr(text.slice(pre.length));
  }
  return pyStr(text);
}

function removeSuffixStr(text: string, suffix: unknown): PyObject {
  const suf = requireAffixStr(suffix);
  if (strEndsWithSlice(text, suf)) {
    return pyStr(text.slice(0, text.length - suf.length));
  }
  return pyStr(text);
}

function strCodePointLength(text: string): number {
  let n = 0;
  for (let i = 0; i < text.length; ) {
    const cp = text.codePointAt(i)!;
    n += 1;
    i += cp > 0xffff ? 2 : 1;
  }
  return n;
}

function requireStrPadFill(fill: unknown): string {
  if (fill === undefined || fill === null) return " ";
  if (fill instanceof PyObject && fill.type === strType) {
    const data = nativeVal<string>(fill);
    if (strCodePointLength(data) !== 1) {
      throw new PyTypeError(
        "The fill character must be exactly one character long",
      );
    }
    return data;
  }
  const kind = fill instanceof PyObject ? fill.type.name : typeof fill;
  throw new PyTypeError(`must be str, not ${kind}`);
}

function centerStr(text: string, width: unknown, fill?: unknown): PyObject {
  const w = splitMaxsplitArg(width);
  const n = strCodePointLength(text);
  if (w <= n) return pyStr(text);
  const fillChar = requireStrPadFill(fill);
  const pad = w - n;
  const left = Math.floor(pad / 2);
  return pyStr(fillChar.repeat(left) + text + fillChar.repeat(pad - left));
}

function ljustStr(text: string, width: unknown, fill?: unknown): PyObject {
  const w = splitMaxsplitArg(width);
  const n = strCodePointLength(text);
  if (w <= n) return pyStr(text);
  const fillChar = requireStrPadFill(fill);
  return pyStr(text + fillChar.repeat(w - n));
}

function rjustStr(text: string, width: unknown, fill?: unknown): PyObject {
  const w = splitMaxsplitArg(width);
  const n = strCodePointLength(text);
  if (w <= n) return pyStr(text);
  const fillChar = requireStrPadFill(fill);
  return pyStr(fillChar.repeat(w - n) + text);
}

function zfillStr(text: string, width: unknown): PyObject {
  const w = splitMaxsplitArg(width);
  const n = strCodePointLength(text);
  if (w <= n) return pyStr(text);
  const pad = w - n;
  if (text.length > 0 && (text[0] === "+" || text[0] === "-")) {
    return pyStr(text[0] + "0".repeat(pad) + text.slice(1));
  }
  return pyStr("0".repeat(pad) + text);
}

function parseExpandtabsTabsize(tabsize: unknown): number {
  if (tabsize === undefined || tabsize === null) return 8;
  return splitMaxsplitArg(tabsize);
}

function expandTabsStr(text: string, tabsize?: unknown): PyObject {
  const size = parseExpandtabsTabsize(tabsize);
  const parts: string[] = [];
  let col = 0;
  for (let i = 0; i < text.length; ) {
    const cp = text.codePointAt(i)!;
    if (cp === 0x09) {
      if (size > 0) {
        const pad = col % size === 0 ? size : size - (col % size);
        parts.push(" ".repeat(pad));
        col += pad;
      }
    } else {
      parts.push(String.fromCodePoint(cp));
      col += 1;
    }
    i += cp > 0xffff ? 2 : 1;
  }
  return pyStr(parts.join(""));
}

function strToCodePoints(text: string): number[] {
  const cps: number[] = [];
  for (let i = 0; i < text.length; ) {
    const cp = text.codePointAt(i)!;
    cps.push(cp);
    i += cp > 0xffff ? 2 : 1;
  }
  return cps;
}

function requireMaketransStr(value: unknown): string {
  if (value instanceof PyObject && value.type === strType) {
    return nativeVal<string>(value);
  }
  const kind = value instanceof PyObject ? value.type.name : typeof value;
  throw new PyTypeError(`must be str, not ${kind}`);
}

function strMakeTrans(frm: unknown, to: unknown): PyObject {
  const fromStr = requireMaketransStr(frm);
  const toStr = requireMaketransStr(to);
  const fromCps = strToCodePoints(fromStr);
  const toCps = strToCodePoints(toStr);
  if (fromCps.length !== toCps.length) {
    throw new PyValueError(
      "the first two maketrans arguments must have equal length",
    );
  }
  const entries: [unknown, PyObject][] = [];
  for (let i = 0; i < fromCps.length; i++) {
    entries.push([pyInt(fromCps[i]!), pyInt(toCps[i]!)]);
  }
  return pyDict(entries);
}

function requireTranslateTable(table: unknown): Map<unknown, PyObject> {
  if (table instanceof PyObject && table.type === dictType) {
    return nativeVal<Map<unknown, PyObject>>(table);
  }
  const kind = table instanceof PyObject ? table.type.name : typeof table;
  throw new PyTypeError(`must be dict, not ${kind}`);
}

function strTranslate(text: string, table: unknown): PyObject {
  const mapping = requireTranslateTable(table);
  const parts: string[] = [];
  for (let i = 0; i < text.length; ) {
    const cp = text.codePointAt(i)!;
    const mapped = dictGet(mapping, pyInt(cp));
    if (mapped === undefined) {
      parts.push(String.fromCodePoint(cp));
    } else {
      const val = mapped as PyObject;
      if (val.type === intType) {
        parts.push(String.fromCodePoint(nativeVal<number>(val)));
      } else if (val.type === strType) {
        parts.push(nativeVal<string>(val));
      } else {
        parts.push(String.fromCodePoint(cp));
      }
    }
    i += cp > 0xffff ? 2 : 1;
  }
  return pyStr(parts.join(""));
}

function joinStr(sep: string, iterable: unknown): PyObject {
  if (!(iterable instanceof PyObject)) {
    throw new PyTypeError("can only join an iterable");
  }
  const parts: string[] = [];
  let index = 0;
  let it: PyObject;
  try {
    it = iter(iterable);
  } catch (e) {
    if (e instanceof PyTypeError) {
      throw new PyTypeError("can only join an iterable");
    }
    throw e;
  }
  while (true) {
    let item: unknown;
    try {
      item = next(it);
    } catch (e) {
      if (e instanceof PyStopIteration) break;
      throw e;
    }
    if (!(item instanceof PyObject) || item.type !== strType) {
      const kind = item instanceof PyObject ? item.type.name : typeof item;
      throw new PyTypeError(
        `sequence item ${index}: expected str instance, ${kind} found`,
      );
    }
    parts.push(nativeVal<string>(item));
    index += 1;
  }
  return pyStr(parts.join(sep));
}

function requireReplaceStr(value: unknown): string {
  if (value instanceof PyObject && value.type === strType) {
    return nativeVal<string>(value);
  }
  const kind = value instanceof PyObject ? value.type.name : typeof value;
  throw new PyTypeError(`must be str, not ${kind}`);
}

function replaceEmptyOldStr(text: string, newStr: string, limit: number): string {
  if (limit === 0) return text;
  const maxInserts = limit < 0 ? text.length + 1 : limit;
  const parts: string[] = [];
  let inserted = 0;
  for (let i = 0; i < text.length; i++) {
    if (inserted < maxInserts) {
      parts.push(newStr);
      inserted += 1;
    }
    parts.push(text[i]!);
  }
  if (inserted < maxInserts) {
    parts.push(newStr);
  }
  return parts.join("");
}

function replaceNonEmptyOldStr(
  text: string,
  old: string,
  newStr: string,
  limit: number,
): string {
  if (limit === 0) return text;
  const maxReplacements = limit < 0 ? Number.POSITIVE_INFINITY : limit;
  const parts: string[] = [];
  let pos = 0;
  let done = 0;
  while (pos < text.length) {
    const rel = findStrSepIndex(text.slice(pos), old, false);
    if (rel < 0 || done >= maxReplacements) {
      parts.push(text.slice(pos));
      break;
    }
    const idx = pos + rel;
    parts.push(text.slice(pos, idx));
    parts.push(newStr);
    pos = idx + old.length;
    done += 1;
  }
  return parts.join("");
}

function replaceStr(
  text: string,
  old: unknown,
  newStr: unknown,
  count?: unknown,
): PyObject {
  const oldStr = requireReplaceStr(old);
  const newS = requireReplaceStr(newStr);
  const limit = splitMaxsplitArg(count);
  const out =
    oldStr.length === 0
      ? replaceEmptyOldStr(text, newS, limit)
      : replaceNonEmptyOldStr(text, oldStr, newS, limit);
  return pyStr(out);
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

function rpartitionStr(text: string, sep: unknown): PyObject {
  const sepStr = requirePartitionStrSep(sep);
  const idx = findStrSepIndex(text, sepStr, true);
  if (idx < 0) {
    return pyTuple([pyStr(""), pyStr(""), pyStr(text)]);
  }
  return pyTuple([
    pyStr(text.slice(0, idx)),
    pyStr(sepStr),
    pyStr(text.slice(idx + sepStr.length)),
  ]);
}

function isStrLineBreakCodePoint(cp: number): boolean {
  return (
    cp === 0x0a ||
    cp === 0x0b ||
    cp === 0x0c ||
    cp === 0x0d ||
    cp === 0x85 ||
    cp === 0x2028 ||
    cp === 0x2029
  );
}

function strLineBreakLength(text: string, i: number): number {
  if (i >= text.length) return 0;
  const cp = text.codePointAt(i)!;
  if (cp === 0x0d) {
    if (text.charCodeAt(i + 1) === 0x0a) return 2;
    return 1;
  }
  if (isStrLineBreakCodePoint(cp)) {
    return cp > 0xffff ? 2 : 1;
  }
  return 0;
}

function parseSplitlinesKeepends(keepends: unknown): boolean {
  if (keepends === undefined || keepends === null) return false;
  if (typeof keepends === "boolean") return keepends;
  if (keepends instanceof PyObject && keepends.type === boolType) {
    return nativeVal<boolean>(keepends);
  }
  const kind =
    keepends instanceof PyObject ? keepends.type.name : typeof keepends;
  throw new PyTypeError(`splitlines() argument must be bool, not ${kind}`);
}

function splitlinesStr(text: string, keepends: unknown): PyObject {
  if (text.length === 0) return pyList([]);
  const keep = parseSplitlinesKeepends(keepends);
  const parts: string[] = [];
  let start = 0;
  let i = 0;
  while (i < text.length) {
    const lb = strLineBreakLength(text, i);
    if (lb > 0) {
      parts.push(text.slice(start, keep ? i + lb : i));
      i += lb;
      start = i;
      continue;
    }
    const cp = text.codePointAt(i)!;
    i += cp > 0xffff ? 2 : 1;
  }
  if (start < text.length) {
    parts.push(text.slice(start));
  }
  return pyList(parts.map((chunk) => pyStr(chunk)));
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
    ["join", (self: PyObject, iterable: unknown) =>
      joinStr(nativeVal<string>(self), iterable)],
    ["upper", (self: PyObject) => pyStr(nativeVal<string>(self).toUpperCase())],
    ["lower", (self: PyObject) => pyStr(nativeVal<string>(self).toLowerCase())],
    ["capitalize", (self: PyObject) => pyStr(strCapitalize(nativeVal<string>(self)))],
    ["title", (self: PyObject) => pyStr(strTitle(nativeVal<string>(self)))],
    ["swapcase", (self: PyObject) => pyStr(strSwapcase(nativeVal<string>(self)))],
    ["isascii", (self: PyObject) => strIsascii(nativeVal<string>(self))],
    ["isalpha", (self: PyObject) => strIsalpha(nativeVal<string>(self))],
    ["isdigit", (self: PyObject) => strIsdigit(nativeVal<string>(self))],
    ["isalnum", (self: PyObject) => strIsalnum(nativeVal<string>(self))],
    ["islower", (self: PyObject) => strIslower(nativeVal<string>(self))],
    ["isupper", (self: PyObject) => strIsupper(nativeVal<string>(self))],
    ["istitle", (self: PyObject) => strIstitle(nativeVal<string>(self))],
    ["isspace", (self: PyObject) => strIsspace(nativeVal<string>(self))],
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
    ["rpartition", (self: PyObject, sep: unknown) =>
      rpartitionStr(nativeVal<string>(self), sep)],
    ["splitlines", (self: PyObject, keepends?: unknown) =>
      splitlinesStr(nativeVal<string>(self), keepends)],
    ["find", (self: PyObject, sub: unknown, start?: unknown, end?: unknown) =>
      findStr(nativeVal<string>(self), sub, start, end)],
    ["rfind", (self: PyObject, sub: unknown, start?: unknown, end?: unknown) =>
      rfindStr(nativeVal<string>(self), sub, start, end)],
    ["index", (self: PyObject, sub: unknown, start?: unknown, end?: unknown) =>
      indexStr(nativeVal<string>(self), sub, start, end)],
    ["rindex", (self: PyObject, sub: unknown, start?: unknown, end?: unknown) =>
      rindexStr(nativeVal<string>(self), sub, start, end)],
    ["count", (self: PyObject, sub: unknown, start?: unknown, end?: unknown) =>
      countStr(nativeVal<string>(self), sub, start, end)],
    ["startswith", (self: PyObject, prefix: unknown, start?: unknown, end?: unknown) =>
      strStartswith(nativeVal<string>(self), prefix, start, end)],
    ["endswith", (self: PyObject, suffix: unknown, start?: unknown, end?: unknown) =>
      strEndswith(nativeVal<string>(self), suffix, start, end)],
    ["replace", (self: PyObject, old: unknown, newStr: unknown, count?: unknown) =>
      replaceStr(nativeVal<string>(self), old, newStr, count)],
    ["removeprefix", (self: PyObject, prefix: unknown) =>
      removePrefixStr(nativeVal<string>(self), prefix)],
    ["removesuffix", (self: PyObject, suffix: unknown) =>
      removeSuffixStr(nativeVal<string>(self), suffix)],
    ["center", (self: PyObject, width: unknown, fill?: unknown) =>
      centerStr(nativeVal<string>(self), width, fill)],
    ["ljust", (self: PyObject, width: unknown, fill?: unknown) =>
      ljustStr(nativeVal<string>(self), width, fill)],
    ["rjust", (self: PyObject, width: unknown, fill?: unknown) =>
      rjustStr(nativeVal<string>(self), width, fill)],
    ["zfill", (self: PyObject, width: unknown) =>
      zfillStr(nativeVal<string>(self), width)],
    ["expandtabs", (self: PyObject, tabsize?: unknown) =>
      expandTabsStr(nativeVal<string>(self), tabsize)],
    ["maketrans", (_cls: unknown, frm: unknown, to: unknown) =>
      strMakeTrans(frm, to)],
    ["translate", (self: PyObject, table: unknown) =>
      strTranslate(nativeVal<string>(self), table)],
  ]),
});

export function pyStr(v: string): PyObject {
  const obj = new PyObject(strType);
  setNative(obj, v);
  return obj;
}
