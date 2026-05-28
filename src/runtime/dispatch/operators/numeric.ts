/** Numeric binary, in-place, unary, conversion, and representation. */

import { PyObject, isNotImplemented } from "../../core/object.js";
import { Slot, Hook } from "../../core/slots.js";
import { lookupSpecial } from "../../core/lookup.js";
import { PyTypeError } from "../../core/errors.js";

// ── numeric binary dispatch ───────────────────────────────────────────
// CPython: binary_op1, binary_op (abstract.c)

type BinSlots = { forward: symbol; reflected: symbol };

function binaryOp(a: PyObject, b: PyObject, slots: BinSlots, opSymbol: string): unknown {
  const aType = a.type;
  const bType = b.type;
  const checkedReflectedFirst = aType !== bType && bType.mro.includes(aType);

  if (checkedReflectedFirst) {
    const rFn = lookupSpecial(b, slots.reflected);
    if (rFn) {
      const res = rFn(a);
      if (!isNotImplemented(res)) return res;
    }
  }

  const fFn = lookupSpecial(a, slots.forward);
  if (fFn) {
    const res = fFn(b);
    if (!isNotImplemented(res)) return res;
  }

  if (!checkedReflectedFirst) {
    const rFn = lookupSpecial(b, slots.reflected);
    if (rFn) {
      const res = rFn(a);
      if (!isNotImplemented(res)) return res;
    }
  }

  throw new PyTypeError(
    `unsupported operand type(s) for ${opSymbol}: '${aType.name}' and '${bType.name}'`,
  );
}

function ternaryOp(
  a: PyObject,
  b: PyObject,
  c: PyObject | undefined,
  slots: BinSlots,
  opSymbol: string,
): unknown {
  // __pow__ with optional modulus — CPython ternary_op
  const aType = a.type;
  const bType = b.type;
  const checkedReflectedFirst = aType !== bType && bType.mro.includes(aType);

  if (checkedReflectedFirst) {
    const rFn = lookupSpecial(b, slots.reflected);
    if (rFn) {
      const res = rFn(a, c);
      if (!isNotImplemented(res)) return res;
    }
  }

  const fFn = lookupSpecial(a, slots.forward);
  if (fFn) {
    const res = fFn(b, c);
    if (!isNotImplemented(res)) return res;
  }

  if (!checkedReflectedFirst) {
    const rFn = lookupSpecial(b, slots.reflected);
    if (rFn) {
      const res = rFn(a, c);
      if (!isNotImplemented(res)) return res;
    }
  }

  throw new PyTypeError(
    `unsupported operand type(s) for ${opSymbol}: '${aType.name}' and '${bType.name}'`,
  );
}

// In-place binary: try __iadd__ first, fall back to __add__.
function inplaceOp(
  a: PyObject,
  b: PyObject,
  inplaceSlot: symbol,
  slots: BinSlots,
  opSymbol: string,
): unknown {
  const iFn = lookupSpecial(a, inplaceSlot);
  if (iFn) {
    const res = iFn(b);
    if (!isNotImplemented(res)) return res;
  }
  return binaryOp(a, b, slots, opSymbol);
}

// Unary dispatch.
function unaryOp(obj: PyObject, slot: symbol, opSymbol: string): unknown {
  const fn = lookupSpecial(obj, slot);
  if (!fn) {
    throw new PyTypeError(
      `bad operand type for unary ${opSymbol}: '${obj.type.name}'`,
    );
  }
  return fn();
}

// ── public binary operators ───────────────────────────────────────────

export function add(a: PyObject, b: PyObject) {
  return binaryOp(a, b, { forward: Slot.add, reflected: Slot.radd }, "+");
}
export function sub(a: PyObject, b: PyObject) {
  return binaryOp(a, b, { forward: Slot.sub, reflected: Slot.rsub }, "-");
}
export function mul(a: PyObject, b: PyObject) {
  return binaryOp(a, b, { forward: Slot.mul, reflected: Slot.rmul }, "*");
}
export function matmul(a: PyObject, b: PyObject) {
  return binaryOp(a, b, { forward: Slot.matmul, reflected: Slot.rmatmul }, "@");
}
export function truediv(a: PyObject, b: PyObject) {
  return binaryOp(a, b, { forward: Slot.truediv, reflected: Slot.rtruediv }, "/");
}
export function floordiv(a: PyObject, b: PyObject) {
  return binaryOp(a, b, { forward: Slot.floordiv, reflected: Slot.rfloordiv }, "//");
}
export function mod(a: PyObject, b: PyObject) {
  return binaryOp(a, b, { forward: Slot.mod, reflected: Slot.rmod }, "%");
}
export function divmod(a: PyObject, b: PyObject) {
  return binaryOp(a, b, { forward: Slot.divmod, reflected: Slot.rdivmod }, "divmod()");
}
export function pow(a: PyObject, b: PyObject, c?: PyObject) {
  return ternaryOp(a, b, c, { forward: Slot.pow, reflected: Slot.rpow }, "**");
}
export function lshift(a: PyObject, b: PyObject) {
  return binaryOp(a, b, { forward: Slot.lshift, reflected: Slot.rlshift }, "<<");
}
export function rshift(a: PyObject, b: PyObject) {
  return binaryOp(a, b, { forward: Slot.rshift, reflected: Slot.rrshift }, ">>");
}
export function bitwiseAnd(a: PyObject, b: PyObject) {
  return binaryOp(a, b, { forward: Slot.and, reflected: Slot.rand }, "&");
}
export function bitwiseXor(a: PyObject, b: PyObject) {
  return binaryOp(a, b, { forward: Slot.xor, reflected: Slot.rxor }, "^");
}
export function bitwiseOr(a: PyObject, b: PyObject) {
  return binaryOp(a, b, { forward: Slot.or, reflected: Slot.ror }, "|");
}

// ── public in-place operators ─────────────────────────────────────────

export function iadd(a: PyObject, b: PyObject) {
  return inplaceOp(a, b, Slot.iadd, { forward: Slot.add, reflected: Slot.radd }, "+=");
}
export function isub(a: PyObject, b: PyObject) {
  return inplaceOp(a, b, Slot.isub, { forward: Slot.sub, reflected: Slot.rsub }, "-=");
}
export function imul(a: PyObject, b: PyObject) {
  return inplaceOp(a, b, Slot.imul, { forward: Slot.mul, reflected: Slot.rmul }, "*=");
}
export function imatmul(a: PyObject, b: PyObject) {
  return inplaceOp(a, b, Slot.imatmul, { forward: Slot.matmul, reflected: Slot.rmatmul }, "@=");
}
export function itruediv(a: PyObject, b: PyObject) {
  return inplaceOp(a, b, Slot.itruediv, { forward: Slot.truediv, reflected: Slot.rtruediv }, "/=");
}
export function ifloordiv(a: PyObject, b: PyObject) {
  return inplaceOp(a, b, Slot.ifloordiv, { forward: Slot.floordiv, reflected: Slot.rfloordiv }, "//=");
}
export function imod(a: PyObject, b: PyObject) {
  return inplaceOp(a, b, Slot.imod, { forward: Slot.mod, reflected: Slot.rmod }, "%=");
}
export function ipow(a: PyObject, b: PyObject) {
  return inplaceOp(a, b, Slot.ipow, { forward: Slot.pow, reflected: Slot.rpow }, "**=");
}
export function ilshift(a: PyObject, b: PyObject) {
  return inplaceOp(a, b, Slot.ilshift, { forward: Slot.lshift, reflected: Slot.rlshift }, "<<=");
}
export function irshift(a: PyObject, b: PyObject) {
  return inplaceOp(a, b, Slot.irshift, { forward: Slot.rshift, reflected: Slot.rrshift }, ">>=");
}
export function iand(a: PyObject, b: PyObject) {
  return inplaceOp(a, b, Slot.iand, { forward: Slot.and, reflected: Slot.rand }, "&=");
}
export function ixor(a: PyObject, b: PyObject) {
  return inplaceOp(a, b, Slot.ixor, { forward: Slot.xor, reflected: Slot.rxor }, "^=");
}
export function ior(a: PyObject, b: PyObject) {
  return inplaceOp(a, b, Slot.ior, { forward: Slot.or, reflected: Slot.ror }, "|=");
}

// ── public unary operators ────────────────────────────────────────────

export function neg(obj: PyObject)    { return unaryOp(obj, Slot.neg, "-"); }
export function pos(obj: PyObject)    { return unaryOp(obj, Slot.pos, "+"); }
export function abs(obj: PyObject)    { return unaryOp(obj, Slot.abs, "abs()"); }
export function invert(obj: PyObject) { return unaryOp(obj, Slot.invert, "~"); }

// ── numeric conversions ───────────────────────────────────────────────

export function toInt(obj: PyObject): unknown {
  const fn = lookupSpecial(obj, Slot.int);
  if (!fn) throw new PyTypeError(`int() argument must be a string or a real number, not '${obj.type.name}'`);
  return fn();
}

export function toFloat(obj: PyObject): unknown {
  const fn = lookupSpecial(obj, Slot.float);
  if (!fn) throw new PyTypeError(`float() argument must be a string or a real number, not '${obj.type.name}'`);
  return fn();
}

export function index(obj: PyObject): number {
  const fn = lookupSpecial(obj, Slot.index);
  if (!fn) throw new PyTypeError(`'${obj.type.name}' object cannot be interpreted as an integer`);
  const result = fn();
  if (typeof result !== "number") {
    throw new PyTypeError("__index__ returned non-int");
  }
  return result | 0;
}

export function toComplex(obj: PyObject): unknown {
  const fn = lookupSpecial(obj, Hook.complex);
  if (!fn) throw new PyTypeError(`complex() argument must be a string or a number, not '${obj.type.name}'`);
  return fn();
}

// ── rounding / truncation ─────────────────────────────────────────────

export function round(obj: PyObject, ndigits?: PyObject): unknown {
  const fn = lookupSpecial(obj, Hook.round);
  if (!fn) throw new PyTypeError(`type ${obj.type.name} doesn't define __round__ method`);
  return ndigits !== undefined ? fn(ndigits) : fn();
}

export function trunc(obj: PyObject): unknown {
  const fn = lookupSpecial(obj, Hook.trunc);
  if (!fn) throw new PyTypeError(`type ${obj.type.name} doesn't define __trunc__ method`);
  return fn();
}

export function floor(obj: PyObject): unknown {
  const fn = lookupSpecial(obj, Hook.floor);
  if (!fn) throw new PyTypeError(`type ${obj.type.name} doesn't define __floor__ method`);
  return fn();
}

export function ceil(obj: PyObject): unknown {
  const fn = lookupSpecial(obj, Hook.ceil);
  if (!fn) throw new PyTypeError(`type ${obj.type.name} doesn't define __ceil__ method`);
  return fn();
}

// ── representation ────────────────────────────────────────────────────

export function repr(obj: PyObject): string {
  const fn = lookupSpecial(obj, Slot.repr);
  if (!fn) return `<${obj.type.name} object>`;
  const result = fn();
  if (typeof result !== "string") {
    throw new PyTypeError("__repr__ returned non-string");
  }
  return result;
}

export function str(obj: PyObject): string {
  const fn = lookupSpecial(obj, Slot.str);
  if (fn) {
    const result = fn();
    if (typeof result !== "string") {
      throw new PyTypeError("__str__ returned non-string");
    }
    return result;
  }
  return repr(obj);
}

/** CPython ascii(): repr with non-ASCII code points escaped. */
function escapeNonAsciiInRepr(text: string): string {
  let out = "";
  for (let i = 0; i < text.length; ) {
    const cp = text.codePointAt(i)!;
    if (cp < 0x80) {
      out += text[i]!;
      i += 1;
      continue;
    }
    if (cp <= 0xff) {
      out += `\\x${cp.toString(16).padStart(2, "0")}`;
    } else if (cp <= 0xffff) {
      out += `\\u${cp.toString(16).padStart(4, "0")}`;
    } else {
      out += `\\U${cp.toString(16).padStart(8, "0")}`;
    }
    i += cp > 0xffff ? 2 : 1;
  }
  return out;
}

export function ascii(obj: PyObject): string {
  return escapeNonAsciiInRepr(repr(obj));
}

export function format(obj: PyObject, formatSpec: string = ""): string {
  const fn = lookupSpecial(obj, Hook.format);
  if (!fn) {
    if (formatSpec === "") return str(obj);
    throw new PyTypeError(
      `unsupported format string passed to ${obj.type.name}.__format__`,
    );
  }
  const result = fn(formatSpec);
  if (typeof result !== "string") {
    throw new PyTypeError("__format__ must return a str");
  }
  return result;
}

export function bytes(obj: PyObject): unknown {
  const fn = lookupSpecial(obj, Hook.bytes);
  if (!fn) throw new PyTypeError(`cannot convert '${obj.type.name}' object to bytes`);
  return fn();
}
