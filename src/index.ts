/**
 * pyrt — CPython 3.14 object-model runtime for JavaScript/TypeScript.
 *
 * Every Python operation is exposed as an explicit function call:
 *   eq(a, b)         instead of   a == b
 *   is(a, b)         instead of   a is b
 *   add(a, b)        instead of   a + b
 *   getAttr(o, "x")  instead of   o.x
 *   call(f, a, b)    instead of   f(a, b)
 *
 * The internal dispatch matches CPython's slot table and special-method
 * lookup semantics: type-level lookup bypasses instance dicts, subclass
 * reflected ops are tried first, NotImplemented triggers fallbacks, and
 * descriptor precedence follows data-desc > instance > non-data-desc.
 */

// ── slot / hook registry ──────────────────────────────────────────────
export {
  Slot,
  Hook,
  ALL_SYMBOLS,
  dunderName,
  SLOTDEF_COUNT,
  SLOT_DUNDER_NAMES,
} from "./runtime/slots.js";

// ── core object model ─────────────────────────────────────────────────
export {
  PyObject,
  PyType,
  objectType,
  typeType,
  computeC3,
  NotImplemented,
  isNotImplemented,
} from "./runtime/object.js";

// ── attribute access & descriptor protocol ────────────────────────────
export {
  getAttr,
  setAttr,
  delAttr,
  defaultGetAttr,
  defaultSetAttr,
  defaultDelAttr,
  lookupInMro,
  lookupSpecial,
  isDataDescriptor,
  hasGet,
  PyAttributeError,
  PyTypeError,
  PyKeyError,
  PyStopIteration,
  PyValueError,
} from "./runtime/lookup.js";

// ── operators ─────────────────────────────────────────────────────────
export {
  // identity
  is,
  isNot,
  // hashing & truth
  hash,
  bool,
  // comparison
  eq,
  ne,
  lt,
  le,
  gt,
  ge,
  // binary arithmetic
  add,
  sub,
  mul,
  matmul,
  truediv,
  floordiv,
  mod,
  divmod,
  pow,
  lshift,
  rshift,
  bitwiseAnd,
  bitwiseXor,
  bitwiseOr,
  // in-place arithmetic
  iadd,
  isub,
  imul,
  imatmul,
  itruediv,
  ifloordiv,
  imod,
  ipow,
  ilshift,
  irshift,
  iand,
  ixor,
  ior,
  // unary
  neg,
  pos,
  abs,
  invert,
  // conversions
  toInt,
  toFloat,
  index,
  toComplex,
  // rounding
  round,
  trunc,
  floor,
  ceil,
  // representation
  repr,
  str,
  format,
  bytes,
} from "./runtime/operators.js";

// ── class system ──────────────────────────────────────────────────────
export {
  makeClass,
  instantiate,
  pyClass,
  setPyClass,
  classGetitem,
  isinstance,
  issubclass,
  resolveBases,
  calculateMetaclass,
  prepareNamespace,
  type MakeClassOpts,
} from "./runtime/class.js";

// ── protocols ─────────────────────────────────────────────────────────
export {
  call,
  len,
  lengthHint,
  getItem,
  setItem,
  delItem,
  contains,
  iter,
  next,
  reversed,
  enter,
  exit,
  pyAwait,
  aiter,
  anext,
  aenter,
  aexit,
  dir,
  descriptorGet,
  descriptorSet,
  descriptorDelete,
  getBuffer,
  releaseBuffer,
} from "./runtime/protocols.js";

// ── builtin types & factories ─────────────────────────────────────────
export {
  pyNone,
  noneType,
  pyBool,
  pyTrue,
  pyFalse,
  boolType,
  pyInt,
  intType,
  pyFloat,
  floatType,
  pyStr,
  strType,
  pyList,
  listType,
  pyTuple,
  tupleType,
  pyDict,
  dictType,
  pySet,
  setType,
  unwrap,
} from "./runtime/builtins.js";
