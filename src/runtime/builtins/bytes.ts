import { PyObject, NotImplemented } from "../core/object.js";
import { Hook, Slot } from "../core/slots.js";
import { makeClass } from "../class/class.js";
import {
  PyIndexError,
  PyLookupError,
  PyTypeError,
  PyUnicodeDecodeError,
  PyValueError,
  PyStopIteration,
} from "../core/errors.js";
import { nativeVal, setNative } from "./native.js";
import { pyIndexAsInteger, pyInt, sequenceRepeatCount, intType } from "./int.js";
import { pyList } from "./list.js";
import { pyTrue, pyFalse, boolType } from "./bool.js";
import { tupleType, pyTuple } from "./tuple.js";
import { isSlice, sliceFields, sliceIndices } from "../collections/slice.js";
import { pyStr, strType } from "./str.js";
import { iter, next } from "../dispatch/protocols.js";
import { lookupSpecial } from "../core/lookup.js";
import { makeSequenceIterator } from "../iterators/sequence-iterator.js";
import { makeReversedIterator } from "../iterators/reversed-iterator.js";

function bytesData(self: PyObject): Uint8Array {
  return nativeVal<Uint8Array>(self);
}

function concatBytes(a: Uint8Array, b: Uint8Array): Uint8Array {
  const out = new Uint8Array(a.length + b.length);
  out.set(a, 0);
  out.set(b, a.length);
  return out;
}

function repeatBytes(data: Uint8Array, n: number): Uint8Array {
  if (n <= 0) return new Uint8Array(0);
  const out = new Uint8Array(data.length * n);
  for (let i = 0; i < n; i++) {
    out.set(data, i * data.length);
  }
  return out;
}

function repeatBytesSlot(self: PyObject, other: PyObject) {
  const n = sequenceRepeatCount(other);
  if (n === null) return NotImplemented;
  return pyBytes(repeatBytes(bytesData(self), n));
}

function bytesRepr(data: Uint8Array): string {
  let inner = "";
  for (const byte of data) {
    if (byte >= 32 && byte < 127 && byte !== 39 && byte !== 92) {
      inner += String.fromCharCode(byte);
    } else {
      inner += "\\x" + byte.toString(16).padStart(2, "0");
    }
  }
  return `b'${inner}'`;
}

function formatBytesSpec(data: Uint8Array, spec: string): string {
  if (spec === "") return bytesRepr(data);
  throw new PyTypeError("unsupported format string passed to bytes.__format__");
}

function compareBytes(a: Uint8Array, b: Uint8Array): number {
  const len = Math.min(a.length, b.length);
  for (let i = 0; i < len; i++) {
    if (a[i] !== b[i]) return a[i]! - b[i]!;
  }
  return a.length - b.length;
}

function normalizeEncodingName(raw: string): string {
  return raw.toLowerCase().replace(/_/g, "-");
}

function decodeEncodingArg(encoding: unknown): string {
  if (encoding === undefined || encoding === null) return "utf-8";
  if (encoding instanceof PyObject && encoding.type === strType) {
    return nativeVal<string>(encoding);
  }
  const kind =
    encoding instanceof PyObject ? encoding.type.name : typeof encoding;
  throw new PyTypeError(
    `decode() argument 'encoding' must be str, not ${kind}`,
  );
}

type DecodeErrors = "strict" | "replace" | "ignore" | "backslashreplace" | "surrogateescape";

const SURROGATE_ESCAPE_BASE = 0xdc00;
const SURROGATE_ESCAPE_MIN = 0xdc80;
const SURROGATE_ESCAPE_MAX = 0xdcff;

function decodeSurrogateEscapeByte(b: number): string {
  return String.fromCharCode(SURROGATE_ESCAPE_BASE + b);
}

function decodeErrorsArg(errors: unknown): DecodeErrors {
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
  throw new PyTypeError(`decode() argument 'errors' must be str, not ${kind}`);
}

function decodeUtf8SurrogateEscape(data: Uint8Array): string {
  let out = "";
  let i = 0;
  while (i < data.length) {
    const b = data[i]!;
    if (b <= 0x7f) {
      out += String.fromCharCode(b);
      i += 1;
      continue;
    }
    const end = endOfUtf8Sequence(data, i);
    if (end < 0) {
      out += decodeSurrogateEscapeByte(b);
      i += 1;
      continue;
    }
    try {
      out += new TextDecoder("utf-8", { fatal: true }).decode(data.subarray(i, end));
      i = end;
    } catch {
      out += decodeSurrogateEscapeByte(b);
      i += 1;
    }
  }
  return out;
}

function decodeUtf8BackslashReplace(data: Uint8Array): string {
  let out = "";
  let i = 0;
  while (i < data.length) {
    const b = data[i]!;
    if (b <= 0x7f) {
      out += String.fromCharCode(b);
      i += 1;
      continue;
    }
    const end = endOfUtf8Sequence(data, i);
    if (end < 0) {
      out += `\\x${b.toString(16).padStart(2, "0")}`;
      i += 1;
      continue;
    }
    try {
      out += new TextDecoder("utf-8", { fatal: true }).decode(data.subarray(i, end));
      i = end;
    } catch {
      out += `\\x${b.toString(16).padStart(2, "0")}`;
      i += 1;
    }
  }
  return out;
}

function decodeUtf8(data: Uint8Array, errors: DecodeErrors): string {
  if (errors === "backslashreplace") {
    return decodeUtf8BackslashReplace(data);
  }
  if (errors === "surrogateescape") {
    return decodeUtf8SurrogateEscape(data);
  }
  if (errors === "replace") {
    return new TextDecoder("utf-8", { fatal: false }).decode(data);
  }
  if (errors === "ignore") {
    let out = "";
    let i = 0;
    while (i < data.length) {
      const b = data[i]!;
      if (b <= 0x7f) {
        out += String.fromCharCode(b);
        i += 1;
        continue;
      }
      const end = endOfUtf8Sequence(data, i);
      if (end < 0) {
        i += 1;
        continue;
      }
      out += new TextDecoder("utf-8", { fatal: true }).decode(data.subarray(i, end));
      i = end;
    }
    return out;
  }
  try {
    return new TextDecoder("utf-8", { fatal: true }).decode(data);
  } catch {
    const pos = firstInvalidUtf8Index(data);
    const byte = pos >= 0 ? data[pos]! : 0xff;
    throw new PyUnicodeDecodeError(
      `'utf-8' codec can't decode byte 0x${byte.toString(16).padStart(2, "0")} in position ${Math.max(pos, 0)}: invalid start byte`,
    );
  }
}

function endOfUtf8Sequence(data: Uint8Array, start: number): number {
  const b = data[start]!;
  if (b <= 0x7f) return start + 1;
  if (b >= 0xc2 && b <= 0xdf) {
    if (start + 1 >= data.length || (data[start + 1]! & 0xc0) !== 0x80) return -1;
    return start + 2;
  }
  if (b >= 0xe0 && b <= 0xef) {
    if (
      start + 2 >= data.length ||
      (data[start + 1]! & 0xc0) !== 0x80 ||
      (data[start + 2]! & 0xc0) !== 0x80
    ) {
      return -1;
    }
    return start + 3;
  }
  if (b >= 0xf0 && b <= 0xf4) {
    if (
      start + 3 >= data.length ||
      (data[start + 1]! & 0xc0) !== 0x80 ||
      (data[start + 2]! & 0xc0) !== 0x80 ||
      (data[start + 3]! & 0xc0) !== 0x80
    ) {
      return -1;
    }
    return start + 4;
  }
  return -1;
}

function decodeAscii(data: Uint8Array, errors: DecodeErrors): string {
  let out = "";
  for (let i = 0; i < data.length; i++) {
    const b = data[i]!;
    if (b <= 0x7f) {
      out += String.fromCharCode(b);
    } else if (errors === "strict") {
      throw new PyUnicodeDecodeError(
        `'ascii' codec can't decode byte 0x${b.toString(16).padStart(2, "0")} in position ${i}: ordinal not in range(128)`,
      );
    } else if (errors === "replace") {
      out += "\ufffd";
    } else if (errors === "backslashreplace") {
      out += `\\x${b.toString(16).padStart(2, "0")}`;
    } else if (errors === "surrogateescape") {
      out += decodeSurrogateEscapeByte(b);
    }
  }
  return out;
}

function decodeBytesPayload(
  data: Uint8Array,
  encoding: string,
  errors: DecodeErrors,
): string {
  const enc = normalizeEncodingName(encoding);
  if (enc === "ascii") {
    return decodeAscii(data, errors);
  }
  if (enc === "latin-1" || enc === "latin1" || enc === "iso-8859-1") {
    let out = "";
    for (const byte of data) out += String.fromCharCode(byte);
    return out;
  }
  if (enc === "utf-8" || enc === "utf8") {
    return decodeUtf8(data, errors);
  }
  throw new PyLookupError(`unknown encoding: ${encoding}`);
}

function firstInvalidUtf8Index(data: Uint8Array): number {
  for (let i = 0; i < data.length; i++) {
    const b = data[i]!;
    if (b <= 0x7f) continue;
    if (b >= 0xc2 && b <= 0xdf) {
      if (i + 1 >= data.length || (data[i + 1]! & 0xc0) !== 0x80) return i;
      i += 1;
      continue;
    }
    if (b >= 0xe0 && b <= 0xef) {
      if (
        i + 2 >= data.length ||
        (data[i + 1]! & 0xc0) !== 0x80 ||
        (data[i + 2]! & 0xc0) !== 0x80
      ) {
        return i;
      }
      i += 2;
      continue;
    }
    if (b >= 0xf0 && b <= 0xf4) {
      if (
        i + 3 >= data.length ||
        (data[i + 1]! & 0xc0) !== 0x80 ||
        (data[i + 2]! & 0xc0) !== 0x80 ||
        (data[i + 3]! & 0xc0) !== 0x80
      ) {
        return i;
      }
      i += 3;
      continue;
    }
    return i;
  }
  return -1;
}

function joinBytes(sep: Uint8Array, iterable: unknown): PyObject {
  if (!(iterable instanceof PyObject)) {
    throw new PyTypeError("can only join an iterable");
  }
  const parts: Uint8Array[] = [];
  let total = 0;
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
    if (!(item instanceof PyObject) || item.type !== bytesType) {
      const kind =
        item instanceof PyObject ? item.type.name : typeof item;
      throw new PyTypeError(
        `sequence item ${index}: expected a bytes-like object, ${kind} found`,
      );
    }
    const part = bytesData(item);
    parts.push(part);
    total += part.length;
    index += 1;
  }
  if (parts.length === 0) return pyBytes(new Uint8Array(0));
  total += sep.length * (parts.length - 1);
  const out = new Uint8Array(total);
  let offset = 0;
  for (let i = 0; i < parts.length; i++) {
    if (i > 0) {
      out.set(sep, offset);
      offset += sep.length;
    }
    const part = parts[i]!;
    out.set(part, offset);
    offset += part.length;
  }
  return pyBytes(out);
}

function isAsciiWhitespace(byte: number): boolean {
  return byte === 0x09 || byte === 0x0a || byte === 0x0b || byte === 0x0c || byte === 0x0d || byte === 0x20;
}

function bytesIsWhitespaceOnly(data: Uint8Array): boolean {
  for (let i = 0; i < data.length; i++) {
    if (!isAsciiWhitespace(data[i]!)) return false;
  }
  return true;
}

function splitWhitespaceMaxsplitZero(data: Uint8Array): Uint8Array[] {
  return bytesIsWhitespaceOnly(data) ? [] : [data];
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

function splitSepArg(sep: unknown): Uint8Array | null {
  if (sep === undefined || sep === null) return null;
  if (sep instanceof PyObject && sep.type === bytesType) {
    return bytesData(sep);
  }
  const kind = sep instanceof PyObject ? sep.type.name : typeof sep;
  throw new PyTypeError(`a bytes-like object is required, not '${kind}'`);
}

function splitWithSep(
  data: Uint8Array,
  sep: Uint8Array,
  maxsplit: number,
): Uint8Array[] {
  if (sep.length === 0) {
    throw new PyValueError("empty separator");
  }
  if (maxsplit === 0) return [data];
  const parts: Uint8Array[] = [];
  let start = 0;
  let splits = 0;
  let i = 0;
  while (i <= data.length - sep.length) {
    let match = true;
    for (let j = 0; j < sep.length; j++) {
      if (data[i + j] !== sep[j]!) {
        match = false;
        break;
      }
    }
    if (match) {
      if (maxsplit >= 0 && splits >= maxsplit) break;
      parts.push(data.subarray(start, i));
      start = i + sep.length;
      i = start;
      splits += 1;
      continue;
    }
    i += 1;
  }
  parts.push(data.subarray(start));
  return parts;
}

function splitWhitespace(data: Uint8Array, maxsplit: number): Uint8Array[] {
  if (maxsplit === 0) return splitWhitespaceMaxsplitZero(data);
  const parts: Uint8Array[] = [];
  let i = 0;
  const n = data.length;
  while (i < n && isAsciiWhitespace(data[i]!)) i += 1;
  while (i < n) {
    const start = i;
    while (i < n && !isAsciiWhitespace(data[i]!)) i += 1;
    parts.push(data.subarray(start, i));
    if (maxsplit >= 0 && parts.length >= maxsplit) {
      while (i < n && isAsciiWhitespace(data[i]!)) i += 1;
      if (i < n) parts.push(data.subarray(i));
      return parts;
    }
    while (i < n && isAsciiWhitespace(data[i]!)) i += 1;
  }
  return parts;
}

function splitBytes(
  data: Uint8Array,
  sep: unknown,
  maxsplit: unknown,
): PyObject {
  const limit = splitMaxsplitArg(maxsplit);
  const sepData = splitSepArg(sep);
  const chunks =
    sepData === null
      ? splitWhitespace(data, limit)
      : splitWithSep(data, sepData, limit);
  return pyList(chunks.map((chunk) => pyBytes(chunk)));
}

function rsplitWithSep(
  data: Uint8Array,
  sep: Uint8Array,
  maxsplit: number,
): Uint8Array[] {
  if (sep.length === 0) {
    throw new PyValueError("empty separator");
  }
  if (maxsplit === 0) return [data];
  const parts: Uint8Array[] = [];
  let end = data.length;
  let splits = 0;
  while (true) {
    if (maxsplit >= 0 && splits >= maxsplit) break;
    let found = -1;
    for (let i = end - sep.length; i >= 0; i--) {
      let match = true;
      for (let j = 0; j < sep.length; j++) {
        if (data[i + j] !== sep[j]!) {
          match = false;
          break;
        }
      }
      if (match) {
        found = i;
        break;
      }
    }
    if (found < 0) break;
    parts.unshift(data.subarray(found + sep.length, end));
    end = found;
    splits += 1;
  }
  parts.unshift(data.subarray(0, end));
  return parts;
}

function rsplitWhitespace(data: Uint8Array, maxsplit: number): Uint8Array[] {
  if (maxsplit === 0) return splitWhitespaceMaxsplitZero(data);
  const parts: Uint8Array[] = [];
  let i = data.length;
  while (i > 0) {
    while (i > 0 && isAsciiWhitespace(data[i - 1]!)) i -= 1;
    if (i === 0) break;
    const end = i;
    while (i > 0 && !isAsciiWhitespace(data[i - 1]!)) i -= 1;
    parts.unshift(data.subarray(i, end));
    if (maxsplit >= 0 && parts.length >= maxsplit) {
      while (i > 0 && isAsciiWhitespace(data[i - 1]!)) i -= 1;
      if (i > 0) parts.unshift(data.subarray(0, i));
      return parts;
    }
  }
  return parts;
}

function rsplitBytes(
  data: Uint8Array,
  sep: unknown,
  maxsplit: unknown,
): PyObject {
  const limit = splitMaxsplitArg(maxsplit);
  const sepData = splitSepArg(sep);
  const chunks =
    sepData === null
      ? rsplitWhitespace(data, limit)
      : rsplitWithSep(data, sepData, limit);
  return pyList(chunks.map((chunk) => pyBytes(chunk)));
}

function parseBoundIndex(value: unknown, length: number): number {
  if (typeof value === "number") return value;
  if (value instanceof PyObject) {
    const n = pyIndexAsInteger(value);
    if (n !== null) return n;
  }
  const kind = value instanceof PyObject ? value.type.name : typeof value;
  throw new PyTypeError(`slice indices must be integers or None or have an __index__ method`);
}

function resolveBytesIndex(key: unknown, length: number): number {
  let n: number | null = null;
  if (typeof key === "number") {
    n = key;
  } else if (key instanceof PyObject) {
    n = pyIndexAsInteger(key);
  }
  if (n === null) {
    throw new PyTypeError("byte indices must be integers or slices");
  }
  const idx = n < 0 ? length + n : n;
  if (idx < 0 || idx >= length) {
    throw new PyIndexError("index out of range");
  }
  return idx;
}

function bytesSliceBounds(
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

function bytesAffixCandidates(
  affix: unknown,
  method: "startswith" | "endswith",
): Uint8Array[] {
  if (affix instanceof PyObject && affix.type === bytesType) {
    return [bytesData(affix)];
  }
  if (affix instanceof PyObject && affix.type === tupleType) {
    const items = nativeVal<readonly PyObject[]>(affix);
    const out: Uint8Array[] = [];
    for (const item of items) {
      if (item.type !== bytesType) {
        const kind = item.type.name;
        throw new PyTypeError(`a bytes-like object is required, not '${kind}'`);
      }
      out.push(bytesData(item));
    }
    return out;
  }
  const kind = affix instanceof PyObject ? affix.type.name : typeof affix;
  throw new PyTypeError(
    `${method} first arg must be bytes or a tuple of bytes, not ${kind}`,
  );
}

function bytesStartsWithSlice(slice: Uint8Array, prefix: Uint8Array): boolean {
  if (prefix.length > slice.length) return false;
  for (let i = 0; i < prefix.length; i++) {
    if (slice[i] !== prefix[i]) return false;
  }
  return true;
}

function bytesEndsWithSlice(slice: Uint8Array, suffix: Uint8Array): boolean {
  if (suffix.length > slice.length) return false;
  const offset = slice.length - suffix.length;
  for (let i = 0; i < suffix.length; i++) {
    if (slice[offset + i] !== suffix[i]) return false;
  }
  return true;
}

function requireAffixBytes(affix: unknown): Uint8Array {
  if (affix instanceof PyObject && affix.type === bytesType) {
    return bytesData(affix);
  }
  const kind = affix instanceof PyObject ? affix.type.name : typeof affix;
  throw new PyTypeError(`a bytes-like object is required, not '${kind}'`);
}

function removePrefixBytes(data: Uint8Array, prefix: unknown): PyObject {
  const pre = requireAffixBytes(prefix);
  if (bytesStartsWithSlice(data, pre)) {
    return pyBytes(data.subarray(pre.length));
  }
  return pyBytes(data);
}

function removeSuffixBytes(data: Uint8Array, suffix: unknown): PyObject {
  const suf = requireAffixBytes(suffix);
  if (bytesEndsWithSlice(data, suf)) {
    return pyBytes(data.subarray(0, data.length - suf.length));
  }
  return pyBytes(data);
}

function bytesStartswith(
  data: Uint8Array,
  prefix: unknown,
  start?: unknown,
  end?: unknown,
): PyObject {
  const [a, b] = bytesSliceBounds(data.length, start, end);
  const slice = data.subarray(a, b);
  const candidates = bytesAffixCandidates(prefix, "startswith");
  for (const candidate of candidates) {
    if (bytesStartsWithSlice(slice, candidate)) return pyTrue;
  }
  return pyFalse;
}

function bytesEndswith(
  data: Uint8Array,
  suffix: unknown,
  start?: unknown,
  end?: unknown,
): PyObject {
  const [a, b] = bytesSliceBounds(data.length, start, end);
  const slice = data.subarray(a, b);
  const candidates = bytesAffixCandidates(suffix, "endswith");
  for (const candidate of candidates) {
    if (bytesEndsWithSlice(slice, candidate)) return pyTrue;
  }
  return pyFalse;
}

const emptyBytes = new Uint8Array(0);

function requirePartitionSep(sep: unknown): Uint8Array {
  if (sep instanceof PyObject && sep.type === bytesType) {
    const data = bytesData(sep);
    if (data.length === 0) {
      throw new PyValueError("empty separator");
    }
    return data;
  }
  const kind = sep instanceof PyObject ? sep.type.name : typeof sep;
  throw new PyTypeError(`a bytes-like object is required, not '${kind}'`);
}

function requireFindSub(sub: unknown): Uint8Array {
  if (sub instanceof PyObject && sub.type === bytesType) {
    return bytesData(sub);
  }
  const kind = sub instanceof PyObject ? sub.type.name : typeof sub;
  throw new PyTypeError(
    `argument should be integer or bytes-like object, not '${kind}'`,
  );
}

function findSubInRange(
  data: Uint8Array,
  sub: Uint8Array,
  start: number,
  end: number,
  fromRight: boolean,
): number {
  if (start > end) return -1;
  if (sub.length === 0) {
    return fromRight ? end : start;
  }
  const slice = data.subarray(start, end);
  const rel = findSepIndex(slice, sub, fromRight);
  return rel < 0 ? -1 : rel + start;
}

function parseContainsByte(item: unknown): number | null {
  if (!(item instanceof PyObject)) return null;
  if (item.type === intType) {
    const n = nativeVal<number>(item);
    if (n < 0 || n > 255) {
      throw new PyValueError("byte must be in range(0, 256)");
    }
    return n;
  }
  const boolVal = sequenceRepeatCount(item);
  if (boolVal !== null) return boolVal;
  return null;
}

function bytesContains(data: Uint8Array, item: unknown): boolean {
  if (item instanceof PyObject && item.type === bytesType) {
    const sub = bytesData(item);
    return findSubInRange(data, sub, 0, data.length, false) >= 0;
  }
  const byte = parseContainsByte(item);
  if (byte !== null) {
    for (let i = 0; i < data.length; i++) {
      if (data[i] === byte) return true;
    }
    return false;
  }
  const kind = item instanceof PyObject ? item.type.name : typeof item;
  throw new PyTypeError(`a bytes-like object is required, not '${kind}'`);
}

function findBytes(
  data: Uint8Array,
  sub: unknown,
  start?: unknown,
  end?: unknown,
): PyObject {
  const subData = requireFindSub(sub);
  const [a, b] = bytesSliceBounds(data.length, start, end);
  return pyInt(findSubInRange(data, subData, a, b, false));
}

function rfindBytes(
  data: Uint8Array,
  sub: unknown,
  start?: unknown,
  end?: unknown,
): PyObject {
  const subData = requireFindSub(sub);
  const [a, b] = bytesSliceBounds(data.length, start, end);
  return pyInt(findSubInRange(data, subData, a, b, true));
}

function indexBytes(
  data: Uint8Array,
  sub: unknown,
  start?: unknown,
  end?: unknown,
): PyObject {
  const subData = requireFindSub(sub);
  const [a, b] = bytesSliceBounds(data.length, start, end);
  const idx = findSubInRange(data, subData, a, b, false);
  if (idx < 0) throw new PyValueError("subsection not found");
  return pyInt(idx);
}

function rindexBytes(
  data: Uint8Array,
  sub: unknown,
  start?: unknown,
  end?: unknown,
): PyObject {
  const subData = requireFindSub(sub);
  const [a, b] = bytesSliceBounds(data.length, start, end);
  const idx = findSubInRange(data, subData, a, b, true);
  if (idx < 0) throw new PyValueError("subsection not found");
  return pyInt(idx);
}

function countSubInRange(
  data: Uint8Array,
  sub: Uint8Array,
  start: number,
  end: number,
): number {
  if (start > end) return 0;
  if (sub.length === 0) return end - start + 1;
  let count = 0;
  let pos = start;
  while (pos <= end - sub.length) {
    const slice = data.subarray(pos, end);
    const rel = findSepIndex(slice, sub, false);
    if (rel < 0) break;
    count += 1;
    pos += rel + sub.length;
  }
  return count;
}

function countBytes(
  data: Uint8Array,
  sub: unknown,
  start?: unknown,
  end?: unknown,
): PyObject {
  const subData = requireFindSub(sub);
  const [a, b] = bytesSliceBounds(data.length, start, end);
  return pyInt(countSubInRange(data, subData, a, b));
}

function requireReplaceBytes(value: unknown): Uint8Array {
  if (value instanceof PyObject && value.type === bytesType) {
    return bytesData(value);
  }
  const kind = value instanceof PyObject ? value.type.name : typeof value;
  throw new PyTypeError(`a bytes-like object is required, not '${kind}'`);
}

function concatByteChunks(chunks: readonly Uint8Array[]): Uint8Array {
  let total = 0;
  for (const chunk of chunks) total += chunk.length;
  const out = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    out.set(chunk, offset);
    offset += chunk.length;
  }
  return out;
}

function replaceEmptyOld(
  data: Uint8Array,
  newBytes: Uint8Array,
  limit: number,
): Uint8Array {
  if (limit === 0) return data;
  const maxInserts = limit < 0 ? data.length + 1 : limit;
  const chunks: Uint8Array[] = [];
  let inserted = 0;
  for (let i = 0; i < data.length; i++) {
    if (inserted < maxInserts) {
      chunks.push(newBytes);
      inserted += 1;
    }
    chunks.push(data.subarray(i, i + 1));
  }
  if (inserted < maxInserts) {
    chunks.push(newBytes);
  }
  return concatByteChunks(chunks);
}

function replaceNonEmptyOld(
  data: Uint8Array,
  old: Uint8Array,
  newBytes: Uint8Array,
  limit: number,
): Uint8Array {
  if (limit === 0) return data;
  const maxReplacements = limit < 0 ? Number.POSITIVE_INFINITY : limit;
  const chunks: Uint8Array[] = [];
  let pos = 0;
  let done = 0;
  while (pos < data.length) {
    const rel = findSepIndex(data.subarray(pos), old, false);
    if (rel < 0 || done >= maxReplacements) {
      chunks.push(data.subarray(pos));
      break;
    }
    const idx = pos + rel;
    chunks.push(data.subarray(pos, idx));
    chunks.push(newBytes);
    pos = idx + old.length;
    done += 1;
  }
  return concatByteChunks(chunks);
}

function replaceBytes(
  data: Uint8Array,
  old: unknown,
  newBytes: unknown,
  count?: unknown,
): PyObject {
  const oldData = requireReplaceBytes(old);
  const newData = requireReplaceBytes(newBytes);
  const limit = splitMaxsplitArg(count);
  const out =
    oldData.length === 0
      ? replaceEmptyOld(data, newData, limit)
      : replaceNonEmptyOld(data, oldData, newData, limit);
  return pyBytes(out);
}

function bytesUpper(data: Uint8Array): PyObject {
  const out = new Uint8Array(data.length);
  for (let i = 0; i < data.length; i++) {
    const b = data[i]!;
    out[i] = b >= 0x61 && b <= 0x7a ? b - 0x20 : b;
  }
  return pyBytes(out);
}

function bytesLower(data: Uint8Array): PyObject {
  const out = new Uint8Array(data.length);
  for (let i = 0; i < data.length; i++) {
    const b = data[i]!;
    out[i] = b >= 0x41 && b <= 0x5a ? b + 0x20 : b;
  }
  return pyBytes(out);
}

function bytesCapitalize(data: Uint8Array): PyObject {
  if (data.length === 0) return pyBytes(data);
  const out = new Uint8Array(data.length);
  let b = data[0]!;
  out[0] = b >= 0x61 && b <= 0x7a ? b - 0x20 : b;
  for (let i = 1; i < data.length; i++) {
    b = data[i]!;
    out[i] = b >= 0x41 && b <= 0x5a ? b + 0x20 : b;
  }
  return pyBytes(out);
}

function bytesTitle(data: Uint8Array): PyObject {
  const out = new Uint8Array(data.length);
  let newWord = true;
  for (let i = 0; i < data.length; i++) {
    const b = data[i]!;
    if (b >= 0x61 && b <= 0x7a) {
      out[i] = newWord ? b - 0x20 : b;
      newWord = false;
    } else if (b >= 0x41 && b <= 0x5a) {
      out[i] = newWord ? b : b + 0x20;
      newWord = false;
    } else {
      out[i] = b;
      newWord = true;
    }
  }
  return pyBytes(out);
}

function bytesSwapcase(data: Uint8Array): PyObject {
  const out = new Uint8Array(data.length);
  for (let i = 0; i < data.length; i++) {
    const b = data[i]!;
    if (b >= 0x61 && b <= 0x7a) out[i] = b - 0x20;
    else if (b >= 0x41 && b <= 0x5a) out[i] = b + 0x20;
    else out[i] = b;
  }
  return pyBytes(out);
}

function bytesIsalpha(data: Uint8Array): PyObject {
  if (data.length === 0) return pyFalse;
  for (let i = 0; i < data.length; i++) {
    const b = data[i]!;
    if (b < 0x41 || (b > 0x5a && b < 0x61) || b > 0x7a) return pyFalse;
  }
  return pyTrue;
}

function bytesIsdigit(data: Uint8Array): PyObject {
  if (data.length === 0) return pyFalse;
  for (let i = 0; i < data.length; i++) {
    const b = data[i]!;
    if (b < 0x30 || b > 0x39) return pyFalse;
  }
  return pyTrue;
}

function bytesIsalnum(data: Uint8Array): PyObject {
  if (data.length === 0) return pyFalse;
  for (let i = 0; i < data.length; i++) {
    const b = data[i]!;
    const isAlpha =
      (b >= 0x41 && b <= 0x5a) || (b >= 0x61 && b <= 0x7a);
    const isDigit = b >= 0x30 && b <= 0x39;
    if (!isAlpha && !isDigit) return pyFalse;
  }
  return pyTrue;
}

function bytesIslower(data: Uint8Array): PyObject {
  if (data.length === 0) return pyFalse;
  let cased = false;
  for (let i = 0; i < data.length; i++) {
    const b = data[i]!;
    if (b >= 0x61 && b <= 0x7a) cased = true;
    else if (b >= 0x41 && b <= 0x5a) return pyFalse;
  }
  return cased ? pyTrue : pyFalse;
}

function bytesIsupper(data: Uint8Array): PyObject {
  if (data.length === 0) return pyFalse;
  let cased = false;
  for (let i = 0; i < data.length; i++) {
    const b = data[i]!;
    if (b >= 0x41 && b <= 0x5a) cased = true;
    else if (b >= 0x61 && b <= 0x7a) return pyFalse;
  }
  return cased ? pyTrue : pyFalse;
}

function bytesIstitle(data: Uint8Array): PyObject {
  if (data.length === 0) return pyFalse;
  const titled = bytesData(bytesTitle(data));
  for (let i = 0; i < data.length; i++) {
    if (data[i] !== titled[i]) return pyFalse;
  }
  return pyTrue;
}

function bytesIsspace(data: Uint8Array): PyObject {
  if (data.length === 0) return pyFalse;
  for (let i = 0; i < data.length; i++) {
    const b = data[i]!;
    if (
      b !== 0x20 &&
      b !== 0x09 &&
      b !== 0x0a &&
      b !== 0x0b &&
      b !== 0x0c &&
      b !== 0x0d
    ) {
      return pyFalse;
    }
  }
  return pyTrue;
}

function bytesIsascii(data: Uint8Array): PyObject {
  for (let i = 0; i < data.length; i++) {
    if (data[i]! > 0x7f) return pyFalse;
  }
  return pyTrue;
}

function requirePadFill(method: string, fill: unknown): number {
  if (fill === undefined || fill === null) return 0x20;
  if (fill instanceof PyObject && fill.type === bytesType) {
    const data = bytesData(fill);
    if (data.length !== 1) {
      throw new PyTypeError(
        `${method}(): argument 2 must be a byte string of length 1, not a bytes object of length ${data.length}`,
      );
    }
    return data[0]!;
  }
  const kind = fill instanceof PyObject ? fill.type.name : typeof fill;
  throw new PyTypeError(`a bytes-like object is required, not '${kind}'`);
}

function centerBytes(
  data: Uint8Array,
  width: unknown,
  fill?: unknown,
): PyObject {
  const w = splitMaxsplitArg(width);
  if (w <= data.length) return pyBytes(data);
  const fillByte = requirePadFill("center", fill);
  const pad = w - data.length;
  const left = Math.floor(pad / 2);
  const out = new Uint8Array(w);
  out.fill(fillByte, 0, left);
  out.set(data, left);
  out.fill(fillByte, left + data.length, w);
  return pyBytes(out);
}

function ljustBytes(
  data: Uint8Array,
  width: unknown,
  fill?: unknown,
): PyObject {
  const w = splitMaxsplitArg(width);
  if (w <= data.length) return pyBytes(data);
  const fillByte = requirePadFill("ljust", fill);
  const out = new Uint8Array(w);
  out.set(data, 0);
  out.fill(fillByte, data.length, w);
  return pyBytes(out);
}

function rjustBytes(
  data: Uint8Array,
  width: unknown,
  fill?: unknown,
): PyObject {
  const w = splitMaxsplitArg(width);
  if (w <= data.length) return pyBytes(data);
  const fillByte = requirePadFill("rjust", fill);
  const pad = w - data.length;
  const out = new Uint8Array(w);
  out.fill(fillByte, 0, pad);
  out.set(data, pad);
  return pyBytes(out);
}

const HEX_DIGITS = "0123456789abcdef";

function hexCharValue(c: string): number {
  const code = c.charCodeAt(0);
  if (code >= 0x30 && code <= 0x39) return code - 0x30;
  if (code >= 0x61 && code <= 0x66) return code - 0x61 + 10;
  if (code >= 0x41 && code <= 0x46) return code - 0x41 + 10;
  return -1;
}

function isHexWhitespace(c: string): boolean {
  return c === " " || c === "\t" || c === "\n" || c === "\r" || c === "\f" || c === "\v";
}

function requireFromhexArg(arg: unknown): string {
  if (arg instanceof PyObject && arg.type === strType) {
    return nativeVal<string>(arg);
  }
  if (arg instanceof PyObject && arg.type === bytesType) {
    const data = bytesData(arg);
    return String.fromCharCode(...data);
  }
  const kind = arg instanceof PyObject ? arg.type.name : typeof arg;
  throw new PyTypeError(`fromhex() argument must be str or bytes-like, not '${kind}'`);
}

function bytesFromhex(arg: unknown): PyObject {
  const text = requireFromhexArg(arg);
  const nybbles: number[] = [];
  for (let i = 0; i < text.length; i++) {
    const c = text[i]!;
    if (isHexWhitespace(c)) continue;
    const n = hexCharValue(c);
    if (n < 0) {
      throw new PyValueError(
        `non-hexadecimal number found in fromhex() arg at position ${i}`,
      );
    }
    nybbles.push(n);
  }
  if (nybbles.length % 2 !== 0) {
    throw new PyValueError(
      "fromhex() arg must contain an even number of hexadecimal digits",
    );
  }
  const out = new Uint8Array(nybbles.length / 2);
  for (let i = 0; i < out.length; i++) {
    out[i] = (nybbles[i * 2]! << 4) | nybbles[i * 2 + 1]!;
  }
  return pyBytes(out);
}

function requireHexSep(sep: unknown): number {
  if (sep === undefined || sep === null) return -1;
  if (sep instanceof PyObject && sep.type === bytesType) {
    const data = bytesData(sep);
    if (data.length !== 1) {
      throw new PyValueError("sep must be length 1.");
    }
    return data[0]!;
  }
  const kind = sep instanceof PyObject ? sep.type.name : typeof sep;
  throw new PyTypeError(`object of type '${kind}' has no len()`);
}

function bytesHex(data: Uint8Array, sep?: unknown): PyObject {
  const sepByte = requireHexSep(sep);
  if (sepByte < 0) {
    let out = "";
    for (let i = 0; i < data.length; i++) {
      const b = data[i]!;
      out += HEX_DIGITS[b >> 4]! + HEX_DIGITS[b & 0x0f]!;
    }
    return pyStr(out);
  }
  const sepChar = String.fromCharCode(sepByte);
  const parts: string[] = [];
  for (let i = 0; i < data.length; i++) {
    const b = data[i]!;
    parts.push(HEX_DIGITS[b >> 4]! + HEX_DIGITS[b & 0x0f]!);
  }
  return pyStr(parts.join(sepChar));
}

function bytesMakeTrans(frm: unknown, to: unknown): PyObject {
  const fromData = requireAffixBytes(frm);
  const toData = requireAffixBytes(to);
  if (fromData.length !== toData.length) {
    throw new PyValueError("maketrans arguments must have same length");
  }
  const table = new Uint8Array(256);
  for (let i = 0; i < 256; i++) table[i] = i;
  for (let i = 0; i < fromData.length; i++) {
    table[fromData[i]!] = toData[i]!;
  }
  return pyBytes(table);
}

function bytesTranslate(data: Uint8Array, table: unknown): PyObject {
  const tab = requireAffixBytes(table);
  if (tab.length !== 256) {
    throw new PyValueError("translation table must be 256 characters long");
  }
  const out = new Uint8Array(data.length);
  for (let i = 0; i < data.length; i++) {
    out[i] = tab[data[i]!]!;
  }
  return pyBytes(out);
}

function parseExpandtabsTabsize(tabsize: unknown): number {
  if (tabsize === undefined || tabsize === null) return 8;
  return splitMaxsplitArg(tabsize);
}

function expandTabsBytes(data: Uint8Array, tabsize?: unknown): PyObject {
  const size = parseExpandtabsTabsize(tabsize);
  const out: number[] = [];
  let col = 0;
  for (let i = 0; i < data.length; i++) {
    const b = data[i]!;
    if (b === 0x09) {
      if (size > 0) {
        const pad = col % size === 0 ? size : size - (col % size);
        for (let j = 0; j < pad; j++) out.push(0x20);
        col += pad;
      }
    } else {
      out.push(b);
      col++;
    }
  }
  return pyBytes(new Uint8Array(out));
}

function zfillBytes(data: Uint8Array, width: unknown): PyObject {
  const w = splitMaxsplitArg(width);
  if (w <= data.length) return pyBytes(data);
  const pad = w - data.length;
  let signLen = 0;
  if (data.length > 0) {
    const b = data[0]!;
    if (b === 0x2b || b === 0x2d) signLen = 1;
  }
  const out = new Uint8Array(w);
  if (signLen === 1) {
    out[0] = data[0]!;
    out.fill(0x30, 1, 1 + pad);
    out.set(data.subarray(1), 1 + pad);
  } else {
    out.fill(0x30, 0, pad);
    out.set(data, pad);
  }
  return pyBytes(out);
}

function findSepIndex(
  data: Uint8Array,
  sep: Uint8Array,
  fromRight: boolean,
): number {
  if (fromRight) {
    for (let i = data.length - sep.length; i >= 0; i--) {
      let match = true;
      for (let j = 0; j < sep.length; j++) {
        if (data[i + j] !== sep[j]!) {
          match = false;
          break;
        }
      }
      if (match) return i;
    }
    return -1;
  }
  for (let i = 0; i <= data.length - sep.length; i++) {
    let match = true;
    for (let j = 0; j < sep.length; j++) {
      if (data[i + j] !== sep[j]!) {
        match = false;
        break;
      }
    }
    if (match) return i;
  }
  return -1;
}

function partitionBytes(data: Uint8Array, sep: unknown): PyObject {
  const sepData = requirePartitionSep(sep);
  const idx = findSepIndex(data, sepData, false);
  if (idx < 0) {
    return pyTuple([
      pyBytes(data),
      pyBytes(emptyBytes),
      pyBytes(emptyBytes),
    ]);
  }
  return pyTuple([
    pyBytes(data.subarray(0, idx)),
    pyBytes(sepData),
    pyBytes(data.subarray(idx + sepData.length)),
  ]);
}

function rpartitionBytes(data: Uint8Array, sep: unknown): PyObject {
  const sepData = requirePartitionSep(sep);
  const idx = findSepIndex(data, sepData, true);
  if (idx < 0) {
    return pyTuple([
      pyBytes(emptyBytes),
      pyBytes(emptyBytes),
      pyBytes(data),
    ]);
  }
  return pyTuple([
    pyBytes(data.subarray(0, idx)),
    pyBytes(sepData),
    pyBytes(data.subarray(idx + sepData.length)),
  ]);
}

function lineBreakLength(data: Uint8Array, i: number): number {
  if (i >= data.length) return 0;
  const b = data[i]!;
  if (b === 0x0d) {
    if (i + 1 < data.length && data[i + 1] === 0x0a) return 2;
    return 1;
  }
  if (b === 0x0a) return 1;
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

function splitlinesBytes(data: Uint8Array, keepends: unknown): PyObject {
  if (data.length === 0) return pyList([]);
  const keep = parseSplitlinesKeepends(keepends);
  const parts: Uint8Array[] = [];
  let start = 0;
  let i = 0;
  while (i < data.length) {
    const lb = lineBreakLength(data, i);
    if (lb > 0) {
      const end = keep ? i + lb : i;
      parts.push(data.subarray(start, end));
      i += lb;
      start = i;
      continue;
    }
    i += 1;
  }
  if (start < data.length) {
    parts.push(data.subarray(start));
  }
  return pyList(parts.map((chunk) => pyBytes(chunk)));
}

function stripPredicate(chars: unknown): (byte: number) => boolean {
  if (chars === undefined || chars === null) return isAsciiWhitespace;
  if (chars instanceof PyObject && chars.type === bytesType) {
    const data = bytesData(chars);
    if (data.length === 0) return () => false;
    const set = new Set<number>(data);
    return (byte) => set.has(byte);
  }
  const kind = chars instanceof PyObject ? chars.type.name : typeof chars;
  throw new PyTypeError(`a bytes-like object is required, not '${kind}'`);
}

function stripBytes(
  data: Uint8Array,
  chars: unknown,
  side: "both" | "left" | "right",
): PyObject {
  const shouldStrip = stripPredicate(chars);
  let start = 0;
  let end = data.length;
  if (side === "both" || side === "left") {
    while (start < end && shouldStrip(data[start]!)) start += 1;
  }
  if (side === "both" || side === "right") {
    while (end > start && shouldStrip(data[end - 1]!)) end -= 1;
  }
  return pyBytes(data.subarray(start, end));
}

// ── pyBytes ───────────────────────────────────────────────────────────

export const bytesType = makeClass({
  name: "bytes",
  dict: new Map<string | symbol, unknown>([
    [Slot.repr, (self: PyObject) => bytesRepr(bytesData(self))],
    [Slot.str, (self: PyObject) => bytesRepr(bytesData(self))],
    [Hook.format, (self: PyObject, spec: string) =>
      formatBytesSpec(bytesData(self), spec)],
    [Hook.bytes, (self: PyObject) => self],
    [Slot.len, (self: PyObject) => bytesData(self).length],
    [Slot.bool, (self: PyObject) => bytesData(self).length > 0],
    [Slot.hash, (self: PyObject) => {
      const data = bytesData(self);
      let h = 0;
      for (let i = 0; i < data.length; i++) {
        h = (Math.imul(31, h) + data[i]!) | 0;
      }
      return h;
    }],
    [Slot.eq, (self: PyObject, other: PyObject) => {
      if (other.type !== bytesType) return NotImplemented;
      const a = bytesData(self);
      const b = bytesData(other);
      if (a.length !== b.length) return false;
      for (let i = 0; i < a.length; i++) {
        if (a[i] !== b[i]) return false;
      }
      return true;
    }],
    [Slot.ne, (self: PyObject, other: PyObject) => {
      if (other.type !== bytesType) return NotImplemented;
      return compareBytes(bytesData(self), bytesData(other)) !== 0;
    }],
    [Slot.lt, (self: PyObject, other: PyObject) => {
      if (other.type !== bytesType) return NotImplemented;
      return compareBytes(bytesData(self), bytesData(other)) < 0;
    }],
    [Slot.le, (self: PyObject, other: PyObject) => {
      if (other.type !== bytesType) return NotImplemented;
      return compareBytes(bytesData(self), bytesData(other)) <= 0;
    }],
    [Slot.gt, (self: PyObject, other: PyObject) => {
      if (other.type !== bytesType) return NotImplemented;
      return compareBytes(bytesData(self), bytesData(other)) > 0;
    }],
    [Slot.ge, (self: PyObject, other: PyObject) => {
      if (other.type !== bytesType) return NotImplemented;
      return compareBytes(bytesData(self), bytesData(other)) >= 0;
    }],
    [Slot.getitem, (self: PyObject, key: unknown) => {
      const data = bytesData(self);
      if (isSlice(key)) {
        const { start, stop, step } = sliceFields(key);
        const indices = sliceIndices(data.length, start, stop, step);
        const out = new Uint8Array(indices.length);
        for (let i = 0; i < indices.length; i++) {
          out[i] = data[indices[i]!]!;
        }
        return pyBytes(out);
      }
      const idx = resolveBytesIndex(key, data.length);
      return pyInt(data[idx]!);
    }],
    [Slot.iter, (self: PyObject) => makeSequenceIterator(self)],
    [Hook.reversed, (self: PyObject) => {
      const lenFn = lookupSpecial(self, Slot.len);
      const giFn = lookupSpecial(self, Slot.getitem);
      if (!lenFn || !giFn) {
        throw new PyTypeError("'bytes' object is not reversible");
      }
      return makeReversedIterator(self, lenFn, giFn);
    }],
    [Slot.contains, (self: PyObject, item: unknown) => {
      return bytesContains(bytesData(self), item);
    }],
    [Slot.add, (self: PyObject, other: PyObject) => {
      if (other.type !== bytesType) return NotImplemented;
      return pyBytes(concatBytes(bytesData(self), bytesData(other)));
    }],
    [Slot.mul, repeatBytesSlot],
    [Slot.rmul, repeatBytesSlot],
    ["decode", (self: PyObject, encoding?: unknown, errors?: unknown) => {
      const enc = decodeEncodingArg(encoding);
      const errMode = decodeErrorsArg(errors);
      const text = decodeBytesPayload(bytesData(self), enc, errMode);
      return pyStr(text);
    }],
    ["fromhex", (_cls: unknown, string: unknown) => {
      return bytesFromhex(string);
    }],
    ["maketrans", (_cls: unknown, frm: unknown, to: unknown) => {
      return bytesMakeTrans(frm, to);
    }],
    ["join", (self: PyObject, iterable: unknown) => {
      return joinBytes(bytesData(self), iterable);
    }],
    ["split", (self: PyObject, sep?: unknown, maxsplit?: unknown) => {
      return splitBytes(bytesData(self), sep, maxsplit);
    }],
    ["rsplit", (self: PyObject, sep?: unknown, maxsplit?: unknown) => {
      return rsplitBytes(bytesData(self), sep, maxsplit);
    }],
    ["startswith", (self: PyObject, prefix: unknown, start?: unknown, end?: unknown) => {
      return bytesStartswith(bytesData(self), prefix, start, end);
    }],
    ["endswith", (self: PyObject, suffix: unknown, start?: unknown, end?: unknown) => {
      return bytesEndswith(bytesData(self), suffix, start, end);
    }],
    ["removeprefix", (self: PyObject, prefix: unknown) => {
      return removePrefixBytes(bytesData(self), prefix);
    }],
    ["removesuffix", (self: PyObject, suffix: unknown) => {
      return removeSuffixBytes(bytesData(self), suffix);
    }],
    ["partition", (self: PyObject, sep: unknown) => {
      return partitionBytes(bytesData(self), sep);
    }],
    ["rpartition", (self: PyObject, sep: unknown) => {
      return rpartitionBytes(bytesData(self), sep);
    }],
    ["splitlines", (self: PyObject, keepends?: unknown) => {
      return splitlinesBytes(bytesData(self), keepends);
    }],
    ["strip", (self: PyObject, chars?: unknown) => {
      return stripBytes(bytesData(self), chars, "both");
    }],
    ["lstrip", (self: PyObject, chars?: unknown) => {
      return stripBytes(bytesData(self), chars, "left");
    }],
    ["rstrip", (self: PyObject, chars?: unknown) => {
      return stripBytes(bytesData(self), chars, "right");
    }],
    ["expandtabs", (self: PyObject, tabsize?: unknown) => {
      return expandTabsBytes(bytesData(self), tabsize);
    }],
    ["hex", (self: PyObject, sep?: unknown) => {
      return bytesHex(bytesData(self), sep);
    }],
    ["translate", (self: PyObject, table: unknown) => {
      return bytesTranslate(bytesData(self), table);
    }],
    ["find", (self: PyObject, sub: unknown, start?: unknown, end?: unknown) => {
      return findBytes(bytesData(self), sub, start, end);
    }],
    ["rfind", (self: PyObject, sub: unknown, start?: unknown, end?: unknown) => {
      return rfindBytes(bytesData(self), sub, start, end);
    }],
    ["index", (self: PyObject, sub: unknown, start?: unknown, end?: unknown) => {
      return indexBytes(bytesData(self), sub, start, end);
    }],
    ["rindex", (self: PyObject, sub: unknown, start?: unknown, end?: unknown) => {
      return rindexBytes(bytesData(self), sub, start, end);
    }],
    ["count", (self: PyObject, sub: unknown, start?: unknown, end?: unknown) => {
      return countBytes(bytesData(self), sub, start, end);
    }],
    ["replace", (self: PyObject, old: unknown, newBytes: unknown, count?: unknown) => {
      return replaceBytes(bytesData(self), old, newBytes, count);
    }],
    ["upper", (self: PyObject) => {
      return bytesUpper(bytesData(self));
    }],
    ["lower", (self: PyObject) => {
      return bytesLower(bytesData(self));
    }],
    ["capitalize", (self: PyObject) => {
      return bytesCapitalize(bytesData(self));
    }],
    ["title", (self: PyObject) => {
      return bytesTitle(bytesData(self));
    }],
    ["swapcase", (self: PyObject) => {
      return bytesSwapcase(bytesData(self));
    }],
    ["isalpha", (self: PyObject) => {
      return bytesIsalpha(bytesData(self));
    }],
    ["isdigit", (self: PyObject) => {
      return bytesIsdigit(bytesData(self));
    }],
    ["isalnum", (self: PyObject) => {
      return bytesIsalnum(bytesData(self));
    }],
    ["islower", (self: PyObject) => {
      return bytesIslower(bytesData(self));
    }],
    ["isupper", (self: PyObject) => {
      return bytesIsupper(bytesData(self));
    }],
    ["istitle", (self: PyObject) => {
      return bytesIstitle(bytesData(self));
    }],
    ["isspace", (self: PyObject) => {
      return bytesIsspace(bytesData(self));
    }],
    ["isascii", (self: PyObject) => {
      return bytesIsascii(bytesData(self));
    }],
    ["center", (self: PyObject, width: unknown, fill?: unknown) => {
      return centerBytes(bytesData(self), width, fill);
    }],
    ["ljust", (self: PyObject, width: unknown, fill?: unknown) => {
      return ljustBytes(bytesData(self), width, fill);
    }],
    ["rjust", (self: PyObject, width: unknown, fill?: unknown) => {
      return rjustBytes(bytesData(self), width, fill);
    }],
    ["zfill", (self: PyObject, width: unknown) => {
      return zfillBytes(bytesData(self), width);
    }],
  ]),
});

export function pyBytes(v: Uint8Array): PyObject {
  const obj = new PyObject(bytesType);
  setNative(obj, v);
  return obj;
}
