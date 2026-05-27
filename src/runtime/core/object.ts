/**
 * Core object model: PyObject, PyType, identity, instance dictionaries.
 *
 * Every runtime value is (or wraps) a PyObject.  Types are PyType instances
 * whose MRO, slot table, and class-creation hooks mirror CPython's
 * PyTypeObject / PyHeapTypeObject.
 */

import { Slot, Hook, type dunderName } from "./slots.js";
import { PyTypeError } from "./errors.js";

// ── identity ──────────────────────────────────────────────────────────

let nextId = 1;

// ── NotImplemented sentinel ───────────────────────────────────────────

class NotImplementedType {
  toString() { return "NotImplemented"; }
}
export const NotImplemented: NotImplementedType =
  Object.freeze(new NotImplementedType());

export function isNotImplemented(v: unknown): v is NotImplementedType {
  return v instanceof NotImplementedType;
}

// ── PyObject ──────────────────────────────────────────────────────────

export class PyObject {
  /** Unique identity comparable with `is()`. */
  readonly id: number;

  /**
   * The type of this object.  Equivalent to `type(x)` / `x.__class__`.
   * Mutable via `setPyClass` under layout-compatibility constraints.
   */
  type: PyType;

  /** Instance attribute dictionary (`__dict__`). */
  dict: Map<string | symbol, unknown>;

  /** Slot value storage parallel to `type.slots` names. */
  slotValues: unknown[] | null;

  constructor(type: PyType) {
    this.id = nextId++;
    this.type = type;
    this.dict = new Map();
    this.slotValues = type?.slotNames ? new Array(type.slotNames.length).fill(undefined) : null;
  }
}

// ── PyType ────────────────────────────────────────────────────────────

export class PyType extends PyObject {
  readonly name: string;
  readonly bases: readonly PyType[];
  mro: readonly PyType[];

  /**
   * The type's own attribute namespace.  Descriptors, methods and class
   * variables live here.  This is `type.__dict__` in CPython.
   */
  readonly typeDict: Map<string | symbol, unknown>;

  /** `__slots__` names for instances (null = no __slots__). */
  readonly slotNames: readonly string[] | null;

  /** Metaclass of this type — `type(type)`. */
  metaclass: PyType;

  /** `__match_args__` tuple for pattern matching consumers (3.10+). */
  matchArgs: readonly string[] | null;

  /** `__annotations__` dict (3.14+ / typing). */
  annotations: Map<string, unknown>;

  /** Deferred `__annotate__` callable when present (3.14+). */
  annotateFn: ((format: number) => Record<string, unknown>) | null;

  constructor(
    name: string,
    bases: PyType[],
    dict: Map<string | symbol, unknown>,
    metaclass: PyType | null,
    slotNames: readonly string[] | null = null,
  ) {
    // Temporary: pass a placeholder type; fixed up below.
    super(null!);
    this.name = name;
    this.bases = Object.freeze([...bases]);
    this.typeDict = dict;
    this.slotNames = slotNames ? Object.freeze([...slotNames]) : null;

    // Self-referential bootstrap: if metaclass is null, this IS the
    // root `type` object and its type is itself.
    this.metaclass = metaclass ?? (this as PyType);
    this.type = this.metaclass;
    this.matchArgs = null;
    this.annotations = new Map();
    this.annotateFn = null;

    this.mro = computeC3(this);
    Object.freeze(this.mro);
  }
}

// ── C3 linearisation ──────────────────────────────────────────────────

function merge(sequences: PyType[][]): PyType[] {
  const result: PyType[] = [];
  while (sequences.some((s) => s.length > 0)) {
    let next: PyType | undefined;
    for (const seq of sequences) {
      if (seq.length === 0) continue;
      const candidate = seq[0];
      const isTail = sequences.some(
        (s) => s.indexOf(candidate, 1) !== -1,
      );
      if (!isTail) {
        next = candidate;
        break;
      }
    }
    if (!next) {
      throw new PyTypeError(
        "Cannot create a consistent method resolution order (MRO)",
      );
    }
    result.push(next);
    for (const seq of sequences) {
      const idx = seq.indexOf(next);
      if (idx === 0) seq.shift();
    }
  }
  return result;
}

export function computeC3(type: PyType): PyType[] {
  if (type.bases.length === 0) return [type];
  const parentMros = type.bases.map((b) => [...b.mro]);
  const tail = [...type.bases];
  return [type, ...merge([...parentMros, tail])];
}

// ── Bootstrap types ───────────────────────────────────────────────────
// CPython bootstraps `object` and `type` with circular references.
// We reproduce that here.

export const objectType: PyType = new PyType(
  "object",
  [],
  new Map(),
  null,     // metaclass fixed below
  null,
);

export const typeType: PyType = new PyType(
  "type",
  [objectType],
  new Map(),
  null,     // metaclass is self
  null,
);

// Fix up: type's metaclass is itself, object's metaclass is type.
typeType.metaclass = typeType;
typeType.type = typeType;
objectType.metaclass = typeType;
objectType.type = typeType;

// Recompute MROs now that the bootstrap cycle is closed.
(objectType as { mro: readonly PyType[] }).mro = Object.freeze([objectType]);
(typeType as { mro: readonly PyType[] }).mro = Object.freeze([typeType, objectType]);
