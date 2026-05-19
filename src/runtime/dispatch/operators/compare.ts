/** Identity, hashing, truthiness, and rich comparison. */

import { PyObject, PyType, NotImplemented, isNotImplemented } from "../../core/object.js";
import { Slot, Hook } from "../../core/slots.js";
import { lookupSpecial } from "../../core/lookup.js";
import { PyTypeError } from "../../core/errors.js";
import { lengthOf } from "../dispatch.js";

// ── identity ──────────────────────────────────────────────────────────

/** Python `is` — object identity comparison. */
export function is(a: PyObject, b: PyObject): boolean {
  return a.id === b.id;
}

export function isNot(a: PyObject, b: PyObject): boolean {
  return a.id !== b.id;
}

// ── hashing ───────────────────────────────────────────────────────────

export function hash(obj: PyObject): number {
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

// ── truthiness ────────────────────────────────────────────────────────
// CPython: PyObject_IsTrue — first __bool__, then __len__, then True.

export function bool(obj: PyObject): boolean {
  const boolFn = lookupSpecial(obj, Slot.bool);
  if (boolFn !== undefined) {
    const v = boolFn();
    if (typeof v !== "boolean") {
      throw new PyTypeError(
        `__bool__ should return bool, returned ${typeof v}`,
      );
    }
    return v;
  }
  try {
    return lengthOf(obj) !== 0;
  } catch (e) {
    if (e instanceof PyTypeError) {
      // No __len__ — fall through to default True.
    } else {
      throw e;
    }
  }
  return true;
}

// ── rich comparison ───────────────────────────────────────────────────
// CPython: do_richcompare in Objects/object.c

type CmpSlotPair = readonly [symbol, symbol];
const CMP_PAIRS: Record<string, CmpSlotPair> = {
  lt: [Slot.lt, Slot.gt],
  le: [Slot.le, Slot.ge],
  eq: [Slot.eq, Slot.eq],
  ne: [Slot.ne, Slot.ne],
  gt: [Slot.gt, Slot.lt],
  ge: [Slot.ge, Slot.le],
};

function slotDefinedOnType(type: PyType, slot: symbol): boolean {
  return type.typeDict.has(slot);
}

/** CPython object.__ne__: __eq__ first unless the type defines its own __ne__. */
function richCompareNe(a: PyObject, b: PyObject): unknown {
  const aType = a.type;
  const bType = b.type;
  const reflectSubclassFirst =
    aType !== bType && bType.mro.includes(aType);

  if (reflectSubclassFirst) {
    const rFn = lookupSpecial(b, Slot.ne);
    if (rFn) {
      const res = rFn(a);
      if (!isNotImplemented(res)) return res;
    }
  }

  if (slotDefinedOnType(aType, Slot.ne)) {
    const fNe = lookupSpecial(a, Slot.ne);
    if (fNe) {
      const res = fNe(b);
      if (!isNotImplemented(res)) return res;
    }
  } else {
    const fEq = lookupSpecial(a, Slot.eq);
    if (fEq) {
      const res = fEq(b);
      if (!isNotImplemented(res)) {
        if (typeof res !== "boolean") {
          throw new PyTypeError("__eq__ should return bool or NotImplemented");
        }
        return !res;
      }
    }
  }

  if (!reflectSubclassFirst) {
    const rFn = lookupSpecial(b, Slot.ne);
    if (rFn) {
      const res = rFn(a);
      if (!isNotImplemented(res)) return res;
    }
  }

  return isNot(a, b);
}

function richCompare(a: PyObject, b: PyObject, op: string): unknown {
  if (op === "ne") return richCompareNe(a, b);

  const [forward, reflect] = CMP_PAIRS[op];

  const aType = a.type;
  const bType = b.type;

  // If b is a proper subclass of a, try reflected first.
  const checkedReflectedFirst =
    aType !== bType && bType.mro.includes(aType);

  if (checkedReflectedFirst) {
    const rFn = lookupSpecial(b, reflect);
    if (rFn) {
      const res = rFn(a);
      if (!isNotImplemented(res)) return res;
    }
  }

  const fFn = lookupSpecial(a, forward);
  if (fFn) {
    const res = fFn(b);
    if (!isNotImplemented(res)) return res;
  }

  if (!checkedReflectedFirst) {
    const rFn = lookupSpecial(b, reflect);
    if (rFn) {
      const res = rFn(a);
      if (!isNotImplemented(res)) return res;
    }
  }

  // Fallbacks for eq — identity-based.
  if (op === "eq") return is(a, b);

  throw new PyTypeError(
    `'${op}' not supported between instances of '${aType.name}' and '${bType.name}'`,
  );
}

export function eq(a: PyObject, b: PyObject): unknown  { return richCompare(a, b, "eq"); }
export function ne(a: PyObject, b: PyObject): unknown  { return richCompare(a, b, "ne"); }
export function lt(a: PyObject, b: PyObject): unknown  { return richCompare(a, b, "lt"); }
export function le(a: PyObject, b: PyObject): unknown  { return richCompare(a, b, "le"); }
export function gt(a: PyObject, b: PyObject): unknown  { return richCompare(a, b, "gt"); }
export function ge(a: PyObject, b: PyObject): unknown  { return richCompare(a, b, "ge"); }
