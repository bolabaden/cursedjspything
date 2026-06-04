import { PyObject } from "../core/object.js";
import { Slot } from "../core/slots.js";
import { makeClass } from "../class/class.js";
import { PyStopIteration } from "../core/lookup.js";
import { dictGet, dictHas } from "../collections/dict-keys.js";
import { nativeVal, setNative } from "./native.js";
import { eq } from "../dispatch/operators/index.js";
import { pyTuple, tupleType } from "./tuple.js";

function parentMap(view: PyObject): Map<unknown, PyObject> {
  return nativeVal<Map<unknown, PyObject>>(nativeVal<PyObject>(view));
}

function keyRepr(k: unknown): string {
  if (k instanceof PyObject) {
    const r = k.type.typeDict.get(Slot.repr);
    return typeof r === "function" ? (r as (o: PyObject) => string)(k) : "<key>";
  }
  return String(k);
}

function makeViewIterator(
  view: PyObject,
  snapshot: unknown[],
): PyObject {
  let i = 0;
  const iterType = makeClass({
    name: "dict_viewiterator",
    dict: new Map<string | symbol, unknown>([
      [Slot.iter, (it: PyObject) => it],
      [Slot.next, (_it: PyObject) => {
        if (i >= snapshot.length) throw new PyStopIteration();
        return snapshot[i++];
      }],
    ]),
  });
  return new PyObject(iterType);
}

function viewLen(view: PyObject): number {
  return parentMap(view).size;
}

function keysRepr(view: PyObject): string {
  const parts: string[] = [];
  for (const k of parentMap(view).keys()) {
    parts.push(keyRepr(k));
  }
  return `dict_keys([${parts.join(", ")}])`;
}

function valuesRepr(view: PyObject): string {
  const parts: string[] = [];
  for (const v of parentMap(view).values()) {
    const r = v.type.typeDict.get(Slot.repr);
    parts.push(
      typeof r === "function" ? (r as (o: PyObject) => string)(v) : "<value>",
    );
  }
  return `dict_values([${parts.join(", ")}])`;
}

function itemsRepr(view: PyObject): string {
  const parts: string[] = [];
  for (const [k, v] of parentMap(view)) {
    parts.push(`(${keyRepr(k)}, ${(v.type.typeDict.get(Slot.repr) as Function)?.(v) ?? "<value>"})`);
  }
  return `dict_items([${parts.join(", ")}])`;
}

const dictKeysViewType = makeClass({
  name: "dict_keys",
  dict: new Map<string | symbol, unknown>([
    [Slot.repr, (view: PyObject) => keysRepr(view)],
    [Slot.len, (view: PyObject) => viewLen(view)],
    [Slot.iter, (view: PyObject) => {
      const keys = [...parentMap(view).keys()];
      return makeViewIterator(view, keys);
    }],
    [Slot.contains, (view: PyObject, key: unknown) => {
      return dictHas(parentMap(view), key);
    }],
  ]),
});

const dictValuesViewType = makeClass({
  name: "dict_values",
  dict: new Map<string | symbol, unknown>([
    [Slot.repr, (view: PyObject) => valuesRepr(view)],
    [Slot.len, (view: PyObject) => viewLen(view)],
    [Slot.iter, (view: PyObject) => {
      const vals = [...parentMap(view).values()];
      return makeViewIterator(view, vals);
    }],
    [Slot.contains, (view: PyObject, value: unknown) => {
      for (const v of parentMap(view).values()) {
        if (v instanceof PyObject && value instanceof PyObject) {
          if (eq(v, value) === true) return true;
        } else if (v === value) return true;
      }
      return false;
    }],
  ]),
});

const dictItemsViewType = makeClass({
  name: "dict_items",
  dict: new Map<string | symbol, unknown>([
    [Slot.repr, (view: PyObject) => itemsRepr(view)],
    [Slot.len, (view: PyObject) => viewLen(view)],
    [Slot.iter, (view: PyObject) => {
      const pairs: PyObject[] = [];
      for (const [k, v] of parentMap(view)) {
        pairs.push(pyTuple([k as PyObject, v]));
      }
      return makeViewIterator(view, pairs);
    }],
    [Slot.contains, (view: PyObject, item: unknown) => {
      if (!(item instanceof PyObject) || item.type !== tupleType) {
        return false;
      }
      const seq = nativeVal<readonly PyObject[]>(item);
      if (seq.length !== 2) return false;
      const found = dictGet(parentMap(view), seq[0]);
      if (found === undefined) return false;
      if (found instanceof PyObject && seq[1] instanceof PyObject) {
        return eq(found, seq[1]) === true;
      }
      return found === seq[1];
    }],
  ]),
});

function makeDictView(
  parent: PyObject,
  viewType: typeof dictKeysViewType,
): PyObject {
  const view = new PyObject(viewType);
  setNative(view, parent);
  return view;
}

export function dictKeysView(parent: PyObject): PyObject {
  return makeDictView(parent, dictKeysViewType);
}

export function dictValuesView(parent: PyObject): PyObject {
  return makeDictView(parent, dictValuesViewType);
}

export function dictItemsView(parent: PyObject): PyObject {
  return makeDictView(parent, dictItemsViewType);
}
