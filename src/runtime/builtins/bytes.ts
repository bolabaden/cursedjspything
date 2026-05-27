import { PyObject, NotImplemented } from "../core/object.js";
import { Slot } from "../core/slots.js";
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
import { pyInt, sequenceRepeatCount } from "./int.js";
import { isSlice, sliceFields, sliceIndices } from "../collections/slice.js";
import { pyStr, strType } from "./str.js";
import { iter, next } from "../dispatch/protocols.js";

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

function decodeErrorsArg(errors: unknown): "strict" | "replace" | "ignore" {
  if (errors === undefined || errors === null) return "strict";
  if (errors instanceof PyObject && errors.type === strType) {
    const name = nativeVal<string>(errors);
    if (name === "strict" || name === "replace" || name === "ignore") {
      return name;
    }
    throw new PyValueError(`unknown errors handler: '${name}'`);
  }
  const kind = errors instanceof PyObject ? errors.type.name : typeof errors;
  throw new PyTypeError(`decode() argument 'errors' must be str, not ${kind}`);
}

function decodeUtf8(data: Uint8Array, errors: "strict" | "replace" | "ignore"): string {
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

function decodeBytesPayload(
  data: Uint8Array,
  encoding: string,
  errors: "strict" | "replace" | "ignore",
): string {
  const enc = normalizeEncodingName(encoding);
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

// ── pyBytes ───────────────────────────────────────────────────────────

export const bytesType = makeClass({
  name: "bytes",
  dict: new Map<string | symbol, unknown>([
    [Slot.repr, (self: PyObject) => bytesRepr(bytesData(self))],
    [Slot.str, (self: PyObject) => bytesRepr(bytesData(self))],
    [Slot.len, (self: PyObject) => bytesData(self).length],
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
      if (typeof key === "number") {
        const idx = key < 0 ? data.length + key : key;
        if (idx < 0 || idx >= data.length) {
          throw new PyIndexError("index out of range");
        }
        return pyInt(data[idx]!);
      }
      throw new PyTypeError("byte indices must be integers or slices");
    }],
    [Slot.add, (self: PyObject, other: PyObject) => {
      if (other.type !== bytesType) return NotImplemented;
      return pyBytes(concatBytes(bytesData(self), bytesData(other)));
    }],
    [Slot.mul, (self: PyObject, other: PyObject) => {
      const n = sequenceRepeatCount(other);
      if (n === null) return NotImplemented;
      return pyBytes(repeatBytes(bytesData(self), n));
    }],
    [Slot.rmul, (self: PyObject, other: PyObject) => {
      const n = sequenceRepeatCount(other);
      if (n === null) return NotImplemented;
      return pyBytes(repeatBytes(bytesData(self), n));
    }],
    ["decode", (self: PyObject, encoding?: unknown, errors?: unknown) => {
      const enc = decodeEncodingArg(encoding);
      const errMode = decodeErrorsArg(errors);
      const text = decodeBytesPayload(bytesData(self), enc, errMode);
      return pyStr(text);
    }],
    ["join", (self: PyObject, iterable: unknown) => {
      return joinBytes(bytesData(self), iterable);
    }],
  ]),
});

export function pyBytes(v: Uint8Array): PyObject {
  const obj = new PyObject(bytesType);
  setNative(obj, v);
  return obj;
}
