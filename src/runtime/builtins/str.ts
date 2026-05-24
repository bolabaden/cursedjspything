import { PyObject, NotImplemented } from "../core/object.js";
import { Slot, Hook } from "../core/slots.js";
import { makeClass } from "../class/class.js";
import { PyStopIteration } from "../core/lookup.js";
import { PyTypeError, PyIndexError } from "../core/errors.js";
import { nativeVal, setNative } from "./native.js";
import { sequenceRepeatCount } from "./int.js";

function repeatStr(self: PyObject, other: PyObject) {
  const n = sequenceRepeatCount(other);
  if (n === null) return NotImplemented;
  return pyStr(nativeVal<string>(self).repeat(n));
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
    [Hook.bytes, (self: PyObject) => {
      return new TextEncoder().encode(nativeVal<string>(self));
    }],
  ]),
});

export function pyStr(v: string): PyObject {
  const obj = new PyObject(strType);
  setNative(obj, v);
  return obj;
}

