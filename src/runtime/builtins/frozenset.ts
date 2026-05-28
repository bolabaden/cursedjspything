import { PyObject, NotImplemented } from "../core/object.js";
import { Slot, Hook } from "../core/slots.js";
import { makeClass } from "../class/class.js";
import { PyStopIteration } from "../core/lookup.js";
import { PyTypeError } from "../core/errors.js";
import { hash as objectHash } from "../dispatch/operators/compare.js";
import { nativeVal, setNative } from "./native.js";
import { isSetLikeTypeName, setLikeContentsEqual } from "./set-equality.js";
import {
  differenceItems,
  intersectionItems,
  symmetricDifferenceItems,
  unionItems,
} from "./set-algebra.js";
import {
  isProperSubsetOf,
  isProperSupersetOf,
  isSubsetOf,
  isSupersetOf,
} from "./set-ordering.js";

function frozensetRepr(self: PyObject): string {
  const s = nativeVal<Set<unknown>>(self);
  if (s.size === 0) return "frozenset()";
  const items = [...s].map((v) =>
    v instanceof PyObject
      ? typeof v.type.typeDict.get(Slot.repr) === "function"
        ? (v.type.typeDict.get(Slot.repr) as Function)(v)
        : "<item>"
      : String(v),
  );
  return "frozenset({" + items.join(", ") + "})";
}

function formatFrozenSetSpec(self: PyObject, spec: string): string {
  if (spec === "") return frozensetRepr(self);
  throw new PyTypeError(
    "unsupported format string passed to frozenset.__format__",
  );
}

function frozensetHash(self: PyObject): number {
  const items = nativeVal<Set<unknown>>(self);
  let h = 1927868237;
  for (const item of items) {
    if (item instanceof PyObject) h ^= objectHash(item);
  }
  h ^= Math.imul(items.size, 976995447);
  h = h | 0;
  return h === -1 ? -2 : h;
}

export const frozensetType = makeClass({
  name: "frozenset",
  dict: new Map<string | symbol, unknown>([
    [Slot.repr, (self: PyObject) => frozensetRepr(self)],
    [
      Hook.format,
      (self: PyObject, spec: string) => formatFrozenSetSpec(self, spec),
    ],
    [Slot.hash, (self: PyObject) => frozensetHash(self)],
    [Slot.len, (self: PyObject) => nativeVal<Set<unknown>>(self).size],
    [Slot.bool, (self: PyObject) => nativeVal<Set<unknown>>(self).size > 0],
    [
      Slot.contains,
      (self: PyObject, value: unknown) =>
        nativeVal<Set<unknown>>(self).has(value),
    ],
    [Slot.iter, (self: PyObject) => {
      const vals = [...nativeVal<Set<unknown>>(self)];
      let i = 0;
      const iterType = makeClass({
        name: "frozenset_iterator",
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
    [
      Slot.eq,
      (self: PyObject, other: PyObject) => {
        if (!isSetLikeTypeName(other.type.name)) return NotImplemented;
        return setLikeContentsEqual(self, other);
      },
    ],
    [Slot.and, (self: PyObject, other: PyObject) => {
      if (!isSetLikeTypeName(other.type.name)) return NotImplemented;
      const a = nativeVal<Set<unknown>>(self);
      const b = nativeVal<Set<unknown>>(other);
      return pyFrozenSet(intersectionItems(a, b));
    }],
    [Slot.or, (self: PyObject, other: PyObject) => {
      if (!isSetLikeTypeName(other.type.name)) return NotImplemented;
      const a = nativeVal<Set<unknown>>(self);
      const b = nativeVal<Set<unknown>>(other);
      return pyFrozenSet(unionItems(a, b));
    }],
    [Slot.sub, (self: PyObject, other: PyObject) => {
      if (!isSetLikeTypeName(other.type.name)) return NotImplemented;
      const a = nativeVal<Set<unknown>>(self);
      const b = nativeVal<Set<unknown>>(other);
      return pyFrozenSet(differenceItems(a, b));
    }],
    [Slot.xor, (self: PyObject, other: PyObject) => {
      if (!isSetLikeTypeName(other.type.name)) return NotImplemented;
      const a = nativeVal<Set<unknown>>(self);
      const b = nativeVal<Set<unknown>>(other);
      return pyFrozenSet(symmetricDifferenceItems(a, b));
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
  ]),
});

export function pyFrozenSet(items: unknown[]): PyObject {
  const obj = new PyObject(frozensetType);
  setNative(obj, new Set(items));
  return obj;
}
