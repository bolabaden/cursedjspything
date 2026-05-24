import { PyObject, NotImplemented } from "../core/object.js";
import { Slot, Hook } from "../core/slots.js";
import { makeClass } from "../class/class.js";
import { nativeVal, setNative } from "./native.js";
import { boolType } from "./bool.js";
import { floatType, pyFloat } from "./float.js";
import { pyTuple } from "./tuple.js";

function isNumericOperand(other: PyObject): boolean {
  return (
    other.type === intType ||
    other.type === floatType ||
    other.type === boolType
  );
}

function numericOperand(other: PyObject): number {
  if (other.type === boolType) {
    return nativeVal<boolean>(other) ? 1 : 0;
  }
  return nativeVal<number>(other);
}

// ── pyInt ─────────────────────────────────────────────────────────────

export const intType = makeClass({
  name: "int",
  dict: new Map<string | symbol, unknown>([
    [Slot.repr, (self: PyObject) => String(nativeVal<number>(self))],
    [Slot.str, (self: PyObject) => String(nativeVal<number>(self))],
    [Slot.hash, (self: PyObject) => nativeVal<number>(self) | 0],
    [Slot.bool, (self: PyObject) => nativeVal<number>(self) !== 0],
    [Slot.int, (self: PyObject) => nativeVal<number>(self)],
    [Slot.float, (self: PyObject) => nativeVal<number>(self)],
    [Slot.index, (self: PyObject) => nativeVal<number>(self)],
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
      return other.type === floatType
        ? pyFloat(nativeVal<number>(self) + numericOperand(other))
        : pyInt(nativeVal<number>(self) + numericOperand(other));
    }],
    [Slot.radd, (self: PyObject, other: PyObject) => {
      if (!isNumericOperand(other)) return NotImplemented;
      return other.type === floatType
        ? pyFloat(numericOperand(other) + nativeVal<number>(self))
        : pyInt(numericOperand(other) + nativeVal<number>(self));
    }],
    [Slot.sub, (self: PyObject, other: PyObject) => {
      if (!isNumericOperand(other)) return NotImplemented;
      return other.type === floatType
        ? pyFloat(nativeVal<number>(self) - numericOperand(other))
        : pyInt(nativeVal<number>(self) - numericOperand(other));
    }],
    [Slot.rsub, (self: PyObject, other: PyObject) => {
      if (!isNumericOperand(other)) return NotImplemented;
      return other.type === floatType
        ? pyFloat(numericOperand(other) - nativeVal<number>(self))
        : pyInt(numericOperand(other) - nativeVal<number>(self));
    }],
    [Slot.mul, (self: PyObject, other: PyObject) => {
      if (!isNumericOperand(other)) return NotImplemented;
      return other.type === floatType
        ? pyFloat(nativeVal<number>(self) * numericOperand(other))
        : pyInt(nativeVal<number>(self) * numericOperand(other));
    }],
    [Slot.rmul, (self: PyObject, other: PyObject) => {
      if (!isNumericOperand(other)) return NotImplemented;
      return other.type === floatType
        ? pyFloat(numericOperand(other) * nativeVal<number>(self))
        : pyInt(numericOperand(other) * nativeVal<number>(self));
    }],
    [Slot.truediv, (self: PyObject, other: PyObject) => {
      if (!isNumericOperand(other)) return NotImplemented;
      const d = numericOperand(other);
      if (d === 0) throw new Error("ZeroDivisionError: division by zero");
      return pyFloat(nativeVal<number>(self) / d);
    }],
    [Slot.floordiv, (self: PyObject, other: PyObject) => {
      if (!isNumericOperand(other)) return NotImplemented;
      const d = numericOperand(other);
      if (d === 0) throw new Error("ZeroDivisionError: integer division or modulo by zero");
      return other.type === floatType
        ? pyFloat(Math.floor(nativeVal<number>(self) / d))
        : pyInt(Math.floor(nativeVal<number>(self) / d));
    }],
    [Slot.mod, (self: PyObject, other: PyObject) => {
      if (!isNumericOperand(other)) return NotImplemented;
      const d = numericOperand(other);
      if (d === 0) throw new Error("ZeroDivisionError: integer modulo by zero");
      const n = nativeVal<number>(self);
      const r = ((n % d) + d) % d;  // Python-style modulo
      return other.type === floatType ? pyFloat(r) : pyInt(r);
    }],
    [Slot.pow, (self: PyObject, other: PyObject, modObj?: unknown) => {
      if (!isNumericOperand(other)) return NotImplemented;
      const base = nativeVal<number>(self);
      const exp = numericOperand(other);
      if (modObj !== undefined && modObj instanceof PyObject) {
        const m = nativeVal<number>(modObj);
        return pyInt(Number(BigInt(base) ** BigInt(exp) % BigInt(m)));
      }
      return other.type === floatType
        ? pyFloat(Math.pow(base, exp))
        : pyInt(Math.pow(base, exp));
    }],
    [Slot.neg, (self: PyObject) => pyInt(-nativeVal<number>(self))],
    [Slot.pos, (self: PyObject) => pyInt(+nativeVal<number>(self))],
    [Slot.abs, (self: PyObject) => pyInt(Math.abs(nativeVal<number>(self)))],
    [Slot.invert, (self: PyObject) => pyInt(~nativeVal<number>(self))],
    [Slot.lshift, (self: PyObject, other: PyObject) => {
      if (other.type !== intType) return NotImplemented;
      return pyInt(nativeVal<number>(self) << nativeVal<number>(other));
    }],
    [Slot.rshift, (self: PyObject, other: PyObject) => {
      if (other.type !== intType) return NotImplemented;
      return pyInt(nativeVal<number>(self) >> nativeVal<number>(other));
    }],
    [Slot.and, (self: PyObject, other: PyObject) => {
      if (other.type !== intType) return NotImplemented;
      return pyInt(nativeVal<number>(self) & nativeVal<number>(other));
    }],
    [Slot.or, (self: PyObject, other: PyObject) => {
      if (other.type !== intType) return NotImplemented;
      return pyInt(nativeVal<number>(self) | nativeVal<number>(other));
    }],
    [Slot.xor, (self: PyObject, other: PyObject) => {
      if (other.type !== intType) return NotImplemented;
      return pyInt(nativeVal<number>(self) ^ nativeVal<number>(other));
    }],
    [Slot.divmod, (self: PyObject, other: PyObject) => {
      if (other.type !== intType) return NotImplemented;
      const d = nativeVal<number>(other);
      if (d === 0) throw new Error("ZeroDivisionError: integer division or modulo by zero");
      const n = nativeVal<number>(self);
      const q = Math.floor(n / d);
      const r = ((n % d) + d) % d;
      return pyTuple([pyInt(q), pyInt(r)]);
    }],
    [Hook.format, (self: PyObject, spec: string) => {
      if (spec === "" || spec === "d") return String(nativeVal<number>(self));
      if (spec === "b") return (nativeVal<number>(self) >>> 0).toString(2);
      if (spec === "o") return (nativeVal<number>(self) >>> 0).toString(8);
      if (spec === "x") return (nativeVal<number>(self) >>> 0).toString(16);
      if (spec === "X") return (nativeVal<number>(self) >>> 0).toString(16).toUpperCase();
      return String(nativeVal<number>(self));
    }],
    [Hook.round, (self: PyObject, ndigits?: PyObject) => {
      if (ndigits === undefined) return pyInt(Math.round(nativeVal<number>(self)));
      const nd = nativeVal<number>(ndigits);
      const factor = Math.pow(10, nd);
      return pyInt(Math.round(nativeVal<number>(self) * factor) / factor);
    }],
    [Hook.trunc, (self: PyObject) => pyInt(Math.trunc(nativeVal<number>(self)))],
    [Hook.floor, (self: PyObject) => pyInt(Math.floor(nativeVal<number>(self)))],
    [Hook.ceil, (self: PyObject) => pyInt(Math.ceil(nativeVal<number>(self)))],
  ]),
});

export function pyInt(v: number): PyObject {
  const obj = new PyObject(intType);
  setNative(obj, v | 0);
  return obj;
}

