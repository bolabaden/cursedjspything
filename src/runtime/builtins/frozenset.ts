import { PyObject, NotImplemented } from "../core/object.js";
import { Slot, Hook } from "../core/slots.js";
import { makeClass } from "../class/class.js";
import { PyTypeError } from "../core/errors.js";
import { hash as objectHash } from "../dispatch/operators/compare.js";
import { nativeVal, setNative } from "./native.js";
import { isSetLikeTypeName, setLikeContentsEqual } from "./set-equality.js";

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
    [
      Slot.eq,
      (self: PyObject, other: PyObject) => {
        if (!isSetLikeTypeName(other.type.name)) return NotImplemented;
        return setLikeContentsEqual(self, other);
      },
    ],
  ]),
});

export function pyFrozenSet(items: unknown[]): PyObject {
  const obj = new PyObject(frozensetType);
  setNative(obj, new Set(items));
  return obj;
}
