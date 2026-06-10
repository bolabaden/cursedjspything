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
  PyValueError,
} from "../core/errors.js";
import { callSlotOrThrow, lengthOf } from "./dispatch.js";
import { bool, eq, gt, lt } from "./operators/compare.js";
import { add } from "./operators/numeric.js";
import { pyFalse, pyTrue } from "../builtins/bool.js";
import { pyInt } from "../builtins/int.js";
import { attachBufferView, type PyBufferView } from "../buffer/buffer.js";
import { makeSequenceIterator } from "../iterators/sequence-iterator.js";
import { makeReversedIterator } from "../iterators/reversed-iterator.js";
import { makeEnumerateIterator } from "../iterators/enumerate-iterator.js";
import { makeZipIterator } from "../iterators/zip-iterator.js";
import { makeMapIterator } from "../iterators/map-iterator.js";
import { makeFilterIterator } from "../iterators/filter-iterator.js";
import { pyNone } from "../builtins/none.js";
import { pyIndexAsInteger } from "../builtins/int.js";
import {
  comparePyObjectsForOrder,
  pyList,
  resolveSortOptions,
  sortPyObjectsInPlace,
} from "../builtins/list.js";
import { pyTuple } from "../builtins/tuple.js";

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

function materializeIterable(
  iterable: PyObject,
  context: string,
): PyObject[] {
  const items: PyObject[] = [];
  const it = iter(iterable);
  while (true) {
    try {
      const item = next(it);
      if (!(item instanceof PyObject)) {
        throw new PyTypeError(`${context}() expects iterator items to be PyObject`);
      }
      items.push(item);
    } catch (e) {
      if (e instanceof PyStopIteration) break;
      throw e;
    }
  }
  return items;
}

function requirePyObjectArgs(args: unknown[], fn: "min" | "max"): PyObject[] {
  const out: PyObject[] = [];
  for (const arg of args) {
    if (!(arg instanceof PyObject)) {
      const kind = typeof arg;
      throw new PyTypeError(`${fn}() argument must be PyObject, not ${kind}`);
    }
    out.push(arg);
  }
  return out;
}

function isMinMaxKeyCallable(value: unknown): value is PyObject {
  return (
    value instanceof PyObject && lookupSpecial(value, Slot.call) !== undefined
  );
}

type MinMaxParsed = {
  candidates: PyObject[];
  keyFn: PyObject | null;
  defaultVal: PyObject | null;
};

function parseMinMaxArgs(args: unknown[], fn: "min" | "max"): MinMaxParsed {
  if (args.length === 0) {
    throw new PyTypeError(`${fn} expected at least 1 argument, got 0`);
  }

  const positional = [...args];
  let keyFn: PyObject | null = null;
  let defaultVal: PyObject | null = null;

  if (positional.length >= 2) {
    const last = positional[positional.length - 1];
    const prev = positional[positional.length - 2];
    if (
      last instanceof PyObject &&
      prev instanceof PyObject &&
      isMinMaxKeyCallable(prev)
    ) {
      defaultVal = last;
      keyFn = prev;
      positional.length -= 2;
    }
  }
  if (positional.length >= 1 && keyFn === null) {
    const last = positional[positional.length - 1];
    if (last instanceof PyObject && isMinMaxKeyCallable(last)) {
      keyFn = last;
      positional.length -= 1;
    }
  }
  if (positional.length === 2 && keyFn === null && defaultVal === null) {
    const last = positional[positional.length - 1];
    if (last instanceof PyObject && !isMinMaxKeyCallable(last)) {
      defaultVal = last;
      positional.length -= 1;
    }
  }

  const iterableForm =
    positional.length === 1 && positional[0] instanceof PyObject;

  if (iterableForm) {
    const items = materializeIterable(positional[0] as PyObject, fn);
    if (items.length === 0) {
      if (defaultVal !== null) {
        return { candidates: [], keyFn, defaultVal };
      }
      throw new PyValueError(`${fn}() arg is an empty sequence`);
    }
    return { candidates: items, keyFn, defaultVal: null };
  }

  if (defaultVal !== null) {
    throw new PyTypeError(
      `Cannot specify a default for ${fn}() with multiple positional arguments`,
    );
  }
  if (positional.length === 0) {
    throw new PyTypeError(`${fn} expected at least 1 argument, got 0`);
  }
  return {
    candidates: requirePyObjectArgs(positional, fn),
    keyFn,
    defaultVal: null,
  };
}

function selectMinMax(
  candidates: PyObject[],
  keyFn: PyObject | null,
  fn: "min" | "max",
): PyObject {
  let best = candidates[0]!;
  for (let i = 1; i < candidates.length; i++) {
    const item = candidates[i]!;
    const cmp = comparePyObjectsForOrder(item, best, keyFn, fn);
    if (fn === "min" && cmp < 0) best = item;
    if (fn === "max" && cmp > 0) best = item;
  }
  return best;
}

export function min(...args: unknown[]): PyObject {
  const { candidates, keyFn, defaultVal } = parseMinMaxArgs(args, "min");
  if (candidates.length === 0) return defaultVal!;
  return selectMinMax(candidates, keyFn, "min");
}

export function max(...args: unknown[]): PyObject {
  const { candidates, keyFn, defaultVal } = parseMinMaxArgs(args, "max");
  if (candidates.length === 0) return defaultVal!;
  return selectMinMax(candidates, keyFn, "max");
}

function requireSingleIterableArg(
  args: unknown[],
  fn: "any" | "all",
): PyObject {
  if (args.length === 0) {
    throw new PyTypeError(`${fn}() expected at least 1 argument, got 0`);
  }
  if (args.length > 1) {
    throw new PyTypeError(
      `${fn}() takes exactly one argument (${args.length} given)`,
    );
  }
  const iterable = args[0];
  if (!(iterable instanceof PyObject)) {
    const kind = typeof iterable;
    throw new PyTypeError(`${fn}() argument must be PyObject, not ${kind}`);
  }
  return iterable;
}

export function any(...args: unknown[]): PyObject {
  const iterable = requireSingleIterableArg(args, "any");
  const it = iter(iterable);
  while (true) {
    try {
      const item = next(it);
      if (!(item instanceof PyObject)) {
        throw new PyTypeError("any() expects iterator items to be PyObject");
      }
      if (bool(item)) return pyTrue;
    } catch (e) {
      if (e instanceof PyStopIteration) return pyFalse;
      throw e;
    }
  }
}

export function all(...args: unknown[]): PyObject {
  const iterable = requireSingleIterableArg(args, "all");
  const it = iter(iterable);
  while (true) {
    try {
      const item = next(it);
      if (!(item instanceof PyObject)) {
        throw new PyTypeError("all() expects iterator items to be PyObject");
      }
      if (!bool(item)) return pyFalse;
    } catch (e) {
      if (e instanceof PyStopIteration) return pyTrue;
      throw e;
    }
  }
}

export function enumerate(...args: unknown[]): PyObject {
  if (args.length === 0) {
    throw new PyTypeError("enumerate() expected at least 1 argument, got 0");
  }
  if (args.length > 2) {
    throw new PyTypeError(
      `enumerate() takes from 1 to 2 positional arguments but ${args.length} were given`,
    );
  }
  const iterable = args[0];
  if (!(iterable instanceof PyObject)) {
    const kind = typeof iterable;
    throw new PyTypeError(`enumerate() argument must be PyObject, not ${kind}`);
  }
  let startIndex = 0;
  if (args.length === 2) {
    const start = args[1];
    if (!(start instanceof PyObject)) {
      const kind = typeof start;
      throw new PyTypeError(`enumerate() start must be PyObject, not ${kind}`);
    }
    const n = pyIndexAsInteger(start);
    if (n === null) {
      throw new PyTypeError(
        `'${start.type.name}' object cannot be interpreted as an integer`,
      );
    }
    startIndex = n;
  }
  const inner = iter(iterable);
  return makeEnumerateIterator(inner, startIndex);
}

export function map(...args: unknown[]): PyObject {
  if (args.length < 2) {
    throw new PyTypeError("map() must have at least two arguments.");
  }
  const func = args[0];
  if (!(func instanceof PyObject)) {
    const kind = typeof func;
    throw new PyTypeError(`map() func must be PyObject, not ${kind}`);
  }
  if (lookupSpecial(func, Slot.call) === undefined) {
    throw new PyTypeError(`'${func.type.name}' object is not callable`);
  }
  const iters: PyObject[] = [];
  for (let i = 1; i < args.length; i++) {
    const arg = args[i];
    if (!(arg instanceof PyObject)) {
      const kind = typeof arg;
      throw new PyTypeError(`map() argument must be PyObject, not ${kind}`);
    }
    iters.push(iter(arg));
  }
  return makeMapIterator(func, iters);
}

export function filter(...args: unknown[]): PyObject {
  if (args.length !== 2) {
    throw new PyTypeError(`filter expected 2 arguments, got ${args.length}`);
  }
  const func = args[0];
  const iterable = args[1];
  if (!(iterable instanceof PyObject)) {
    const kind = typeof iterable;
    throw new PyTypeError(`filter() iterable must be PyObject, not ${kind}`);
  }
  const identity = func === pyNone;
  if (!identity) {
    if (!(func instanceof PyObject)) {
      const kind = typeof func;
      throw new PyTypeError(`filter() func must be PyObject, not ${kind}`);
    }
    if (lookupSpecial(func, Slot.call) === undefined) {
      throw new PyTypeError(`'${func.type.name}' object is not callable`);
    }
  }
  const inner = iter(iterable);
  return makeFilterIterator(
    identity ? null : (func as PyObject),
    inner,
    identity,
  );
}

function sequenceConstructor(
  args: unknown[],
  fn: "list" | "tuple",
  empty: () => PyObject,
  fromItems: (items: PyObject[]) => PyObject,
): PyObject {
  if (args.length === 0) return empty();
  if (args.length > 1) {
    throw new PyTypeError(
      `${fn} expected at most 1 argument, got ${args.length}`,
    );
  }
  const iterable = args[0];
  if (!(iterable instanceof PyObject)) {
    const kind = typeof iterable;
    throw new PyTypeError(`${fn}() argument must be PyObject, not ${kind}`);
  }
  return fromItems(materializeIterable(iterable, fn));
}

export function list(...args: unknown[]): PyObject {
  return sequenceConstructor(args, "list", () => pyList([]), pyList);
}

export function tuple(...args: unknown[]): PyObject {
  return sequenceConstructor(args, "tuple", () => pyTuple([]), pyTuple);
}

export function zip(...args: unknown[]): PyObject {
  if (args.length === 0) {
    throw new PyTypeError("zip() expected at least 1 argument, got 0");
  }
  const iters: PyObject[] = [];
  for (const arg of args) {
    if (!(arg instanceof PyObject)) {
      const kind = typeof arg;
      throw new PyTypeError(`zip() argument must be PyObject, not ${kind}`);
    }
    iters.push(iter(arg));
  }
  return makeZipIterator(iters);
}

export function sum(...args: unknown[]): PyObject {
  if (args.length === 0) {
    throw new PyTypeError("sum() expected at least 1 argument, got 0");
  }
  if (args.length > 2) {
    throw new PyTypeError(
      `sum() takes from 1 to 2 positional arguments but ${args.length} were given`,
    );
  }
  const iterable = args[0];
  if (!(iterable instanceof PyObject)) {
    const kind = typeof iterable;
    throw new PyTypeError(`sum() argument must be PyObject, not ${kind}`);
  }
  let total: PyObject;
  if (args.length === 1) {
    total = pyInt(0);
  } else {
    const start = args[1];
    if (!(start instanceof PyObject)) {
      const kind = typeof start;
      throw new PyTypeError(`sum() start must be PyObject, not ${kind}`);
    }
    total = start;
  }
  const it = iter(iterable);
  while (true) {
    try {
      const item = next(it);
      if (!(item instanceof PyObject)) {
        throw new PyTypeError("sum() expects iterator items to be PyObject");
      }
      const nextTotal = add(total, item);
      if (!(nextTotal instanceof PyObject)) {
        throw new PyTypeError("sum() add must return PyObject");
      }
      total = nextTotal;
    } catch (e) {
      if (e instanceof PyStopIteration) return total;
      throw e;
    }
  }
}

export function sorted(
  iterable: PyObject,
  key?: unknown,
  reverse?: unknown,
): PyObject {
  const items = materializeIterable(iterable, "sorted");
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
