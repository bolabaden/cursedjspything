import { PyObject, NotImplemented } from "../core/object.js";
import { Slot } from "../core/slots.js";
import { makeClass } from "../class/class.js";
import { nativeVal, setNative } from "./native.js";
import { pyInt, intType } from "./int.js";
import { floatType } from "./float.js";

function boolNumeric(self: PyObject): number {
  return nativeVal<boolean>(self) ? 1 : 0;
}

// ── pyBool ────────────────────────────────────────────────────────────

export const boolType = makeClass({
  name: "bool",
  bases: [intType],
  dict: new Map<string | symbol, unknown>([
    [Slot.repr, (self: PyObject) => nativeVal<boolean>(self) ? "True" : "False"],
    [Slot.str, (self: PyObject) => nativeVal<boolean>(self) ? "True" : "False"],
    [Slot.bool, (self: PyObject) => nativeVal<boolean>(self)],
    [Slot.hash, (self: PyObject) => nativeVal<boolean>(self) ? 1 : 0],
    [Slot.int, (self: PyObject) => nativeVal<boolean>(self) ? 1 : 0],
    [Slot.float, (self: PyObject) => nativeVal<boolean>(self) ? 1.0 : 0.0],
    [Slot.eq, (self: PyObject, other: PyObject) => {
      if (other.type === boolType) {
        return nativeVal<boolean>(self) === nativeVal<boolean>(other);
      }
      if (other.type === intType) {
        return boolNumeric(self) === nativeVal<number>(other);
      }
      if (other.type === floatType) {
        return boolNumeric(self) === nativeVal<number>(other);
      }
      return NotImplemented;
    }],
    [Slot.and, (self: PyObject, other: PyObject) => {
      if (other.type !== boolType) return NotImplemented;
      return pyBool(nativeVal<boolean>(self) && nativeVal<boolean>(other));
    }],
    [Slot.or, (self: PyObject, other: PyObject) => {
      if (other.type !== boolType) return NotImplemented;
      return pyBool(nativeVal<boolean>(self) || nativeVal<boolean>(other));
    }],
    [Slot.xor, (self: PyObject, other: PyObject) => {
      if (other.type !== boolType) return NotImplemented;
      return pyBool(nativeVal<boolean>(self) !== nativeVal<boolean>(other));
    }],
    [Slot.neg, (self: PyObject) => pyInt(nativeVal<boolean>(self) ? -1 : 0)],
    [Slot.pos, (self: PyObject) => pyInt(nativeVal<boolean>(self) ? 1 : 0)],
    [Slot.abs, (self: PyObject) => pyInt(nativeVal<boolean>(self) ? 1 : 0)],
    [Slot.invert, (self: PyObject) => pyInt(nativeVal<boolean>(self) ? -2 : -1)],
    [Slot.index, (self: PyObject) => nativeVal<boolean>(self) ? 1 : 0],
  ]),
});

export function pyBool(v: boolean): PyObject {
  const obj = new PyObject(boolType);
  setNative(obj, v);
  return obj;
}

export const pyTrue  = pyBool(true);
export const pyFalse = pyBool(false);

