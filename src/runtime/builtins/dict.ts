import { PyObject, NotImplemented } from "../core/object.js";
import { Slot, Hook } from "../core/slots.js";
import { makeClass } from "../class/class.js";
import { PyKeyError, PyStopIteration } from "../core/lookup.js";
import { PyTypeError, PyValueError } from "../core/errors.js";
import { iter, next } from "../dispatch/protocols.js";
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
import { pyNone } from "./none.js";
import { listType } from "./list.js";
import { pyTuple, tupleType } from "./tuple.js";
import {
  dictItemsView,
  dictKeysView,
  dictValuesView,
} from "./dict-views.js";

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

function mergeDictMaps(
  base: Map<unknown, PyObject>,
  overlay: Map<unknown, PyObject>,
): Map<unknown, PyObject> {
  const out = new Map<unknown, PyObject>();
  for (const [k, v] of base) dictSet(out, k, v);
  for (const [k, v] of overlay) dictSet(out, k, v);
  return out;
}

function dictApplyPair(
  target: Map<unknown, PyObject>,
  pair: unknown,
  index: number,
): void {
  if (!(pair instanceof PyObject)) {
    throw new PyTypeError(
      `dictionary update sequence element #${index} is not a sequence`,
    );
  }
  const t = pair.type;
  if (t !== tupleType && t !== listType) {
    throw new PyTypeError(
      `dictionary update sequence element #${index} is not a sequence`,
    );
  }
  const seq = nativeVal<readonly PyObject[]>(pair);
  if (seq.length !== 2) {
    throw new PyValueError(
      `dictionary update sequence element #${index} has length ${seq.length}; 2 is required`,
    );
  }
  dictSet(target, seq[0], seq[1]);
}

function dictUpdateFrom(
  other: unknown,
  target: Map<unknown, PyObject>,
  method: string,
): void {
  if (other instanceof PyObject && other.type === dictType) {
    for (const [k, v] of nativeVal<Map<unknown, PyObject>>(other)) {
      dictSet(target, k, v);
    }
    return;
  }
  if (!(other instanceof PyObject)) {
    throw new PyTypeError(
      `'${method}' requires a dict or iterable of key/value pairs`,
    );
  }
  let it: PyObject;
  try {
    it = iter(other);
  } catch (e) {
    if (e instanceof PyTypeError) {
      throw new PyTypeError(
        `'${method}' requires a dict or iterable of key/value pairs`,
      );
    }
    throw e;
  }
  let i = 0;
  while (true) {
    try {
      dictApplyPair(target, next(it), i++);
    } catch (e) {
      if (e instanceof PyStopIteration) break;
      throw e;
    }
  }
}

// ── pyDict ────────────────────────────────────────────────────────────

function dictFromKeys(
  iterable: unknown,
  defaultArg?: unknown,
): PyObject {
  const value =
    defaultArg !== undefined ? (defaultArg as PyObject) : pyNone;
  if (!(iterable instanceof PyObject)) {
    throw new PyTypeError("fromkeys() argument must be iterable");
  }
  const m = new Map<unknown, PyObject>();
  let it: PyObject;
  try {
    it = iter(iterable);
  } catch (e) {
    if (e instanceof PyTypeError) {
      throw new PyTypeError("fromkeys() argument must be iterable");
    }
    throw e;
  }
  while (true) {
    try {
      dictSet(m, next(it), value);
    } catch (e) {
      if (e instanceof PyStopIteration) break;
      throw e;
    }
  }
  const obj = new PyObject(dictType);
  setNative(obj, m);
  return obj;
}

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
    ["get", (self: PyObject, key: unknown, defaultArg?: unknown) => {
      const found = dictGet(nativeVal<Map<unknown, PyObject>>(self), key);
      if (found !== undefined) return found;
      if (defaultArg !== undefined) return defaultArg;
      return pyNone;
    }],
    ["setdefault", (self: PyObject, key: unknown, defaultArg?: unknown) => {
      const m = nativeVal<Map<unknown, PyObject>>(self);
      const found = dictGet(m, key);
      if (found !== undefined) return found;
      const value =
        defaultArg !== undefined ? (defaultArg as PyObject) : pyNone;
      dictSet(m, key, value);
      return value;
    }],
    ["clear", (self: PyObject) => {
      nativeVal<Map<unknown, PyObject>>(self).clear();
      return undefined;
    }],
    ["pop", (self: PyObject, key: unknown, defaultArg?: unknown) => {
      const m = nativeVal<Map<unknown, PyObject>>(self);
      const found = dictGet(m, key);
      if (found !== undefined) {
        dictDelete(m, key);
        return found;
      }
      if (defaultArg !== undefined) return defaultArg;
      throw new PyKeyError(keyErrorArg(key));
    }],
    ["keys", (self: PyObject) => dictKeysView(self)],
    ["values", (self: PyObject) => dictValuesView(self)],
    ["items", (self: PyObject) => dictItemsView(self)],
    ["popitem", (self: PyObject) => {
      const m = nativeVal<Map<unknown, PyObject>>(self);
      if (m.size === 0) {
        throw new PyKeyError("popitem(): dictionary is empty");
      }
      let lastKey: unknown;
      let lastVal: PyObject | undefined;
      for (const [k, v] of m) {
        lastKey = k;
        lastVal = v;
      }
      const key = lastKey!;
      const val = lastVal!;
      m.delete(key);
      return pyTuple([key as PyObject, val]);
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
    [Slot.or, (self: PyObject, other: PyObject) => {
      if (other.type !== dictType) return NotImplemented;
      const merged = mergeDictMaps(
        nativeVal<Map<unknown, PyObject>>(self),
        nativeVal<Map<unknown, PyObject>>(other),
      );
      const obj = new PyObject(dictType);
      setNative(obj, merged);
      return obj;
    }],
    ["update", (self: PyObject, other: unknown) => {
      dictUpdateFrom(other, nativeVal<Map<unknown, PyObject>>(self), "update");
      return undefined;
    }],
    ["copy", (self: PyObject) => {
      const obj = new PyObject(dictType);
      setNative(
        obj,
        mergeDictMaps(new Map(), nativeVal<Map<unknown, PyObject>>(self)),
      );
      return obj;
    }],
    [Slot.ior, (self: PyObject, other: unknown) => {
      if (!(other instanceof PyObject)) return NotImplemented;
      dictUpdateFrom(other, nativeVal<Map<unknown, PyObject>>(self), "__ior__");
      return self;
    }],
  ]),
});

dictType.typeDict.set(
  "fromkeys",
  (_cls: PyObject, iterable: unknown, defaultArg?: unknown) =>
    dictFromKeys(iterable, defaultArg),
);

export function pyDict(entries: [unknown, PyObject][] = []): PyObject {
  const obj = new PyObject(dictType);
  const m = new Map<unknown, PyObject>();
  for (const [k, v] of entries) {
    dictSet(m, k, v);
  }
  setNative(obj, m);
  return obj;
}

export function pyDictFromArg(arg: PyObject): PyObject {
  if (arg.type === dictType) {
    const obj = new PyObject(dictType);
    setNative(
      obj,
      mergeDictMaps(new Map(), nativeVal<Map<unknown, PyObject>>(arg)),
    );
    return obj;
  }
  const obj = pyDict([]);
  dictUpdateFrom(arg, nativeVal<Map<unknown, PyObject>>(obj), "dict");
  return obj;
}

export function dict(...args: unknown[]): PyObject {
  if (args.length === 0) return pyDict([]);
  if (args.length > 1) {
    throw new PyTypeError(
      `dict expected at most 1 argument, got ${args.length}`,
    );
  }
  const arg = args[0];
  if (!(arg instanceof PyObject)) {
    const kind = typeof arg;
    throw new PyTypeError(`dict() argument must be PyObject, not ${kind}`);
  }
  return pyDictFromArg(arg);
}

