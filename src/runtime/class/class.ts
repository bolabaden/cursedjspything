/**
 * Class creation, metaclass selection, __class__ reassignment, and
 * class-creation hooks.
 */

import {
  PyObject,
  PyType,
  computeC3,
  objectType,
  typeType,
} from "../core/object.js";
import { Slot, Hook } from "../core/slots.js";
import { lookupInMro, lookupSpecial } from "../core/lookup.js";
import { PyTypeError } from "../core/errors.js";

function isSubtype(derived: PyType, base: PyType): boolean {
  return derived.mro.includes(base);
}

/** Flatten CPython-style nested type tuples for isinstance/issubclass. */
type TypeCheckArg = PyType | TypeCheckArg[];

function flattenTypes(classOrTuple: TypeCheckArg): PyType[] {
  if (!Array.isArray(classOrTuple)) return [classOrTuple];
  const out: PyType[] = [];
  for (const item of classOrTuple) {
    out.push(...flattenTypes(item));
  }
  return out;
}

function toDictMap(
  dict: Map<string | symbol, unknown> | Record<string | symbol, unknown>,
): Map<string | symbol, unknown> {
  if (dict instanceof Map) return new Map(dict);
  const map = new Map<string | symbol, unknown>();
  const rec = dict as Record<string | symbol, unknown>;
  for (const key of [
    ...Object.getOwnPropertyNames(rec),
    ...Object.getOwnPropertySymbols(rec),
  ]) {
    map.set(key, rec[key]);
  }
  return map;
}

function mergeNamespace(
  base: Map<string | symbol, unknown>,
  overlay: Map<string | symbol, unknown>,
): Map<string | symbol, unknown> {
  const merged = new Map(base);
  for (const [k, v] of overlay) merged.set(k, v);
  return merged;
}

export function resolveBases(bases: PyType[]): PyType[] {
  const resolved: PyType[] = [];
  for (const b of bases) {
    const hook = lookupInMro(b.type, Hook.mroEntries);
    if (typeof hook === "function") {
      const entries = (hook as Function)(b, bases) as PyType[];
      resolved.push(...entries);
    } else {
      resolved.push(b);
    }
  }
  return resolved;
}

export function calculateMetaclass(
  explicitMeta: PyType | null,
  bases: PyType[],
): PyType {
  let winner = explicitMeta ?? typeType;
  for (const base of bases) {
    const baseMeta = base.type;
    if (isSubtype(baseMeta, winner)) {
      winner = baseMeta;
    } else if (!isSubtype(winner, baseMeta)) {
      throw new PyTypeError(
        "metaclass conflict: the metaclass of a derived class must be " +
          "a (non-strict) subclass of the metaclasses of all its bases",
      );
    }
  }
  return winner;
}

export function prepareNamespace(
  meta: PyType,
  name: string,
  bases: PyType[],
  kwds?: Record<string, unknown>,
): Map<string | symbol, unknown> {
  const prepare = lookupInMro(meta, Hook.prepare);
  if (typeof prepare === "function") {
    const ns = (prepare as Function)(name, bases, kwds);
    if (ns instanceof Map) return ns;
    if (ns && typeof ns === "object") {
      const map = new Map<string | symbol, unknown>();
      for (const [k, v] of Object.entries(ns as Record<string, unknown>)) {
        map.set(k, v);
      }
      return map;
    }
    throw new PyTypeError(
      `${meta.name}.__prepare__() must return a mapping, not ${typeof ns}`,
    );
  }
  return new Map();
}

export interface MakeClassOpts {
  name: string;
  bases?: PyType[];
  dict: Map<string | symbol, unknown> | Record<string | symbol, unknown>;
  metaclass?: PyType;
  slotNames?: string[];
  kwds?: Record<string, unknown>;
  /** When false, skip metaclass __prepare__ (default: true). */
  usePrepare?: boolean;
}

function applyVersionGates(cls: PyType, dict: Map<string | symbol, unknown>): void {
  const matchArgs = dict.get(Hook.matchArgs);
  if (Array.isArray(matchArgs)) {
    cls.matchArgs = Object.freeze([...(matchArgs as string[])]);
  }

  const annotations = dict.get("__annotations__");
  if (annotations instanceof Map) {
    cls.annotations = new Map(annotations);
  } else if (annotations && typeof annotations === "object") {
    cls.annotations = new Map(
      Object.entries(annotations as Record<string, unknown>),
    );
  }

  const annotate = dict.get(Hook.annotate);
  if (typeof annotate === "function") {
    cls.annotateFn = annotate as (format: number) => Record<string, unknown>;
  }
}

function runSetName(cls: PyType, dict: Map<string | symbol, unknown>): void {
  for (const [key, val] of dict) {
    if (val instanceof PyObject) {
      const setName = lookupSpecial(val, Hook.setName);
      if (setName) setName(cls, key);
    } else if (typeof val === "function" && (val as any)[Hook.setName as any]) {
      (val as any)[Hook.setName as any](cls, key);
    }
  }
}

function runInitSubclass(
  resolved: PyType[],
  cls: PyType,
  kwds?: Record<string, unknown>,
): void {
  for (const base of resolved) {
    const initSub = lookupInMro(base, Hook.initSubclass);
    if (typeof initSub === "function") {
      (initSub as Function)(cls, kwds ?? {});
    }
  }
}

function metaNewClass(
  meta: PyType,
  name: string,
  bases: PyType[],
  dict: Map<string | symbol, unknown>,
  slotNames: readonly string[] | null,
  kwds?: Record<string, unknown>,
): PyType {
  const metaCall = meta.typeDict.get(Slot.call);
  if (typeof metaCall === "function" && meta !== typeType) {
    const result = (metaCall as Function)(name, bases, dict, kwds);
    if (result instanceof PyType) return result;
  }
  return new PyType(name, bases, dict, meta, slotNames);
}

export function makeClass(opts: MakeClassOpts): PyType {
  const bases = opts.bases ?? [objectType];
  const resolved = resolveBases(bases);
  const meta = calculateMetaclass(opts.metaclass ?? null, resolved);

  const prepared =
    opts.usePrepare === false
      ? new Map<string | symbol, unknown>()
      : prepareNamespace(meta, opts.name, resolved, opts.kwds);
  const dict = mergeNamespace(prepared, toDictMap(opts.dict));

  const cls = metaNewClass(
    meta,
    opts.name,
    resolved,
    dict,
    opts.slotNames ?? null,
    opts.kwds,
  );

  applyVersionGates(cls, dict);
  runSetName(cls, dict);
  runInitSubclass(resolved, cls, opts.kwds);

  return cls;
}

export function instantiate(type: PyType, ...args: unknown[]): PyObject {
  // CPython: type(cls).__call__(cls, *args) — not instance __call__ from the class body.
  const metaCall = lookupSpecial(type.type, Slot.call);
  if (typeof metaCall === "function") {
    const result = metaCall(type, ...args);
    if (result instanceof PyObject) return result;
  }

  const newFn = lookupSpecial(type, Slot.new);
  let obj: PyObject;
  if (newFn) {
    const result = newFn(...args);
    if (!(result instanceof PyObject)) {
      throw new PyTypeError("__new__ must return a PyObject instance");
    }
    obj = result;
  } else {
    obj = new PyObject(type);
  }

  const initFn = lookupSpecial(obj, Slot.init);
  if (initFn) {
    initFn(...args);
  }

  return obj;
}

export function pyClass(obj: PyObject): PyType {
  return obj.type;
}

export function setPyClass(obj: PyObject, newType: PyType): void {
  const oldType = obj.type;
  if (oldType === newType) return;

  const oldSlots = oldType.slotNames;
  const newSlots = newType.slotNames;

  if (oldSlots === null && newSlots === null) {
    obj.type = newType;
    return;
  }

  if (oldSlots !== null && newSlots !== null) {
    if (
      oldSlots.length === newSlots.length &&
      oldSlots.every((n, i) => n === newSlots[i])
    ) {
      obj.type = newType;
      return;
    }
  }

  throw new PyTypeError(
    `__class__ assignment: '${oldType.name}' object layout differs from '${newType.name}'`,
  );
}

export function classGetitem(cls: PyType, params: unknown): unknown {
  const fn = lookupInMro(cls, Hook.classGetitem);
  if (typeof fn === "function") return (fn as Function)(cls, params);
  throw new PyTypeError(`type '${cls.name}' is not subscriptable`);
}

/** Resolve `__annotations__`, running `__annotate__` when deferred (3.14+). */
export function getAnnotations(
  cls: PyType,
  format = 1,
): Map<string, unknown> {
  if (cls.annotateFn) {
    const fresh = cls.annotateFn(format);
    cls.annotations = new Map(Object.entries(fresh));
  }
  return new Map(cls.annotations);
}

/** `__match_args__` for pattern-matching consumers (3.10+). */
export function getMatchArgs(cls: PyType): readonly string[] | null {
  return cls.matchArgs;
}

export function isinstance(obj: PyObject, classOrTuple: TypeCheckArg): boolean {
  const types = flattenTypes(classOrTuple);
  for (const cls of types) {
    const check = lookupInMro(cls.type, Hook.instancecheck);
    if (typeof check === "function") {
      if ((check as Function)(cls, obj)) return true;
      continue;
    }
    if (obj.type.mro.includes(cls)) return true;
  }
  return false;
}

export function issubclass(derived: PyType, classOrTuple: TypeCheckArg): boolean {
  const types = flattenTypes(classOrTuple);
  for (const cls of types) {
    const check = lookupInMro(cls.type, Hook.subclasscheck);
    if (typeof check === "function") {
      if ((check as Function)(cls, derived)) return true;
      continue;
    }
    if (derived.mro.includes(cls)) return true;
  }
  return false;
}

import { initMethodType } from "./method.js";
initMethodType(makeClass);
