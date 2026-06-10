/**
 * Protocol dispatch: callable, containers, iteration, context managers,
 * async protocols, formatting extras, dir, length hints.
 */

import { PyObject, PyType } from "../core/object.js";
import { Slot, Hook } from "../core/slots.js";
import { lookupSpecial, lookupInMro } from "../core/lookup.js";
import {
  PyTypeError,
  PyKeyError,
  PyStopIteration,
} from "../core/errors.js";
import { callSlotOrThrow, lengthOf } from "./dispatch.js";
import { eq } from "./operators/compare.js";
import { attachBufferView, type PyBufferView } from "../buffer/buffer.js";
import { makeSequenceIterator } from "../iterators/sequence-iterator.js";
import { makeReversedIterator } from "../iterators/reversed-iterator.js";
import {
  pyList,
  resolveSortOptions,
  sortPyObjectsInPlace,
} from "../builtins/list.js";

export function call(obj: PyObject, ...args: unknown[]): unknown {
  return callSlotOrThrow(
    obj,
    Slot.call,
    `'${obj.type.name}' object is not callable`,
    ...args,
  );
}

export function len(obj: PyObject): number {
  return lengthOf(obj);
}

export function lengthHint(obj: PyObject, defaultValue: number = 0): number {
  const lenFn = lookupSpecial(obj, Slot.len);
  if (lenFn) {
    const result = lenFn();
    if (typeof result === "number") return result;
  }
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
    if (e instanceof PyKeyError) {
      const missFn = lookupSpecial(obj, Hook.missing);
      if (missFn) return missFn(key);
    }
    throw e;
  }
}

export function setItem(obj: PyObject, key: unknown, value: unknown): void {
  callSlotOrThrow(
    obj,
    Slot.setitem,
    `'${obj.type.name}' object does not support item assignment`,
    key,
    value,
  );
}

export function delItem(obj: PyObject, key: unknown): void {
  callSlotOrThrow(
    obj,
    Slot.delitem,
    `'${obj.type.name}' object does not support item deletion`,
    key,
  );
}

export function contains(obj: PyObject, value: unknown): boolean {
  // Explicit __contains__ = None blocks iteration fallback (CPython test_contains).
  if (lookupInMro(obj.type, Slot.contains) === null) {
    throw new PyTypeError(`'${obj.type.name}' object is not a container`);
  }
  const fn = lookupSpecial(obj, Slot.contains);
  if (fn) return !!fn(value);
  const it = iter(obj);
  while (true) {
    try {
      const item = next(it);
      if (item instanceof PyObject && value instanceof PyObject) {
        if (eq(item, value)) return true;
      } else if (item === value) {
        return true;
      }
    } catch (e) {
      if (e instanceof PyStopIteration) return false;
      throw e;
    }
  }
}

export function iter(obj: PyObject): PyObject {
  const fn = lookupSpecial(obj, Slot.iter);
  if (fn) {
    const result = fn();
    if (!(result instanceof PyObject)) {
      throw new PyTypeError("iter() returned non-iterator");
    }
    return result;
  }
  if (lookupSpecial(obj, Slot.getitem)) {
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
  const lenFn = lookupSpecial(obj, Slot.len);
  const giFn = lookupSpecial(obj, Slot.getitem);
  if (lenFn && giFn) {
    return makeReversedIterator(obj, lenFn, giFn);
  }
  throw new PyTypeError(`'${obj.type.name}' object is not reversible`);
}

export function sorted(
  iterable: PyObject,
  key?: unknown,
  reverse?: unknown,
): PyObject {
  const items: PyObject[] = [];
  const it = iter(iterable);
  while (true) {
    try {
      const item = next(it);
      if (!(item instanceof PyObject)) {
        throw new PyTypeError("sorted() expects iterator items to be PyObject");
      }
      items.push(item);
    } catch (e) {
      if (e instanceof PyStopIteration) break;
      throw e;
    }
  }
  const opts = resolveSortOptions(key, reverse, "sorted");
  sortPyObjectsInPlace(items, opts.reverse, opts.keyFn, "sorted");
  return pyList(items);
}

export function enter(obj: PyObject): unknown {
  return callSlotOrThrow(
    obj,
    Hook.enter,
    `'${obj.type.name}' object does not support the context manager protocol`,
  );
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

export function pyAwait(obj: PyObject): PyObject {
  const fn = lookupSpecial(obj, Slot.await);
  if (!fn) {
    throw new PyTypeError(
      `object ${obj.type.name} can't be used in 'await' expression`,
    );
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
  return fn();
}

export async function aenter(obj: PyObject): Promise<unknown> {
  return callSlotOrThrow(
    obj,
    Hook.aenter,
    `'${obj.type.name}' object does not support the async context manager protocol`,
  );
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

export function dir(obj: PyObject): string[] {
  const fn = lookupSpecial(obj, Hook.dir);
  if (fn) {
    const result = fn();
    if (Array.isArray(result)) return result as string[];
  }
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

export function descriptorGet(
  desc: PyObject,
  instance: PyObject | null,
  owner: PyType,
): unknown {
  return callSlotOrThrow(desc, Slot.get, "descriptor has no __get__", instance, owner);
}

export function descriptorSet(
  desc: PyObject,
  instance: PyObject,
  value: unknown,
): void {
  callSlotOrThrow(desc, Slot.set, "descriptor has no __set__", instance, value);
}

export function descriptorDelete(desc: PyObject, instance: PyObject): void {
  callSlotOrThrow(desc, Slot.delete, "descriptor has no __delete__", instance);
}

export function getBuffer(obj: PyObject, flags: number): unknown {
  const view = callSlotOrThrow(
    obj,
    Slot.buffer,
    `a bytes-like object is required, not '${obj.type.name}'`,
    flags,
  );
  if (view && typeof view === "object" && "byteLength" in (view as object)) {
    attachBufferView(obj, view as PyBufferView);
  }
  return view;
}

export function releaseBuffer(obj: PyObject, buf: unknown): void {
  const fn = lookupSpecial(obj, Slot.releaseBuffer);
  if (fn) fn(buf);
}

export function withObject<T>(
  obj: PyObject,
  fn: (resource: unknown) => T,
): T {
  const resource = enter(obj);
  try {
    const result = fn(resource);
    exit(obj, null, null, null);
    return result;
  } catch (exc) {
    const suppress = exit(obj, (exc as object)?.constructor ?? null, exc, null);
    if (suppress === true) return undefined as T;
    throw exc;
  }
}

export async function withObjectAsync<T>(
  obj: PyObject,
  fn: (resource: unknown) => Promise<T> | T,
): Promise<T> {
  const resource = await aenter(obj);
  try {
    const result = await fn(resource);
    await aexit(obj, null, null, null);
    return result;
  } catch (exc) {
    const suppress = await aexit(
      obj,
      (exc as object)?.constructor ?? null,
      exc,
      null,
    );
    if (suppress === true) return undefined as T;
    throw exc;
  }
}
