import { PyObject, NotImplemented } from "../core/object.js";
import { Slot } from "../core/slots.js";
import { makeClass } from "../class/class.js";
import {
  PyIndexError,
  PyLookupError,
  PyTypeError,
  PyUnicodeDecodeError,
} from "../core/errors.js";
import { nativeVal, setNative } from "./native.js";
import { pyInt, sequenceRepeatCount } from "./int.js";
import { isSlice, sliceFields, sliceIndices } from "../collections/slice.js";
import { pyStr, strType } from "./str.js";

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

function decodeBytesPayload(data: Uint8Array, encoding: string): string {
  const enc = normalizeEncodingName(encoding);
  if (enc === "latin-1" || enc === "latin1" || enc === "iso-8859-1") {
    let out = "";
    for (const byte of data) out += String.fromCharCode(byte);
    return out;
  }
  if (enc === "utf-8" || enc === "utf8") {
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
    ["decode", (self: PyObject, encoding?: unknown) => {
      const enc = decodeEncodingArg(encoding);
      const text = decodeBytesPayload(bytesData(self), enc);
      return pyStr(text);
    }],
  ]),
});

export function pyBytes(v: Uint8Array): PyObject {
  const obj = new PyObject(bytesType);
  setNative(obj, v);
  return obj;
}
