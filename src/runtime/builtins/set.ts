import { PyObject, NotImplemented } from "../core/object.js";
import { Slot, Hook } from "../core/slots.js";
import { makeClass } from "../class/class.js";
import { PyStopIteration } from "../core/lookup.js";
import { PyTypeError } from "../core/errors.js";
import { nativeVal, setNative } from "./native.js";
import { isSetLikeTypeName, requireSetLikeOperand, setLikeContentsEqual } from "./set-equality.js";
import {
  differenceItems,
  intersectionItems,
  symmetricDifferenceItems,
  unionItems,
} from "./set-algebra.js";
import {
  areDisjoint,
  isProperSubsetOf,
  isProperSupersetOf,
  isSubsetOf,
  isSupersetOf,
} from "./set-ordering.js";

function setRepr(self: PyObject): string {
  const s = nativeVal<Set<unknown>>(self);
  if (s.size === 0) return "set()";
  const items = [...s].map((v) =>
    v instanceof PyObject
      ? typeof v.type.typeDict.get(Slot.repr) === "function"
        ? (v.type.typeDict.get(Slot.repr) as Function)(v)
        : "<item>"
      : String(v),
  );
  return "{" + items.join(", ") + "}";
}

function formatSetSpec(self: PyObject, spec: string): string {
  if (spec === "") return setRepr(self);
  throw new PyTypeError("unsupported format string passed to set.__format__");
}

// ── pySet ─────────────────────────────────────────────────────────────

export const setType = makeClass({
  name: "set",
  dict: new Map<string | symbol, unknown>([
    [Slot.repr, (self: PyObject) => setRepr(self)],
    [Hook.format, (self: PyObject, spec: string) => formatSetSpec(self, spec)],
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
      if (!isSetLikeTypeName(other.type.name)) return NotImplemented;
      const a = nativeVal<Set<unknown>>(self);
      const b = nativeVal<Set<unknown>>(other);
      return pySet(intersectionItems(a, b));
    }],
    [Slot.or, (self: PyObject, other: PyObject) => {
      if (!isSetLikeTypeName(other.type.name)) return NotImplemented;
      const a = nativeVal<Set<unknown>>(self);
      const b = nativeVal<Set<unknown>>(other);
      return pySet(unionItems(a, b));
    }],
    [Slot.sub, (self: PyObject, other: PyObject) => {
      if (!isSetLikeTypeName(other.type.name)) return NotImplemented;
      const a = nativeVal<Set<unknown>>(self);
      const b = nativeVal<Set<unknown>>(other);
      return pySet(differenceItems(a, b));
    }],
    [Slot.xor, (self: PyObject, other: PyObject) => {
      if (!isSetLikeTypeName(other.type.name)) return NotImplemented;
      const a = nativeVal<Set<unknown>>(self);
      const b = nativeVal<Set<unknown>>(other);
      return pySet(symmetricDifferenceItems(a, b));
    }],
    [Slot.eq, (self: PyObject, other: PyObject) => {
      if (!isSetLikeTypeName(other.type.name)) return NotImplemented;
      return setLikeContentsEqual(self, other);
    }],
    [Slot.le, (self: PyObject, other: PyObject) => {
      if (!isSetLikeTypeName(other.type.name)) return NotImplemented;
      const a = nativeVal<Set<unknown>>(self);
      const b = nativeVal<Set<unknown>>(other);
      return isSubsetOf(a, b);
    }],
    [Slot.lt, (self: PyObject, other: PyObject) => {
      if (!isSetLikeTypeName(other.type.name)) return NotImplemented;
      const a = nativeVal<Set<unknown>>(self);
      const b = nativeVal<Set<unknown>>(other);
      return isProperSubsetOf(a, b);
    }],
    [Slot.ge, (self: PyObject, other: PyObject) => {
      if (!isSetLikeTypeName(other.type.name)) return NotImplemented;
      const a = nativeVal<Set<unknown>>(self);
      const b = nativeVal<Set<unknown>>(other);
      return isSupersetOf(a, b);
    }],
    [Slot.gt, (self: PyObject, other: PyObject) => {
      if (!isSetLikeTypeName(other.type.name)) return NotImplemented;
      const a = nativeVal<Set<unknown>>(self);
      const b = nativeVal<Set<unknown>>(other);
      return isProperSupersetOf(a, b);
    }],
    [Slot.ior, (self: PyObject, other: PyObject) => {
      if (!isSetLikeTypeName(other.type.name)) return NotImplemented;
      const a = nativeVal<Set<unknown>>(self);
      const b = nativeVal<Set<unknown>>(other);
      for (const item of b) a.add(item);
      return self;
    }],
    [Slot.iand, (self: PyObject, other: PyObject) => {
      if (!isSetLikeTypeName(other.type.name)) return NotImplemented;
      const a = nativeVal<Set<unknown>>(self);
      const b = nativeVal<Set<unknown>>(other);
      for (const item of [...a]) if (!b.has(item)) a.delete(item);
      return self;
    }],
    [Slot.isub, (self: PyObject, other: PyObject) => {
      if (!isSetLikeTypeName(other.type.name)) return NotImplemented;
      const a = nativeVal<Set<unknown>>(self);
      const b = nativeVal<Set<unknown>>(other);
      for (const item of b) a.delete(item);
      return self;
    }],
    [Slot.ixor, (self: PyObject, other: PyObject) => {
      if (!isSetLikeTypeName(other.type.name)) return NotImplemented;
      const a = nativeVal<Set<unknown>>(self);
      const b = nativeVal<Set<unknown>>(other);
      for (const item of b) {
        if (a.has(item)) a.delete(item);
        else a.add(item);
      }
      return self;
    }],
    ["issubset", (self: PyObject, other: PyObject) => {
      requireSetLikeOperand(other, "issubset");
      return isSubsetOf(
        nativeVal<Set<unknown>>(self),
        nativeVal<Set<unknown>>(other),
      );
    }],
    ["issuperset", (self: PyObject, other: PyObject) => {
      requireSetLikeOperand(other, "issuperset");
      return isSupersetOf(
        nativeVal<Set<unknown>>(self),
        nativeVal<Set<unknown>>(other),
      );
    }],
    ["isdisjoint", (self: PyObject, other: PyObject) => {
      requireSetLikeOperand(other, "isdisjoint");
      return areDisjoint(
        nativeVal<Set<unknown>>(self),
        nativeVal<Set<unknown>>(other),
      );
    }],
  ]),
});

export function pySet(items: unknown[]): PyObject {
  const obj = new PyObject(setType);
  setNative(obj, new Set(items));
  return obj;
}

