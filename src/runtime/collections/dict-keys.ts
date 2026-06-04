/**
 * Python-style dict key lookup (hash + equality) for PyObject keys.
 */

import { PyObject, isNotImplemented } from "../core/object.js";
import { Slot } from "../core/slots.js";
import { lookupSpecial } from "../core/lookup.js";
import { PyTypeError } from "../core/errors.js";

function dictKeyHash(obj: PyObject): number {
  const fn = lookupSpecial(obj, Slot.hash);
  if (fn === undefined) {
    throw new PyTypeError(`unhashable type: '${obj.type.name}'`);
  }
  const result = fn();
  if (typeof result !== "number") {
    throw new PyTypeError("__hash__ method should return an integer");
  }
  return result | 0;
}

function dictKeyEq(a: PyObject, b: PyObject): boolean {
  const aType = a.type;
  const bType = b.type;
  const checkedReflectedFirst =
    aType !== bType && bType.mro.includes(aType);

  if (checkedReflectedFirst) {
    const rFn = lookupSpecial(b, Slot.eq);
    if (rFn) {
      const res: unknown = rFn(a);
      if (!isNotImplemented(res) && Object.is(res, true)) return true;
    }
  }

  const fFn = lookupSpecial(a, Slot.eq);
  if (fFn) {
    const res: unknown = fFn(b);
    if (!isNotImplemented(res) && Object.is(res, true)) return true;
  }

  if (!checkedReflectedFirst) {
    const rFn = lookupSpecial(b, Slot.eq);
    if (rFn) {
      const res: unknown = rFn(a);
      if (!isNotImplemented(res) && Object.is(res, true)) return true;
    }
  }

  return a.id === b.id;
}

export function dictKeysEqual(a: unknown, b: unknown): boolean {
  if (Object.is(a, b)) return true;
  if (a instanceof PyObject && b instanceof PyObject) {
    if (dictKeyHash(a) !== dictKeyHash(b)) return false;
    return dictKeyEq(a, b);
  }
  return false;
}

/** Find an existing key in the map that matches `key`, or undefined. */
export function dictFindKey(
  map: Map<unknown, unknown>,
  key: unknown,
): unknown | undefined {
  if (map.has(key)) return key;
  if (key instanceof PyObject) {
    dictKeyHash(key);
  }
  for (const k of map.keys()) {
    if (dictKeysEqual(k, key)) return k;
  }
  return undefined;
}

export function dictGet(
  map: Map<unknown, unknown>,
  key: unknown,
): unknown | undefined {
  const k = dictFindKey(map, key);
  return k === undefined ? undefined : map.get(k);
}

export function dictHas(map: Map<unknown, unknown>, key: unknown): boolean {
  return dictFindKey(map, key) !== undefined;
}

export function dictSet(
  map: Map<unknown, unknown>,
  key: unknown,
  value: unknown,
): void {
  if (key instanceof PyObject) {
    dictKeyHash(key);
  }
  const existing = dictFindKey(map, key);
  if (existing !== undefined) map.delete(existing);
  map.set(key, value);
}

export function dictDelete(map: Map<unknown, unknown>, key: unknown): boolean {
  const existing = dictFindKey(map, key);
  if (existing === undefined) return false;
  map.delete(existing);
  return true;
}
