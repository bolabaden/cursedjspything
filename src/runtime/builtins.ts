/**
 * Built-in type factories for common Python types.
 *
 * These wrap native JS values as PyObjects so the runtime can dispatch
 * through them.  Each builtin type defines the appropriate slots.
 */

import {
  PyObject,
  PyType,
  objectType,
  NotImplemented,
} from "./object.js";
import { Slot, Hook } from "./slots.js";
import { makeClass, instantiate } from "./class.js";
import { PyKeyError, PyStopIteration } from "./lookup.js";

// ── value storage key ─────────────────────────────────────────────────

const VAL = Symbol("_nativeValue");

function nativeVal<T>(obj: PyObject): T {
  return obj.dict.get(VAL) as T;
}

// ── pyNone ────────────────────────────────────────────────────────────

export const noneType = makeClass({
  name: "NoneType",
  dict: new Map<string | symbol, unknown>([
    [Slot.repr, (_self: PyObject) => "None"],
    [Slot.bool, (_self: PyObject) => false],
    [Slot.hash, (_self: PyObject) => 0x345678],
    [Slot.eq, (self: PyObject, other: PyObject) =>
      self.id === other.id ? true : NotImplemented],
  ]),
});

export const pyNone: PyObject = new PyObject(noneType);

// ── pyBool ────────────────────────────────────────────────────────────

export const boolType = makeClass({
  name: "bool",
  dict: new Map<string | symbol, unknown>([
    [Slot.repr, (self: PyObject) => nativeVal<boolean>(self) ? "True" : "False"],
    [Slot.str, (self: PyObject) => nativeVal<boolean>(self) ? "True" : "False"],
    [Slot.bool, (self: PyObject) => nativeVal<boolean>(self)],
    [Slot.hash, (self: PyObject) => nativeVal<boolean>(self) ? 1 : 0],
    [Slot.int, (self: PyObject) => nativeVal<boolean>(self) ? 1 : 0],
    [Slot.float, (self: PyObject) => nativeVal<boolean>(self) ? 1.0 : 0.0],
    [Slot.eq, (self: PyObject, other: PyObject) => {
      if (other.type !== boolType) return NotImplemented;
      return nativeVal<boolean>(self) === nativeVal<boolean>(other);
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
  obj.dict.set(VAL, v);
  return obj;
}

export const pyTrue  = pyBool(true);
export const pyFalse = pyBool(false);

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
      if (other.type !== intType && other.type !== floatType) return NotImplemented;
      return nativeVal<number>(self) === nativeVal<number>(other);
    }],
    [Slot.lt, (self: PyObject, other: PyObject) => {
      if (other.type !== intType && other.type !== floatType) return NotImplemented;
      return nativeVal<number>(self) < nativeVal<number>(other);
    }],
    [Slot.le, (self: PyObject, other: PyObject) => {
      if (other.type !== intType && other.type !== floatType) return NotImplemented;
      return nativeVal<number>(self) <= nativeVal<number>(other);
    }],
    [Slot.gt, (self: PyObject, other: PyObject) => {
      if (other.type !== intType && other.type !== floatType) return NotImplemented;
      return nativeVal<number>(self) > nativeVal<number>(other);
    }],
    [Slot.ge, (self: PyObject, other: PyObject) => {
      if (other.type !== intType && other.type !== floatType) return NotImplemented;
      return nativeVal<number>(self) >= nativeVal<number>(other);
    }],
    [Slot.ne, (self: PyObject, other: PyObject) => {
      if (other.type !== intType && other.type !== floatType) return NotImplemented;
      return nativeVal<number>(self) !== nativeVal<number>(other);
    }],
    [Slot.add, (self: PyObject, other: PyObject) => {
      if (other.type !== intType && other.type !== floatType) return NotImplemented;
      return other.type === floatType
        ? pyFloat(nativeVal<number>(self) + nativeVal<number>(other))
        : pyInt(nativeVal<number>(self) + nativeVal<number>(other));
    }],
    [Slot.radd, (self: PyObject, other: PyObject) => {
      if (other.type !== intType && other.type !== floatType) return NotImplemented;
      return other.type === floatType
        ? pyFloat(nativeVal<number>(other) + nativeVal<number>(self))
        : pyInt(nativeVal<number>(other) + nativeVal<number>(self));
    }],
    [Slot.sub, (self: PyObject, other: PyObject) => {
      if (other.type !== intType && other.type !== floatType) return NotImplemented;
      return other.type === floatType
        ? pyFloat(nativeVal<number>(self) - nativeVal<number>(other))
        : pyInt(nativeVal<number>(self) - nativeVal<number>(other));
    }],
    [Slot.rsub, (self: PyObject, other: PyObject) => {
      if (other.type !== intType && other.type !== floatType) return NotImplemented;
      return other.type === floatType
        ? pyFloat(nativeVal<number>(other) - nativeVal<number>(self))
        : pyInt(nativeVal<number>(other) - nativeVal<number>(self));
    }],
    [Slot.mul, (self: PyObject, other: PyObject) => {
      if (other.type !== intType && other.type !== floatType) return NotImplemented;
      return other.type === floatType
        ? pyFloat(nativeVal<number>(self) * nativeVal<number>(other))
        : pyInt(nativeVal<number>(self) * nativeVal<number>(other));
    }],
    [Slot.rmul, (self: PyObject, other: PyObject) => {
      if (other.type !== intType && other.type !== floatType) return NotImplemented;
      return other.type === floatType
        ? pyFloat(nativeVal<number>(other) * nativeVal<number>(self))
        : pyInt(nativeVal<number>(other) * nativeVal<number>(self));
    }],
    [Slot.truediv, (self: PyObject, other: PyObject) => {
      if (other.type !== intType && other.type !== floatType) return NotImplemented;
      const d = nativeVal<number>(other);
      if (d === 0) throw new Error("ZeroDivisionError: division by zero");
      return pyFloat(nativeVal<number>(self) / d);
    }],
    [Slot.floordiv, (self: PyObject, other: PyObject) => {
      if (other.type !== intType && other.type !== floatType) return NotImplemented;
      const d = nativeVal<number>(other);
      if (d === 0) throw new Error("ZeroDivisionError: integer division or modulo by zero");
      return other.type === floatType
        ? pyFloat(Math.floor(nativeVal<number>(self) / d))
        : pyInt(Math.floor(nativeVal<number>(self) / d));
    }],
    [Slot.mod, (self: PyObject, other: PyObject) => {
      if (other.type !== intType && other.type !== floatType) return NotImplemented;
      const d = nativeVal<number>(other);
      if (d === 0) throw new Error("ZeroDivisionError: integer modulo by zero");
      const n = nativeVal<number>(self);
      const r = ((n % d) + d) % d;  // Python-style modulo
      return other.type === floatType ? pyFloat(r) : pyInt(r);
    }],
    [Slot.pow, (self: PyObject, other: PyObject, modObj?: unknown) => {
      if (other.type !== intType && other.type !== floatType) return NotImplemented;
      const base = nativeVal<number>(self);
      const exp = nativeVal<number>(other);
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
  obj.dict.set(VAL, v | 0);
  return obj;
}

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
      if (other.type !== floatType && other.type !== intType) return NotImplemented;
      return nativeVal<number>(self) === nativeVal<number>(other);
    }],
    [Slot.lt, (self: PyObject, other: PyObject) => {
      if (other.type !== floatType && other.type !== intType) return NotImplemented;
      return nativeVal<number>(self) < nativeVal<number>(other);
    }],
    [Slot.le, (self: PyObject, other: PyObject) => {
      if (other.type !== floatType && other.type !== intType) return NotImplemented;
      return nativeVal<number>(self) <= nativeVal<number>(other);
    }],
    [Slot.gt, (self: PyObject, other: PyObject) => {
      if (other.type !== floatType && other.type !== intType) return NotImplemented;
      return nativeVal<number>(self) > nativeVal<number>(other);
    }],
    [Slot.ge, (self: PyObject, other: PyObject) => {
      if (other.type !== floatType && other.type !== intType) return NotImplemented;
      return nativeVal<number>(self) >= nativeVal<number>(other);
    }],
    [Slot.ne, (self: PyObject, other: PyObject) => {
      if (other.type !== floatType && other.type !== intType) return NotImplemented;
      return nativeVal<number>(self) !== nativeVal<number>(other);
    }],
    [Slot.add, (self: PyObject, other: PyObject) => {
      if (other.type !== floatType && other.type !== intType) return NotImplemented;
      return pyFloat(nativeVal<number>(self) + nativeVal<number>(other));
    }],
    [Slot.sub, (self: PyObject, other: PyObject) => {
      if (other.type !== floatType && other.type !== intType) return NotImplemented;
      return pyFloat(nativeVal<number>(self) - nativeVal<number>(other));
    }],
    [Slot.mul, (self: PyObject, other: PyObject) => {
      if (other.type !== floatType && other.type !== intType) return NotImplemented;
      return pyFloat(nativeVal<number>(self) * nativeVal<number>(other));
    }],
    [Slot.truediv, (self: PyObject, other: PyObject) => {
      if (other.type !== floatType && other.type !== intType) return NotImplemented;
      const d = nativeVal<number>(other);
      if (d === 0) throw new Error("ZeroDivisionError: float division by zero");
      return pyFloat(nativeVal<number>(self) / d);
    }],
    [Slot.floordiv, (self: PyObject, other: PyObject) => {
      if (other.type !== floatType && other.type !== intType) return NotImplemented;
      const d = nativeVal<number>(other);
      if (d === 0) throw new Error("ZeroDivisionError: float floor division by zero");
      return pyFloat(Math.floor(nativeVal<number>(self) / d));
    }],
    [Slot.mod, (self: PyObject, other: PyObject) => {
      if (other.type !== floatType && other.type !== intType) return NotImplemented;
      const d = nativeVal<number>(other);
      if (d === 0) throw new Error("ZeroDivisionError: float modulo");
      const n = nativeVal<number>(self);
      return pyFloat(((n % d) + d) % d);
    }],
    [Slot.pow, (self: PyObject, other: PyObject) => {
      if (other.type !== floatType && other.type !== intType) return NotImplemented;
      return pyFloat(Math.pow(nativeVal<number>(self), nativeVal<number>(other)));
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
  obj.dict.set(VAL, v);
  return obj;
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
    [Slot.mul, (self: PyObject, other: PyObject) => {
      if (other.type !== intType) return NotImplemented;
      const n = nativeVal<number>(other);
      return pyStr(nativeVal<string>(self).repeat(Math.max(0, n)));
    }],
    [Slot.rmul, (self: PyObject, other: PyObject) => {
      if (other.type !== intType) return NotImplemented;
      const n = nativeVal<number>(other);
      return pyStr(nativeVal<string>(self).repeat(Math.max(0, n)));
    }],
    [Slot.contains, (self: PyObject, item: unknown) => {
      if (!(item instanceof PyObject) || item.type !== strType) {
        throw new Error("TypeError: 'in <string>' requires string as left operand");
      }
      return nativeVal<string>(self).includes(nativeVal<string>(item));
    }],
    [Slot.getitem, (self: PyObject, key: unknown) => {
      const s = nativeVal<string>(self);
      if (typeof key === "number") {
        const idx = key < 0 ? s.length + key : key;
        if (idx < 0 || idx >= s.length) throw new Error("IndexError: string index out of range");
        return pyStr(s[idx]);
      }
      throw new Error("TypeError: string indices must be integers");
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
  obj.dict.set(VAL, v);
  return obj;
}

// ── pyList ────────────────────────────────────────────────────────────

export const listType = makeClass({
  name: "list",
  dict: new Map<string | symbol, unknown>([
    [Slot.repr, (self: PyObject) => {
      const items = nativeVal<PyObject[]>(self);
      return "[" + items.map((o) => {
        const reprFn = o.type.typeDict.get(Slot.repr);
        return typeof reprFn === "function" ? (reprFn as Function)(o) : "<object>";
      }).join(", ") + "]";
    }],
    [Slot.len, (self: PyObject) => nativeVal<PyObject[]>(self).length],
    [Slot.bool, (self: PyObject) => nativeVal<PyObject[]>(self).length > 0],
    [Slot.getitem, (self: PyObject, key: unknown) => {
      const arr = nativeVal<PyObject[]>(self);
      if (typeof key !== "number") throw new Error("TypeError: list indices must be integers");
      const idx = key < 0 ? arr.length + key : key;
      if (idx < 0 || idx >= arr.length) throw new Error("IndexError: list index out of range");
      return arr[idx];
    }],
    [Slot.setitem, (self: PyObject, key: unknown, value: unknown) => {
      const arr = nativeVal<PyObject[]>(self);
      if (typeof key !== "number") throw new Error("TypeError: list indices must be integers");
      const idx = key < 0 ? arr.length + key : key;
      if (idx < 0 || idx >= arr.length) throw new Error("IndexError: list assignment index out of range");
      arr[idx] = value as PyObject;
    }],
    [Slot.delitem, (self: PyObject, key: unknown) => {
      const arr = nativeVal<PyObject[]>(self);
      if (typeof key !== "number") throw new Error("TypeError: list indices must be integers");
      const idx = key < 0 ? arr.length + key : key;
      if (idx < 0 || idx >= arr.length) throw new Error("IndexError: list deletion index out of range");
      arr.splice(idx, 1);
    }],
    [Slot.contains, (self: PyObject, value: unknown) => {
      const arr = nativeVal<PyObject[]>(self);
      for (const item of arr) {
        if (item === value) return true;
        if (item instanceof PyObject && value instanceof PyObject) {
          const eqFn = item.type.typeDict.get(Slot.eq);
          if (typeof eqFn === "function" && (eqFn as Function)(item, value) === true) return true;
        }
      }
      return false;
    }],
    [Slot.add, (self: PyObject, other: PyObject) => {
      if (other.type !== listType) return NotImplemented;
      return pyList([...nativeVal<PyObject[]>(self), ...nativeVal<PyObject[]>(other)]);
    }],
    [Slot.iadd, (self: PyObject, other: PyObject) => {
      if (other.type !== listType) return NotImplemented;
      nativeVal<PyObject[]>(self).push(...nativeVal<PyObject[]>(other));
      return self;
    }],
    [Slot.mul, (self: PyObject, other: PyObject) => {
      if (other.type !== intType) return NotImplemented;
      const n = nativeVal<number>(other);
      const src = nativeVal<PyObject[]>(self);
      const result: PyObject[] = [];
      for (let i = 0; i < n; i++) result.push(...src);
      return pyList(result);
    }],
    [Slot.iter, (self: PyObject) => {
      const arr = nativeVal<PyObject[]>(self);
      let i = 0;
      const iterType = makeClass({
        name: "list_iterator",
        dict: new Map<string | symbol, unknown>([
          [Slot.iter, (it: PyObject) => it],
          [Slot.next, (_it: PyObject) => {
            if (i >= arr.length) throw new PyStopIteration();
            return arr[i++];
          }],
        ]),
      });
      return new PyObject(iterType);
    }],
    [Hook.reversed, (self: PyObject) => {
      const arr = nativeVal<PyObject[]>(self);
      let i = arr.length - 1;
      const iterType = makeClass({
        name: "list_reverseiterator",
        dict: new Map<string | symbol, unknown>([
          [Slot.iter, (it: PyObject) => it],
          [Slot.next, (_it: PyObject) => {
            if (i < 0) throw new PyStopIteration();
            return arr[i--];
          }],
        ]),
      });
      return new PyObject(iterType);
    }],
    [Slot.eq, (self: PyObject, other: PyObject) => {
      if (other.type !== listType) return NotImplemented;
      const a = nativeVal<PyObject[]>(self);
      const b = nativeVal<PyObject[]>(other);
      if (a.length !== b.length) return false;
      for (let i = 0; i < a.length; i++) {
        const eqFn = a[i].type.typeDict.get(Slot.eq);
        if (typeof eqFn === "function") {
          if ((eqFn as Function)(a[i], b[i]) !== true) return false;
        } else if (a[i] !== b[i]) return false;
      }
      return true;
    }],
  ]),
});

export function pyList(items: PyObject[]): PyObject {
  const obj = new PyObject(listType);
  obj.dict.set(VAL, [...items]);
  return obj;
}

// ── pyTuple ───────────────────────────────────────────────────────────

export const tupleType = makeClass({
  name: "tuple",
  dict: new Map<string | symbol, unknown>([
    [Slot.repr, (self: PyObject) => {
      const items = nativeVal<readonly PyObject[]>(self);
      if (items.length === 1) {
        const r = items[0].type.typeDict.get(Slot.repr);
        return "(" + (typeof r === "function" ? (r as Function)(items[0]) : "<object>") + ",)";
      }
      return "(" + items.map((o) => {
        const r = o.type.typeDict.get(Slot.repr);
        return typeof r === "function" ? (r as Function)(o) : "<object>";
      }).join(", ") + ")";
    }],
    [Slot.len, (self: PyObject) => nativeVal<readonly PyObject[]>(self).length],
    [Slot.bool, (self: PyObject) => nativeVal<readonly PyObject[]>(self).length > 0],
    [Slot.hash, (self: PyObject) => {
      const items = nativeVal<readonly PyObject[]>(self);
      let h = 0x345678;
      for (const item of items) {
        const hFn = item.type.typeDict.get(Slot.hash);
        const ih = typeof hFn === "function" ? ((hFn as Function)(item) as number) : 0;
        h = (Math.imul(h, 1000003) ^ ih) | 0;
      }
      return h;
    }],
    [Slot.getitem, (self: PyObject, key: unknown) => {
      const arr = nativeVal<readonly PyObject[]>(self);
      if (typeof key !== "number") throw new Error("TypeError: tuple indices must be integers");
      const idx = key < 0 ? arr.length + key : key;
      if (idx < 0 || idx >= arr.length) throw new Error("IndexError: tuple index out of range");
      return arr[idx];
    }],
    [Slot.contains, (self: PyObject, value: unknown) => {
      for (const item of nativeVal<readonly PyObject[]>(self)) {
        if (item === value) return true;
        if (item instanceof PyObject && value instanceof PyObject) {
          const eqFn = item.type.typeDict.get(Slot.eq);
          if (typeof eqFn === "function" && (eqFn as Function)(item, value) === true) return true;
        }
      }
      return false;
    }],
    [Slot.add, (self: PyObject, other: PyObject) => {
      if (other.type !== tupleType) return NotImplemented;
      return pyTuple([...nativeVal<readonly PyObject[]>(self), ...nativeVal<readonly PyObject[]>(other)]);
    }],
    [Slot.mul, (self: PyObject, other: PyObject) => {
      if (other.type !== intType) return NotImplemented;
      const n = nativeVal<number>(other);
      const src = nativeVal<readonly PyObject[]>(self);
      const result: PyObject[] = [];
      for (let i = 0; i < n; i++) result.push(...src);
      return pyTuple(result);
    }],
    [Slot.iter, (self: PyObject) => {
      const arr = nativeVal<readonly PyObject[]>(self);
      let i = 0;
      const iterType = makeClass({
        name: "tuple_iterator",
        dict: new Map<string | symbol, unknown>([
          [Slot.iter, (it: PyObject) => it],
          [Slot.next, (_it: PyObject) => {
            if (i >= arr.length) throw new PyStopIteration();
            return arr[i++];
          }],
        ]),
      });
      return new PyObject(iterType);
    }],
    [Slot.eq, (self: PyObject, other: PyObject) => {
      if (other.type !== tupleType) return NotImplemented;
      const a = nativeVal<readonly PyObject[]>(self);
      const b = nativeVal<readonly PyObject[]>(other);
      if (a.length !== b.length) return false;
      for (let i = 0; i < a.length; i++) {
        const eqFn = a[i].type.typeDict.get(Slot.eq);
        if (typeof eqFn === "function") {
          if ((eqFn as Function)(a[i], b[i]) !== true) return false;
        } else if (a[i] !== b[i]) return false;
      }
      return true;
    }],
  ]),
});

export function pyTuple(items: PyObject[]): PyObject {
  const obj = new PyObject(tupleType);
  obj.dict.set(VAL, Object.freeze([...items]));
  return obj;
}

// ── pyDict ────────────────────────────────────────────────────────────

export const dictType = makeClass({
  name: "dict",
  dict: new Map<string | symbol, unknown>([
    [Slot.repr, (self: PyObject) => {
      const m = nativeVal<Map<unknown, PyObject>>(self);
      const entries: string[] = [];
      for (const [k, v] of m) {
        const ks = k instanceof PyObject
          ? (typeof k.type.typeDict.get(Slot.repr) === "function"
            ? (k.type.typeDict.get(Slot.repr) as Function)(k) : "<key>")
          : String(k);
        const vs = v instanceof PyObject
          ? (typeof v.type.typeDict.get(Slot.repr) === "function"
            ? (v.type.typeDict.get(Slot.repr) as Function)(v) : "<val>")
          : String(v);
        entries.push(`${ks}: ${vs}`);
      }
      return "{" + entries.join(", ") + "}";
    }],
    [Slot.len, (self: PyObject) => nativeVal<Map<unknown, PyObject>>(self).size],
    [Slot.bool, (self: PyObject) => nativeVal<Map<unknown, PyObject>>(self).size > 0],
    [Slot.getitem, (self: PyObject, key: unknown) => {
      const m = nativeVal<Map<unknown, PyObject>>(self);
      if (!m.has(key)) throw new PyKeyError(String(key));
      return m.get(key);
    }],
    [Slot.setitem, (self: PyObject, key: unknown, value: unknown) => {
      nativeVal<Map<unknown, PyObject>>(self).set(key, value as PyObject);
    }],
    [Slot.delitem, (self: PyObject, key: unknown) => {
      const m = nativeVal<Map<unknown, PyObject>>(self);
      if (!m.has(key)) throw new PyKeyError(String(key));
      m.delete(key);
    }],
    [Slot.contains, (self: PyObject, key: unknown) => {
      return nativeVal<Map<unknown, PyObject>>(self).has(key);
    }],
    [Slot.iter, (self: PyObject) => {
      const keys = [...nativeVal<Map<unknown, PyObject>>(self).keys()];
      let i = 0;
      const iterType = makeClass({
        name: "dict_keyiterator",
        dict: new Map<string | symbol, unknown>([
          [Slot.iter, (it: PyObject) => it],
          [Slot.next, (_it: PyObject) => {
            if (i >= keys.length) throw new PyStopIteration();
            return keys[i++];
          }],
        ]),
      });
      return new PyObject(iterType);
    }],
    [Slot.eq, (self: PyObject, other: PyObject) => {
      if (other.type !== dictType) return NotImplemented;
      const a = nativeVal<Map<unknown, PyObject>>(self);
      const b = nativeVal<Map<unknown, PyObject>>(other);
      if (a.size !== b.size) return false;
      for (const [k, v] of a) {
        if (!b.has(k)) return false;
        const bv = b.get(k)!;
        if (v instanceof PyObject && bv instanceof PyObject) {
          const eqFn = v.type.typeDict.get(Slot.eq);
          if (typeof eqFn === "function" && (eqFn as Function)(v, bv) !== true) return false;
        } else if (v !== bv) return false;
      }
      return true;
    }],
    [Hook.missing, (self: PyObject, key: unknown) => {
      throw new PyKeyError(String(key));
    }],
  ]),
});

export function pyDict(entries: [unknown, PyObject][] = []): PyObject {
  const obj = new PyObject(dictType);
  obj.dict.set(VAL, new Map(entries));
  return obj;
}

// ── pySet ─────────────────────────────────────────────────────────────

export const setType = makeClass({
  name: "set",
  dict: new Map<string | symbol, unknown>([
    [Slot.repr, (self: PyObject) => {
      const s = nativeVal<Set<unknown>>(self);
      if (s.size === 0) return "set()";
      const items = [...s].map((v) =>
        v instanceof PyObject
          ? (typeof v.type.typeDict.get(Slot.repr) === "function"
            ? (v.type.typeDict.get(Slot.repr) as Function)(v) : "<item>")
          : String(v),
      );
      return "{" + items.join(", ") + "}";
    }],
    [Slot.len, (self: PyObject) => nativeVal<Set<unknown>>(self).size],
    [Slot.bool, (self: PyObject) => nativeVal<Set<unknown>>(self).size > 0],
    [Slot.contains, (self: PyObject, value: unknown) => {
      return nativeVal<Set<unknown>>(self).has(value);
    }],
    [Slot.iter, (self: PyObject) => {
      const vals = [...nativeVal<Set<unknown>>(self)];
      let i = 0;
      const iterType = makeClass({
        name: "set_iterator",
        dict: new Map<string | symbol, unknown>([
          [Slot.iter, (it: PyObject) => it],
          [Slot.next, (_it: PyObject) => {
            if (i >= vals.length) throw new PyStopIteration();
            return vals[i++];
          }],
        ]),
      });
      return new PyObject(iterType);
    }],
    [Slot.and, (self: PyObject, other: PyObject) => {
      if (other.type !== setType) return NotImplemented;
      const a = nativeVal<Set<unknown>>(self);
      const b = nativeVal<Set<unknown>>(other);
      return pySet([...a].filter((x) => b.has(x)));
    }],
    [Slot.or, (self: PyObject, other: PyObject) => {
      if (other.type !== setType) return NotImplemented;
      return pySet([...nativeVal<Set<unknown>>(self), ...nativeVal<Set<unknown>>(other)]);
    }],
    [Slot.sub, (self: PyObject, other: PyObject) => {
      if (other.type !== setType) return NotImplemented;
      const b = nativeVal<Set<unknown>>(other);
      return pySet([...nativeVal<Set<unknown>>(self)].filter((x) => !b.has(x)));
    }],
    [Slot.xor, (self: PyObject, other: PyObject) => {
      if (other.type !== setType) return NotImplemented;
      const a = nativeVal<Set<unknown>>(self);
      const b = nativeVal<Set<unknown>>(other);
      return pySet([
        ...[...a].filter((x) => !b.has(x)),
        ...[...b].filter((x) => !a.has(x)),
      ]);
    }],
    [Slot.eq, (self: PyObject, other: PyObject) => {
      if (other.type !== setType) return NotImplemented;
      const a = nativeVal<Set<unknown>>(self);
      const b = nativeVal<Set<unknown>>(other);
      if (a.size !== b.size) return false;
      for (const item of a) if (!b.has(item)) return false;
      return true;
    }],
    [Slot.le, (self: PyObject, other: PyObject) => {
      if (other.type !== setType) return NotImplemented;
      const a = nativeVal<Set<unknown>>(self);
      const b = nativeVal<Set<unknown>>(other);
      for (const item of a) if (!b.has(item)) return false;
      return true;
    }],
    [Slot.lt, (self: PyObject, other: PyObject) => {
      if (other.type !== setType) return NotImplemented;
      const a = nativeVal<Set<unknown>>(self);
      const b = nativeVal<Set<unknown>>(other);
      if (a.size >= b.size) return false;
      for (const item of a) if (!b.has(item)) return false;
      return true;
    }],
    [Slot.ge, (self: PyObject, other: PyObject) => {
      if (other.type !== setType) return NotImplemented;
      const a = nativeVal<Set<unknown>>(self);
      const b = nativeVal<Set<unknown>>(other);
      for (const item of b) if (!a.has(item)) return false;
      return true;
    }],
    [Slot.gt, (self: PyObject, other: PyObject) => {
      if (other.type !== setType) return NotImplemented;
      const a = nativeVal<Set<unknown>>(self);
      const b = nativeVal<Set<unknown>>(other);
      if (a.size <= b.size) return false;
      for (const item of b) if (!a.has(item)) return false;
      return true;
    }],
  ]),
});

export function pySet(items: unknown[]): PyObject {
  const obj = new PyObject(setType);
  obj.dict.set(VAL, new Set(items));
  return obj;
}

// ── unwrap helper ─────────────────────────────────────────────────────

export function unwrap<T = unknown>(obj: PyObject): T {
  if (obj.dict.has(VAL)) return obj.dict.get(VAL) as T;
  return obj as unknown as T;
}
