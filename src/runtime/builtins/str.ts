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

type EncodeErrors = "strict" | "replace" | "ignore" | "backslashreplace";

function encodeErrorsArg(errors: unknown): EncodeErrors {
  if (errors === undefined || errors === null) return "strict";
  if (errors instanceof PyObject && errors.type === strType) {
    const name = nativeVal<string>(errors);
    if (
      name === "strict" ||
      name === "replace" ||
      name === "ignore" ||
      name === "backslashreplace"
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
    if (cp <= max) {
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
  ]),
});

export function pyStr(v: string): PyObject {
  const obj = new PyObject(strType);
  setNative(obj, v);
  return obj;
}
