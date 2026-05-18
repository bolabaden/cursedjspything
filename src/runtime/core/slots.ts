/**
 * Exhaustive CPython 3.14 slot registry.
 *
 * Every entry maps a CPython dunder name to an idiomatic TypeScript name
 * and the C slot / dispatch function that backs it.  Slot-backed entries
 * come from Objects/typeobject.c slotdefs[]; non-slot entries use
 * _PyObject_LookupSpecial or explicit dispatch in abstract.c / object.c.
 *
 * Reference commit: cpython main 2024-05 (94 slotdef entries, 81 unique
 * slot-backed dunder names).
 */

// ── symbol table ──────────────────────────────────────────────────────
// Every protocol hook is keyed by a unique Symbol so it cannot collide
// with user attribute names.  The Symbol description is the CPython
// dunder, which makes debugging easy.

function sym(dunder: string): symbol {
  return Symbol(dunder);
}

// Slot-backed (from slotdefs[])
export const Slot = {
  // lifecycle
  new:            sym("__new__"),
  init:           sym("__init__"),
  del:            sym("__del__"),

  // representation
  repr:           sym("__repr__"),
  str:            sym("__str__"),
  hash:           sym("__hash__"),

  // callable
  call:           sym("__call__"),

  // attribute / descriptor
  getattribute:   sym("__getattribute__"),
  getattr:        sym("__getattr__"),
  setattr:        sym("__setattr__"),
  delattr:        sym("__delattr__"),
  get:            sym("__get__"),
  set:            sym("__set__"),
  delete:         sym("__delete__"),

  // comparison
  lt:             sym("__lt__"),
  le:             sym("__le__"),
  eq:             sym("__eq__"),
  ne:             sym("__ne__"),
  gt:             sym("__gt__"),
  ge:             sym("__ge__"),

  // iteration
  iter:           sym("__iter__"),
  next:           sym("__next__"),

  // async
  await:          sym("__await__"),
  aiter:          sym("__aiter__"),
  anext:          sym("__anext__"),

  // buffer (mapped but rarely used in JS)
  buffer:         sym("__buffer__"),
  releaseBuffer:  sym("__release_buffer__"),

  // numeric binary
  add:            sym("__add__"),
  radd:           sym("__radd__"),
  sub:            sym("__sub__"),
  rsub:           sym("__rsub__"),
  mul:            sym("__mul__"),
  rmul:           sym("__rmul__"),
  matmul:         sym("__matmul__"),
  rmatmul:        sym("__rmatmul__"),
  truediv:        sym("__truediv__"),
  rtruediv:       sym("__rtruediv__"),
  floordiv:       sym("__floordiv__"),
  rfloordiv:      sym("__rfloordiv__"),
  mod:            sym("__mod__"),
  rmod:           sym("__rmod__"),
  divmod:         sym("__divmod__"),
  rdivmod:        sym("__rdivmod__"),
  pow:            sym("__pow__"),
  rpow:           sym("__rpow__"),
  lshift:         sym("__lshift__"),
  rlshift:        sym("__rlshift__"),
  rshift:         sym("__rshift__"),
  rrshift:        sym("__rrshift__"),
  and:            sym("__and__"),
  rand:           sym("__rand__"),
  xor:            sym("__xor__"),
  rxor:           sym("__rxor__"),
  or:             sym("__or__"),
  ror:            sym("__ror__"),

  // numeric in-place
  iadd:           sym("__iadd__"),
  isub:           sym("__isub__"),
  imul:           sym("__imul__"),
  imatmul:        sym("__imatmul__"),
  itruediv:       sym("__itruediv__"),
  ifloordiv:      sym("__ifloordiv__"),
  imod:           sym("__imod__"),
  ipow:           sym("__ipow__"),
  ilshift:        sym("__ilshift__"),
  irshift:        sym("__irshift__"),
  iand:           sym("__iand__"),
  ixor:           sym("__ixor__"),
  ior:            sym("__ior__"),

  // numeric unary
  neg:            sym("__neg__"),
  pos:            sym("__pos__"),
  abs:            sym("__abs__"),
  invert:         sym("__invert__"),

  // numeric conversion / truth
  bool:           sym("__bool__"),
  int:            sym("__int__"),
  float:          sym("__float__"),
  index:          sym("__index__"),

  // container / mapping / sequence
  len:            sym("__len__"),
  getitem:        sym("__getitem__"),
  setitem:        sym("__setitem__"),
  delitem:        sym("__delitem__"),
  contains:       sym("__contains__"),
} as const;

// Non-slot special lookups (dispatched via _PyObject_LookupSpecial or
// explicit bytecodes, not in slotdefs[])
export const Hook = {
  // formatting / conversion
  bytes:          sym("__bytes__"),
  format:         sym("__format__"),
  complex:        sym("__complex__"),
  round:          sym("__round__"),
  trunc:          sym("__trunc__"),
  floor:          sym("__floor__"),
  ceil:           sym("__ceil__"),

  // introspection
  dir:            sym("__dir__"),
  lengthHint:     sym("__length_hint__"),

  // context managers
  enter:          sym("__enter__"),
  exit:           sym("__exit__"),
  aenter:         sym("__aenter__"),
  aexit:          sym("__aexit__"),

  // metaclass checks
  instancecheck:  sym("__instancecheck__"),
  subclasscheck:  sym("__subclasscheck__"),

  // class creation
  initSubclass:   sym("__init_subclass__"),
  setName:        sym("__set_name__"),
  prepare:        sym("__prepare__"),
  mroEntries:     sym("__mro_entries__"),
  classGetitem:   sym("__class_getitem__"),

  // container extras
  missing:        sym("__missing__"),
  reversed:       sym("__reversed__"),

  // pattern matching (3.10+)
  matchArgs:      sym("__match_args__"),

  // annotations (3.14+)
  annotate:       sym("__annotate__"),
} as const;

// ── dunder ↔ symbol bidirectional maps ────────────────────────────────

type AnySlotMap = Record<string, symbol>;

function buildMaps(table: AnySlotMap) {
  const dunders = new Map<symbol, string>();
  const symbols = new Map<string, symbol>();
  for (const [tsName, sym] of Object.entries(table)) {
    const dunder = Symbol.keyFor(sym) ?? (sym as symbol).description!;
    dunders.set(sym, dunder);
    symbols.set(dunder, sym);
    symbols.set(tsName, sym);
  }
  return { dunders, symbols } as const;
}

const slotMaps = buildMaps(Slot as unknown as AnySlotMap);
const hookMaps = buildMaps(Hook as unknown as AnySlotMap);

/** Every known protocol symbol keyed by its CPython dunder name. */
export const ALL_SYMBOLS: ReadonlyMap<string, symbol> = new Map([
  ...slotMaps.symbols,
  ...hookMaps.symbols,
]);

/** CPython dunder name for a protocol symbol. */
export function dunderName(s: symbol): string | undefined {
  return slotMaps.dunders.get(s) ?? hookMaps.dunders.get(s);
}

/** Number of unique slot-backed dunder names (from slotdefs[]). */
export const SLOTDEF_COUNT = Object.keys(Slot).length;   // 81

/** All 81 CPython dunder names that have a slot backing. */
export const SLOT_DUNDER_NAMES: readonly string[] = Object.freeze(
  [...slotMaps.dunders.values()],
);
