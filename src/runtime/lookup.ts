/**
 * Attribute lookup and descriptor protocol.
 *
 * Implements CPython's GenericGetAttr / GenericSetAttr with full
 * descriptor precedence, plus the special-method lookup that bypasses
 * instance __dict__ and __getattribute__.
 *
 * Descriptor precedence (PyObject_GenericGetAttr):
 *   1. Data descriptor on type/MRO  (has __set__ or __delete__)
 *   2. Instance __dict__
 *   3. Non-data descriptor on type/MRO (has only __get__)
 *   4. Plain class attribute
 *   5. __getattr__ fallback
 *
 * Special method lookup (_PyObject_LookupSpecial):
 *   Searches type(obj).__mro__ type dicts only, never instance __dict__,
 *   never invokes __getattribute__/__getattr__.
 */

import { PyObject, PyType, isNotImplemented } from "./object.js";
import { Slot, Hook } from "./slots.js";

// ── helpers ───────────────────────────────────────────────────────────

/** Check whether `desc` is a data descriptor (has Slot.set or Slot.delete). */
export function isDataDescriptor(desc: unknown): desc is PyObject {
  if (!(desc instanceof PyObject)) return false;
  const tp = desc.type;
  return lookupInMro(tp, Slot.set) !== undefined ||
         lookupInMro(tp, Slot.delete) !== undefined;
}

/** Check whether `desc` has __get__. */
export function hasGet(desc: unknown): desc is PyObject {
  if (!(desc instanceof PyObject)) return false;
  return lookupInMro(desc.type, Slot.get) !== undefined;
}

// ── MRO-only lookup (no instance dict, no getattribute) ──────────────

/** Walk the MRO type dicts for `key`.  Returns the raw value or undefined. */
export function lookupInMro(
  type: PyType,
  key: string | symbol,
): unknown {
  for (const base of type.mro) {
    const val = base.typeDict.get(key);
    if (val !== undefined) return val;
  }
  return undefined;
}

// ── special method lookup ─────────────────────────────────────────────
// CPython: _PyObject_LookupSpecial — type-only, never instance dict.

export function lookupSpecial(
  obj: PyObject,
  slot: symbol,
): ((...args: unknown[]) => unknown) | undefined {
  const method = lookupInMro(obj.type, slot);
  if (method === undefined) return undefined;

  // If the found value is a descriptor, invoke __get__ to bind it.
  if (method instanceof PyObject && hasGet(method)) {
    const getter = lookupInMro(method.type, Slot.get) as
      | ((...a: unknown[]) => unknown)
      | undefined;
    if (getter) return getter(method, obj, obj.type) as (...args: unknown[]) => unknown;
  }

  // Plain callable stored on the type.
  if (typeof method === "function") {
    // Bind to instance (emulates unbound method becoming bound).
    return (...args: unknown[]) => (method as Function)(obj, ...args);
  }

  return undefined;
}

// ── normal attribute access ───────────────────────────────────────────
// CPython: PyObject_GenericGetAttr / _PyObject_GenericGetAttrWithDict

export function getAttr(obj: PyObject, name: string | symbol): unknown {
  // 1. Type-level __getattribute__ override (only for explicit
  //    getattribute hooks; default path is inlined below for speed).
  const customGetattribute = lookupInMro(obj.type, Slot.getattribute);
  if (customGetattribute !== undefined && typeof customGetattribute === "function") {
    try {
      return (customGetattribute as Function)(obj, name);
    } catch (e) {
      // If __getattribute__ raises AttributeError, fall through to __getattr__.
      if (e instanceof PyAttributeError) {
        const ga = lookupInMro(obj.type, Slot.getattr);
        if (ga !== undefined && typeof ga === "function") {
          return (ga as Function)(obj, name);
        }
      }
      throw e;
    }
  }

  return defaultGetAttr(obj, name);
}

/** Default attribute resolution without a custom __getattribute__. */
export function defaultGetAttr(obj: PyObject, name: string | symbol): unknown {
  const type = obj.type;

  // Walk MRO for a descriptor or plain class attr.
  let metaAttr: unknown;
  let isData = false;
  for (const base of type.mro) {
    const val = base.typeDict.get(name);
    if (val !== undefined) {
      metaAttr = val;
      isData = isDataDescriptor(val);
      break;
    }
  }

  // 1. Data descriptor wins over instance dict.
  if (isData && metaAttr instanceof PyObject) {
    const getter = lookupInMro(metaAttr.type, Slot.get);
    if (typeof getter === "function") {
      return (getter as Function)(metaAttr, obj, type);
    }
  }

  // 2. Instance dict (or slot storage).
  if (type.slotNames && typeof name === "string") {
    const idx = type.slotNames.indexOf(name);
    if (idx !== -1) {
      const sv = obj.slotValues![idx];
      if (sv !== undefined) return sv;
    }
  }
  const instVal = obj.dict.get(name);
  if (instVal !== undefined) return instVal;

  // 3. Non-data descriptor (or plain class attr).
  if (metaAttr !== undefined) {
    if (metaAttr instanceof PyObject && hasGet(metaAttr)) {
      const getter = lookupInMro(metaAttr.type, Slot.get);
      if (typeof getter === "function") {
        return (getter as Function)(metaAttr, obj, type);
      }
    }
    return metaAttr;
  }

  // 4. __getattr__ fallback.
  const ga = lookupInMro(type, Slot.getattr);
  if (ga !== undefined && typeof ga === "function") {
    return (ga as Function)(obj, name);
  }

  throw new PyAttributeError(
    `'${type.name}' object has no attribute '${String(name)}'`,
  );
}

// ── attribute set / delete ────────────────────────────────────────────
// CPython: _PyObject_GenericSetAttrWithDict

export function setAttr(obj: PyObject, name: string | symbol, value: unknown): void {
  // Custom __setattr__?
  const customSet = lookupInMro(obj.type, Slot.setattr);
  if (customSet !== undefined && typeof customSet === "function") {
    (customSet as Function)(obj, name, value);
    return;
  }
  defaultSetAttr(obj, name, value);
}

export function defaultSetAttr(obj: PyObject, name: string | symbol, value: unknown): void {
  // Check for data descriptor on type.
  for (const base of obj.type.mro) {
    const desc = base.typeDict.get(name);
    if (desc !== undefined && isDataDescriptor(desc) && desc instanceof PyObject) {
      const setter = lookupInMro(desc.type, Slot.set);
      if (typeof setter === "function") {
        (setter as Function)(desc, obj, value);
        return;
      }
    }
  }

  // Slot enforcement.
  if (obj.type.slotNames) {
    const idx = obj.type.slotNames.indexOf(name as string);
    if (idx === -1) {
      throw new PyAttributeError(
        `'${obj.type.name}' object has no attribute '${String(name)}'`,
      );
    }
    obj.slotValues![idx] = value;
    return;
  }

  obj.dict.set(name, value);
}

export function delAttr(obj: PyObject, name: string | symbol): void {
  const customDel = lookupInMro(obj.type, Slot.delattr);
  if (customDel !== undefined && typeof customDel === "function") {
    (customDel as Function)(obj, name);
    return;
  }
  defaultDelAttr(obj, name);
}

export function defaultDelAttr(obj: PyObject, name: string | symbol): void {
  for (const base of obj.type.mro) {
    const desc = base.typeDict.get(name);
    if (desc !== undefined && isDataDescriptor(desc) && desc instanceof PyObject) {
      const deleter = lookupInMro(desc.type, Slot.delete);
      if (typeof deleter === "function") {
        (deleter as Function)(desc, obj);
        return;
      }
    }
  }

  if (!obj.dict.has(name)) {
    throw new PyAttributeError(
      `'${obj.type.name}' object has no attribute '${String(name)}'`,
    );
  }
  obj.dict.delete(name);
}

// ── error types ───────────────────────────────────────────────────────

export class PyAttributeError extends Error {
  constructor(msg: string) {
    super(msg);
    this.name = "AttributeError";
  }
}

export class PyTypeError extends Error {
  constructor(msg: string) {
    super(msg);
    this.name = "TypeError";
  }
}

export class PyKeyError extends Error {
  constructor(msg: string) {
    super(msg);
    this.name = "KeyError";
  }
}

export class PyStopIteration extends Error {
  readonly value: unknown;
  constructor(value?: unknown) {
    super("StopIteration");
    this.name = "StopIteration";
    this.value = value;
  }
}

export class PyValueError extends Error {
  constructor(msg: string) {
    super(msg);
    this.name = "ValueError";
  }
}
