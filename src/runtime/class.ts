/**
 * Class creation, metaclass selection, __class__ reassignment, and
 * class-creation hooks.
 *
 * Mirrors CPython's type_new / type_call / __build_class__ pipeline:
 *
 *   1. Resolve non-type bases via __mro_entries__.
 *   2. Determine the most-derived metaclass.
 *   3. Call metaclass.__prepare__(name, bases, **kwds) → namespace.
 *   4. Execute body (caller provides the populated dict).
 *   5. Call metaclass(name, bases, namespace, **kwds) → new type.
 *   6. __set_name__ on descriptors.
 *   7. __init_subclass__ on the parent.
 *   8. Apply decorators (caller responsibility).
 */

import {
  PyObject,
  PyType,
  computeC3,
  objectType,
  typeType,
} from "./object.js";
import { Slot, Hook } from "./slots.js";
import { lookupInMro, lookupSpecial, PyTypeError } from "./lookup.js";

// ── helpers ───────────────────────────────────────────────────────────

function isSubtype(derived: PyType, base: PyType): boolean {
  return derived.mro.includes(base);
}

// ── Step 1: __mro_entries__ ───────────────────────────────────────────

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

// ── Step 2: most-derived metaclass ────────────────────────────────────

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

// ── Step 3: __prepare__ ───────────────────────────────────────────────

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

// ── Step 5: create class ──────────────────────────────────────────────

export interface MakeClassOpts {
  name: string;
  bases?: PyType[];
  dict: Map<string | symbol, unknown> | Record<string | symbol, unknown>;
  metaclass?: PyType;
  slotNames?: string[];
  kwds?: Record<string, unknown>;
}

/**
 * Main class-creation entry point.
 *
 * ```ts
 * const MyClass = makeClass({
 *   name: "MyClass",
 *   bases: [SomeBase],
 *   dict: new Map([
 *     [Slot.init, (self: PyObject, x: number) => { ... }],
 *     [Slot.repr, (self: PyObject) => "<MyClass>"],
 *   ]),
 * });
 * ```
 */
export function makeClass(opts: MakeClassOpts): PyType {
  const bases = opts.bases ?? [objectType];
  const resolved = resolveBases(bases);
  const meta = calculateMetaclass(opts.metaclass ?? null, resolved);

  let dict: Map<string | symbol, unknown>;
  if (opts.dict instanceof Map) {
    dict = opts.dict;
  } else {
    dict = new Map<string | symbol, unknown>();
    const rec = opts.dict as Record<string | symbol, unknown>;
    for (const key of [...Object.getOwnPropertyNames(rec), ...Object.getOwnPropertySymbols(rec)]) {
      dict.set(key, (rec as any)[key]);
    }
  }

  const cls = new PyType(
    opts.name,
    resolved,
    dict,
    meta,
    opts.slotNames ?? null,
  );

  // Step 6: __set_name__ on descriptors.
  for (const [key, val] of dict) {
    if (val instanceof PyObject) {
      const setName = lookupSpecial(val, Hook.setName);
      if (setName) setName(cls, key);
    } else if (typeof val === "function" && (val as any)[Hook.setName as any]) {
      (val as any)[Hook.setName as any](cls, key);
    }
  }

  // Step 7: __init_subclass__ on the immediate parent.
  for (const base of resolved) {
    const initSub = lookupInMro(base, Hook.initSubclass);
    if (typeof initSub === "function") {
      (initSub as Function)(cls, opts.kwds ?? {});
    }
  }

  return cls;
}

// ── Instantiation (type.__call__) ─────────────────────────────────────

export function instantiate(type: PyType, ...args: unknown[]): PyObject {
  // type.__call__ → type.__new__ then type.__init__
  const newFn = lookupInMro(type, Slot.new);
  let obj: PyObject;
  if (typeof newFn === "function") {
    obj = (newFn as Function)(type, ...args) as PyObject;
  } else {
    obj = new PyObject(type);
  }

  const initFn = lookupInMro(type, Slot.init);
  if (typeof initFn === "function") {
    (initFn as Function)(obj, ...args);
  }

  return obj;
}

// ── __class__ access and reassignment ─────────────────────────────────

/** `type(obj)` / `obj.__class__` */
export function pyClass(obj: PyObject): PyType {
  return obj.type;
}

/**
 * `obj.__class__ = NewType` with CPython layout-compatibility checks.
 *
 * CPython only allows __class__ assignment when both classes have
 * compatible __slots__ layouts (same slot names in the same order)
 * or neither uses __slots__ at all.
 */
export function setPyClass(obj: PyObject, newType: PyType): void {
  const oldType = obj.type;
  if (oldType === newType) return;

  // Layout compatibility: both must have the same slots or both none.
  const oldSlots = oldType.slotNames;
  const newSlots = newType.slotNames;

  if (oldSlots === null && newSlots === null) {
    // Both use __dict__ — always compatible.
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

// ── __class_getitem__ (generic aliases) ───────────────────────────────

export function classGetitem(cls: PyType, params: unknown): unknown {
  const fn = lookupInMro(cls, Hook.classGetitem);
  if (typeof fn === "function") return (fn as Function)(cls, params);
  throw new PyTypeError(`type '${cls.name}' is not subscriptable`);
}

// ── isinstance / issubclass ───────────────────────────────────────────

export function isinstance(obj: PyObject, classOrTuple: PyType | PyType[]): boolean {
  const types = Array.isArray(classOrTuple) ? classOrTuple : [classOrTuple];
  for (const cls of types) {
    // Check metaclass __instancecheck__ first.
    const check = lookupInMro(cls.type, Hook.instancecheck);
    if (typeof check === "function") {
      if ((check as Function)(cls, obj)) return true;
      continue;
    }
    if (obj.type.mro.includes(cls)) return true;
  }
  return false;
}

export function issubclass(derived: PyType, classOrTuple: PyType | PyType[]): boolean {
  const types = Array.isArray(classOrTuple) ? classOrTuple : [classOrTuple];
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
