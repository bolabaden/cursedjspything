import { PyObject, NotImplemented } from "../core/object.js";
import { Slot, Hook } from "../core/slots.js";
import { makeClass } from "../class/class.js";
import { nativeVal, setNative } from "./native.js";
import { intType, isNumericOperand, numericOperand } from "./int.js";
import { pyInt } from "./int.js";
import { PyZeroDivisionError } from "../core/errors.js";

// ── pyFloat ───────────────────────────────────────────────────────────

export const floatType = makeClass({
  name: "float",
  dict: new Map<string | symbol, unknown>([
    [Slot.repr, (self: PyObject) => {
      const v = nativeVal<number>(self);
      const s = String(v);
      return s.includes(".") || s.includes("e") || s.includes("E") ? s : s + ".0";
    }],
    [Slot.str, (self: PyObject) => {
      const v = nativeVal<number>(self);
      const s = String(v);
      return s.includes(".") || s.includes("e") || s.includes("E") ? s : s + ".0";
    }],
    [Slot.hash, (self: PyObject) => {
      const v = nativeVal<number>(self);
      if (Number.isInteger(v)) return v | 0;
      const buf = new ArrayBuffer(8);
      new Float64Array(buf)[0] = v;
      const [lo, hi] = new Uint32Array(buf);
      return (lo ^ hi) | 0;
    }],
    [Slot.bool, (self: PyObject) => nativeVal<number>(self) !== 0],
    [Slot.int, (self: PyObject) => Math.trunc(nativeVal<number>(self))],
    [Slot.float, (self: PyObject) => nativeVal<number>(self)],
    [Slot.eq, (self: PyObject, other: PyObject) => {
      if (!isNumericOperand(other)) return NotImplemented;
      return nativeVal<number>(self) === numericOperand(other);
    }],
    [Slot.lt, (self: PyObject, other: PyObject) => {
      if (!isNumericOperand(other)) return NotImplemented;
      return nativeVal<number>(self) < numericOperand(other);
    }],
    [Slot.le, (self: PyObject, other: PyObject) => {
      if (!isNumericOperand(other)) return NotImplemented;
      return nativeVal<number>(self) <= numericOperand(other);
    }],
    [Slot.gt, (self: PyObject, other: PyObject) => {
      if (!isNumericOperand(other)) return NotImplemented;
      return nativeVal<number>(self) > numericOperand(other);
    }],
    [Slot.ge, (self: PyObject, other: PyObject) => {
      if (!isNumericOperand(other)) return NotImplemented;
      return nativeVal<number>(self) >= numericOperand(other);
    }],
    [Slot.ne, (self: PyObject, other: PyObject) => {
      if (!isNumericOperand(other)) return NotImplemented;
      return nativeVal<number>(self) !== numericOperand(other);
    }],
    [Slot.add, (self: PyObject, other: PyObject) => {
      if (!isNumericOperand(other)) return NotImplemented;
      return pyFloat(nativeVal<number>(self) + numericOperand(other));
    }],
    [Slot.radd, (self: PyObject, other: PyObject) => {
      if (!isNumericOperand(other)) return NotImplemented;
      return pyFloat(numericOperand(other) + nativeVal<number>(self));
    }],
    [Slot.sub, (self: PyObject, other: PyObject) => {
      if (!isNumericOperand(other)) return NotImplemented;
      return pyFloat(nativeVal<number>(self) - numericOperand(other));
    }],
    [Slot.mul, (self: PyObject, other: PyObject) => {
      if (!isNumericOperand(other)) return NotImplemented;
      return pyFloat(nativeVal<number>(self) * numericOperand(other));
    }],
    [Slot.truediv, (self: PyObject, other: PyObject) => {
      if (!isNumericOperand(other)) return NotImplemented;
      const d = numericOperand(other);
      if (d === 0) throw new PyZeroDivisionError("float division by zero");
      return pyFloat(nativeVal<number>(self) / d);
    }],
    [Slot.floordiv, (self: PyObject, other: PyObject) => {
      if (!isNumericOperand(other)) return NotImplemented;
      const d = numericOperand(other);
      if (d === 0) throw new PyZeroDivisionError("float floor division by zero");
      return pyFloat(Math.floor(nativeVal<number>(self) / d));
    }],
    [Slot.mod, (self: PyObject, other: PyObject) => {
      if (!isNumericOperand(other)) return NotImplemented;
      const d = numericOperand(other);
      if (d === 0) throw new PyZeroDivisionError("float modulo");
      const n = nativeVal<number>(self);
      return pyFloat(((n % d) + d) % d);
    }],
    [Slot.pow, (self: PyObject, other: PyObject) => {
      if (!isNumericOperand(other)) return NotImplemented;
      return pyFloat(Math.pow(nativeVal<number>(self), numericOperand(other)));
    }],
    [Slot.neg, (self: PyObject) => pyFloat(-nativeVal<number>(self))],
    [Slot.pos, (self: PyObject) => pyFloat(+nativeVal<number>(self))],
    [Slot.abs, (self: PyObject) => pyFloat(Math.abs(nativeVal<number>(self)))],
    [Hook.round, (self: PyObject, ndigits?: PyObject) => {
      const v = nativeVal<number>(self);
      if (ndigits === undefined) return pyInt(Math.round(v));
      const nd = nativeVal<number>(ndigits);
      const factor = Math.pow(10, nd);
      return pyFloat(Math.round(v * factor) / factor);
    }],
    [Hook.trunc, (self: PyObject) => pyInt(Math.trunc(nativeVal<number>(self)))],
    [Hook.floor, (self: PyObject) => pyInt(Math.floor(nativeVal<number>(self)))],
    [Hook.ceil, (self: PyObject) => pyInt(Math.ceil(nativeVal<number>(self)))],
  ]),
});

export function pyFloat(v: number): PyObject {
  const obj = new PyObject(floatType);
  setNative(obj, v);
  return obj;
}
