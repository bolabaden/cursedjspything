import { PyObject, NotImplemented } from "../core/object.js";
import { Slot } from "../core/slots.js";
import { makeClass } from "../class/class.js";
import { nativeVal, setNative } from "./native.js";
import { sequenceRepeatCount } from "./int.js";

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
  ]),
});

export function pyBytes(v: Uint8Array): PyObject {
  const obj = new PyObject(bytesType);
  setNative(obj, v);
  return obj;
}
