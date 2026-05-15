/**
 * Protocol dispatch: callable, containers, iteration, context managers,
 * async protocols, formatting extras, dir, length hints.
 *
 * Each function mirrors the CPython abstract.c / bytecodes.c dispatch
 * path for the corresponding protocol.
 */

import { PyObject, PyType } from "./object.js";
import { Slot, Hook } from "./slots.js";
import {
  lookupSpecial,
  lookupInMro,
  PyTypeError,
  PyKeyError,
  PyStopIteration,
} from "./lookup.js";

// ── callable protocol ─────────────────────────────────────────────────

export function call(obj: PyObject, ...args: unknown[]): unknown {
  const fn = lookupSpecial(obj, Slot.call);
  if (!fn) {
    throw new PyTypeError(`'${obj.type.name}' object is not callable`);
  }
  return fn(...args);
}

// ── container / mapping / sequence ────────────────────────────────────

export function len(obj: PyObject): number {
  const fn = lookupSpecial(obj, Slot.len);
  if (!fn) {
    throw new PyTypeError(`object of type '${obj.type.name}' has no len()`);
  }
  const result = fn();
  if (typeof result !== "number") {
    throw new PyTypeError("'__len__' returned non-int");
  }
  if (result < 0) {
    throw new PyTypeError("__len__() should return >= 0");
  }
  return result;
}

export function lengthHint(obj: PyObject, defaultValue: number = 0): number {
  // First try __len__.
  const lenFn = lookupSpecial(obj, Slot.len);
  if (lenFn) {
    const result = lenFn();
    if (typeof result === "number") return result;
  }
  // Then __length_hint__.
  const hintFn = lookupSpecial(obj, Hook.lengthHint);
  if (hintFn) {
    const result = hintFn();
    if (typeof result === "number") return result;
  }
  return defaultValue;
}

export function getItem(obj: PyObject, key: unknown): unknown {
  const fn = lookupSpecial(obj, Slot.getitem);
  if (!fn) {
    throw new PyTypeError(`'${obj.type.name}' object is not subscriptable`);
  }
  try {
    return fn(key);
  } catch (e) {
    // __missing__ fallback for dict-like types.
    if (e instanceof PyKeyError) {
      const missFn = lookupSpecial(obj, Hook.missing);
      if (missFn) return missFn(key);
    }
    throw e;
  }
}

export function setItem(obj: PyObject, key: unknown, value: unknown): void {
  const fn = lookupSpecial(obj, Slot.setitem);
  if (!fn) {
    throw new PyTypeError(
      `'${obj.type.name}' object does not support item assignment`,
    );
  }
  fn(key, value);
}

export function delItem(obj: PyObject, key: unknown): void {
  const fn = lookupSpecial(obj, Slot.delitem);
  if (!fn) {
    throw new PyTypeError(
      `'${obj.type.name}' object does not support item deletion`,
    );
  }
  fn(key);
}

export function contains(obj: PyObject, value: unknown): boolean {
  const fn = lookupSpecial(obj, Slot.contains);
  if (fn) {
    const result = fn(value);
    return !!result;
  }
  // Fallback: iterate and compare.
  const it = iter(obj);
  while (true) {
    try {
      const item = next(it);
      if (item === value) return true;
    } catch (e) {
      if (e instanceof PyStopIteration) return false;
      throw e;
    }
  }
}

// ── iteration protocol ────────────────────────────────────────────────

export function iter(obj: PyObject): PyObject {
  const fn = lookupSpecial(obj, Slot.iter);
  if (fn) {
    const result = fn();
    if (!(result instanceof PyObject)) {
      throw new PyTypeError("iter() returned non-iterator");
    }
    return result;
  }
  // Sequence fallback: if __getitem__ exists, build an index-based iterator.
  const giFn = lookupSpecial(obj, Slot.getitem);
  if (giFn) {
    return makeSequenceIterator(obj);
  }
  throw new PyTypeError(`'${obj.type.name}' object is not iterable`);
}

export function next(obj: PyObject, defaultValue?: unknown): unknown {
  const fn = lookupSpecial(obj, Slot.next);
  if (!fn) {
    throw new PyTypeError(`'${obj.type.name}' object is not an iterator`);
  }
  try {
    return fn();
  } catch (e) {
    if (e instanceof PyStopIteration && defaultValue !== undefined) {
      return defaultValue;
    }
    throw e;
  }
}

export function reversed(obj: PyObject): PyObject {
  const fn = lookupSpecial(obj, Hook.reversed);
  if (fn) {
    const result = fn();
    if (!(result instanceof PyObject)) {
      throw new PyTypeError("__reversed__ returned non-iterator");
    }
    return result;
  }
  // Fallback: requires __len__ and __getitem__.
  const lenFn = lookupSpecial(obj, Slot.len);
  const giFn = lookupSpecial(obj, Slot.getitem);
  if (lenFn && giFn) {
    return makeReversedIterator(obj, lenFn, giFn);
  }
  throw new PyTypeError(
    `'${obj.type.name}' object is not reversible`,
  );
}

// ── context manager protocol ──────────────────────────────────────────

export function enter(obj: PyObject): unknown {
  const fn = lookupSpecial(obj, Hook.enter);
  if (!fn) {
    throw new PyTypeError(
      `'${obj.type.name}' object does not support the context manager protocol`,
    );
  }
  return fn();
}

export function exit(
  obj: PyObject,
  excType: unknown,
  excValue: unknown,
  traceback: unknown,
): unknown {
  const fn = lookupSpecial(obj, Hook.exit);
  if (!fn) {
    throw new PyTypeError(
      `'${obj.type.name}' object does not support the context manager protocol`,
    );
  }
  return fn(excType, excValue, traceback);
}

// ── async protocols ───────────────────────────────────────────────────

export function pyAwait(obj: PyObject): PyObject {
  const fn = lookupSpecial(obj, Slot.await);
  if (!fn) {
    throw new PyTypeError(`object ${obj.type.name} can't be used in 'await' expression`);
  }
  const result = fn();
  if (!(result instanceof PyObject)) {
    throw new PyTypeError("__await__ didn't return an iterator");
  }
  return result;
}

export function aiter(obj: PyObject): PyObject {
  const fn = lookupSpecial(obj, Slot.aiter);
  if (!fn) {
    throw new PyTypeError(`'${obj.type.name}' object is not an async iterable`);
  }
  const result = fn();
  if (!(result instanceof PyObject)) {
    throw new PyTypeError("__aiter__ didn't return an async iterator");
  }
  return result;
}

export function anext(obj: PyObject, defaultValue?: unknown): unknown {
  const fn = lookupSpecial(obj, Slot.anext);
  if (!fn) {
    throw new PyTypeError(`'${obj.type.name}' object is not an async iterator`);
  }
  const result = fn();
  // In real usage this returns a Promise-like awaitable.
  return result;
}

export async function aenter(obj: PyObject): Promise<unknown> {
  const fn = lookupSpecial(obj, Hook.aenter);
  if (!fn) {
    throw new PyTypeError(
      `'${obj.type.name}' object does not support the async context manager protocol`,
    );
  }
  return fn();
}

export async function aexit(
  obj: PyObject,
  excType: unknown,
  excValue: unknown,
  traceback: unknown,
): Promise<unknown> {
  const fn = lookupSpecial(obj, Hook.aexit);
  if (!fn) {
    throw new PyTypeError(
      `'${obj.type.name}' object does not support the async context manager protocol`,
    );
  }
  return fn(excType, excValue, traceback);
}

// ── dir() ─────────────────────────────────────────────────────────────

export function dir(obj: PyObject): string[] {
  const fn = lookupSpecial(obj, Hook.dir);
  if (fn) {
    const result = fn();
    if (Array.isArray(result)) return result as string[];
  }
  // Default: collect from type MRO dicts + instance dict.
  const names = new Set<string>();
  for (const base of obj.type.mro) {
    for (const key of base.typeDict.keys()) {
      if (typeof key === "string") names.add(key);
    }
  }
  for (const key of obj.dict.keys()) {
    if (typeof key === "string") names.add(key);
  }
  return [...names].sort();
}

// ── descriptor protocol wrappers ──────────────────────────────────────

export function descriptorGet(
  desc: PyObject,
  instance: PyObject | null,
  owner: PyType,
): unknown {
  const fn = lookupSpecial(desc, Slot.get);
  if (!fn) throw new PyTypeError("descriptor has no __get__");
  return fn(instance, owner);
}

export function descriptorSet(desc: PyObject, instance: PyObject, value: unknown): void {
  const fn = lookupSpecial(desc, Slot.set);
  if (!fn) throw new PyTypeError("descriptor has no __set__");
  fn(instance, value);
}

export function descriptorDelete(desc: PyObject, instance: PyObject): void {
  const fn = lookupSpecial(desc, Slot.delete);
  if (!fn) throw new PyTypeError("descriptor has no __delete__");
  fn(instance);
}

// ── buffer protocol stubs ─────────────────────────────────────────────
// These exist for completeness; meaningful buffer objects require
// ArrayBuffer wrapping which is inherently JS-specific.

export function getBuffer(obj: PyObject, flags: number): unknown {
  const fn = lookupSpecial(obj, Slot.buffer);
  if (!fn) throw new PyTypeError(`a bytes-like object is required, not '${obj.type.name}'`);
  return fn(flags);
}

export function releaseBuffer(obj: PyObject, buf: unknown): void {
  const fn = lookupSpecial(obj, Slot.releaseBuffer);
  if (fn) fn(buf);
}

// ── internal helpers ──────────────────────────────────────────────────

import { makeClass, instantiate } from "./class.js";
import { objectType, typeType } from "./object.js";

const seqIterType = makeClass({
  name: "sequence_iterator",
  dict: new Map<string | symbol, unknown>([
    [Slot.iter, (self: PyObject) => self],
    [Slot.next, (self: PyObject) => {
      const idx = self.dict.get("_idx") as number;
      const target = self.dict.get("_target") as PyObject;
      try {
        const val = getItem(target, idx);
        self.dict.set("_idx", idx + 1);
        return val;
      } catch {
        throw new PyStopIteration();
      }
    }],
  ]),
});

function makeSequenceIterator(obj: PyObject): PyObject {
  const it = new PyObject(seqIterType);
  it.dict.set("_idx", 0);
  it.dict.set("_target", obj);
  return it;
}

const revIterType = makeClass({
  name: "reversed_iterator",
  dict: new Map<string | symbol, unknown>([
    [Slot.iter, (self: PyObject) => self],
    [Slot.next, (self: PyObject) => {
      const idx = self.dict.get("_idx") as number;
      if (idx < 0) throw new PyStopIteration();
      const target = self.dict.get("_target") as PyObject;
      const giFn = self.dict.get("_getitem") as (...a: unknown[]) => unknown;
      const val = giFn(idx);
      self.dict.set("_idx", idx - 1);
      return val;
    }],
  ]),
});

function makeReversedIterator(
  obj: PyObject,
  lenFn: (...a: unknown[]) => unknown,
  giFn: (...a: unknown[]) => unknown,
): PyObject {
  const length = lenFn() as number;
  const it = new PyObject(revIterType);
  it.dict.set("_idx", length - 1);
  it.dict.set("_target", obj);
  it.dict.set("_getitem", giFn);
  return it;
}
