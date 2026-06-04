import { PyObject, NotImplemented } from "../core/object.js";
import { Slot, Hook } from "../core/slots.js";
import { makeClass } from "../class/class.js";
import { PyKeyError, PyStopIteration } from "../core/lookup.js";
import { PyTypeError } from "../core/errors.js";
import { eq } from "../dispatch/operators/index.js";
import {
  dictDelete,
  dictFindKey,
  dictGet,
  dictHas,
  dictSet,
} from "../collections/dict-keys.js";
import { nativeVal, setNative } from "./native.js";
import { keyErrorArg } from "./key-error-arg.js";

function dictRepr(self: PyObject): string {
  const m = nativeVal<Map<unknown, PyObject>>(self);
  const entries: string[] = [];
  for (const [k, v] of m) {
    const ks =
      k instanceof PyObject
        ? typeof k.type.typeDict.get(Slot.repr) === "function"
          ? (k.type.typeDict.get(Slot.repr) as Function)(k)
          : "<key>"
        : String(k);
    const vs =
      v instanceof PyObject
        ? typeof v.type.typeDict.get(Slot.repr) === "function"
          ? (v.type.typeDict.get(Slot.repr) as Function)(v)
          : "<val>"
        : String(v);
    entries.push(`${ks}: ${vs}`);
  }
  return "{" + entries.join(", ") + "}";
}

function formatDictSpec(self: PyObject, spec: string): string {
  if (spec === "") return dictRepr(self);
  throw new PyTypeError("unsupported format string passed to dict.__format__");
}

// ── pyDict ────────────────────────────────────────────────────────────

export const dictType = makeClass({
  name: "dict",
  dict: new Map<string | symbol, unknown>([
    [Slot.repr, (self: PyObject) => dictRepr(self)],
    [Hook.format, (self: PyObject, spec: string) => formatDictSpec(self, spec)],
    [Slot.len, (self: PyObject) => nativeVal<Map<unknown, PyObject>>(self).size],
    [Slot.bool, (self: PyObject) => nativeVal<Map<unknown, PyObject>>(self).size > 0],
    [Slot.getitem, (self: PyObject, key: unknown) => {
      const m = nativeVal<Map<unknown, PyObject>>(self);
      const found = dictGet(m, key);
      if (found === undefined) throw new PyKeyError(keyErrorArg(key));
      return found;
    }],
    [Slot.setitem, (self: PyObject, key: unknown, value: unknown) => {
      dictSet(nativeVal<Map<unknown, PyObject>>(self), key, value as PyObject);
    }],
    [Slot.delitem, (self: PyObject, key: unknown) => {
      const m = nativeVal<Map<unknown, PyObject>>(self);
      if (!dictDelete(m, key)) throw new PyKeyError(keyErrorArg(key));
    }],
    [Slot.contains, (self: PyObject, key: unknown) => {
      return dictHas(nativeVal<Map<unknown, PyObject>>(self), key);
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
        const bk = dictFindKey(b, k);
        if (bk === undefined) return false;
        const bv = b.get(bk)!;
        if (v instanceof PyObject && bv instanceof PyObject) {
          if (eq(v, bv) !== true) return false;
        } else if (v !== bv) return false;
      }
      return true;
    }],
    [Hook.missing, (self: PyObject, key: unknown) => {
      throw new PyKeyError(keyErrorArg(key));
    }],
  ]),
});

export function pyDict(entries: [unknown, PyObject][] = []): PyObject {
  const obj = new PyObject(dictType);
  const m = new Map<unknown, PyObject>();
  for (const [k, v] of entries) {
    dictSet(m, k, v);
  }
  setNative(obj, m);
  return obj;
}

