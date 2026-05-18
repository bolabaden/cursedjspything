/**
 * Shared special-method dispatch helpers and length/truthiness primitives.
 */

import { PyObject } from "../core/object.js";
import { Slot } from "../core/slots.js";
import { lookupSpecial } from "../core/lookup.js";
import { PyTypeError } from "../core/errors.js";

export type SlotMethod = (...args: unknown[]) => unknown;

/** Lookup a slot on `obj`; returns undefined if missing. */
export function callSlot(
  obj: PyObject,
  slot: symbol,
  ...args: unknown[]
): unknown {
  const fn = lookupSpecial(obj, slot);
  if (!fn) return undefined;
  return fn(...args);
}

/** Lookup a slot or throw `PyTypeError` with `message`. */
export function callSlotOrThrow(
  obj: PyObject,
  slot: symbol,
  message: string,
  ...args: unknown[]
): unknown {
  const fn = lookupSpecial(obj, slot);
  if (!fn) throw new PyTypeError(message);
  return fn(...args);
}

/** CPython `PyObject_Size` / strict `len()` without truthiness fallback. */
export function lengthOf(obj: PyObject): number {
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
