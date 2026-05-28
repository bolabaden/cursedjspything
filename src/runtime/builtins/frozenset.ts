import { PyObject, NotImplemented } from "../core/object.js";
import { Slot, Hook } from "../core/slots.js";
import { makeClass } from "../class/class.js";
import { PyTypeError } from "../core/errors.js";
import { nativeVal, setNative } from "./native.js";

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

export const frozensetType = makeClass({
  name: "frozenset",
  dict: new Map<string | symbol, unknown>([
    [Slot.repr, (self: PyObject) => frozensetRepr(self)],
    [
      Hook.format,
      (self: PyObject, spec: string) => formatFrozenSetSpec(self, spec),
    ],
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
        if (other.type !== frozensetType) return NotImplemented;
        const a = nativeVal<Set<unknown>>(self);
        const b = nativeVal<Set<unknown>>(other);
        if (a.size !== b.size) return false;
        for (const item of a) if (!b.has(item)) return false;
        return true;
      },
    ],
  ]),
});

export function pyFrozenSet(items: unknown[]): PyObject {
  const obj = new PyObject(frozensetType);
  setNative(obj, new Set(items));
  return obj;
}
