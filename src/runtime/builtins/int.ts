import { PyObject, NotImplemented } from "../core/object.js";
import { Slot, Hook } from "../core/slots.js";
import { lookupSpecial } from "../core/lookup.js";
import { makeClass } from "../class/class.js";
import { nativeVal, setNative } from "./native.js";
import { PyTypeError } from "../core/errors.js";
import { floatType, pyFloat } from "./float.js";
import { pyComplex } from "./complex.js";
import { pyTuple } from "./tuple.js";
import { bytesType, pyBytes } from "./bytes.js";
import { PyZeroDivisionError, PyValueError, PyOverflowError } from "../core/errors.js";

export function truncatingIntFromFloatNumber(value: number): number {
  if (Number.isNaN(value)) {
    throw new PyValueError("cannot convert float NaN to integer");
  }
  if (!Number.isFinite(value)) {
    throw new PyOverflowError("cannot convert float infinity to integer");
  }
  return Math.trunc(value);
}

function shiftCount(other: PyObject): number {
  const n = nativeVal<number>(other);
  if (n < 0) throw new PyValueError("negative shift count");
  return n;
}

function isBoolOperand(other: PyObject): boolean {
  return other.type.name === "bool";
}

function isNumericOperand(other: PyObject): boolean {
  return (
    other.type === intType ||
    other.type === floatType ||
    isBoolOperand(other)
  );
}

function numericOperand(other: PyObject): number {
  if (isBoolOperand(other)) {
    return nativeVal<boolean>(other) ? 1 : 0;
  }
  return nativeVal<number>(other);
}

function repeatCountFromIndexResult(result: unknown): number {
  if (typeof result === "number") return result | 0;
  if (result instanceof PyObject && result.type === intType) {
    return nativeVal<number>(result);
  }
  throw new PyTypeError("__index__ returned non-int");
}

/** Repeat count for str/list/tuple/bytes `__mul__`: int, bool, or `__index__`. */
export function sequenceRepeatCount(other: PyObject): number | null {
  if (other.type === intType || isBoolOperand(other)) {
    return Math.max(0, numericOperand(other));
  }
  const indexFn = lookupSpecial(other, Slot.index);
  if (!indexFn) return null;
  return Math.max(0, repeatCountFromIndexResult(indexFn()));
}

/** Signed integer index for subscripts and slice bounds (int, bool, or `__index__`). */
export function pyIndexAsInteger(other: PyObject): number | null {
  if (other.type === intType || isBoolOperand(other)) {
    return numericOperand(other) | 0;
  }
  const indexFn = lookupSpecial(other, Slot.index);
  if (!indexFn) return null;
  return repeatCountFromIndexResult(indexFn());
}

export { isNumericOperand, numericOperand };

type IntFormatType = "d" | "b" | "o" | "x" | "X";
type IntFormatSign = "" | "+" | "-" | " ";

function intFormatBody(n: number, type: IntFormatType): string {
  switch (type) {
    case "d":
      return String(n);
    case "b":
      return (n >>> 0).toString(2);
    case "o":
      return (n >>> 0).toString(8);
    case "x":
      return (n >>> 0).toString(16);
    case "X":
      return (n >>> 0).toString(16).toUpperCase();
  }
}

function parseIntFormatSign(spec: string): { sign: IntFormatSign; rest: string } {
  if (spec.startsWith("+") || spec.startsWith("-")) {
    return { sign: spec[0] as "+" | "-", rest: spec.slice(1) };
  }
  if (spec.startsWith(" ") && spec.length > 1) {
    const next = spec[1]!;
    if (next === "d" || next === "0" || /\d/.test(next)) {
      return { sign: " ", rest: spec.slice(1) };
    }
  }
  return { sign: "", rest: spec };
}

function signedPrefix(n: number, sign: IntFormatSign): string {
  if (n < 0) return "-";
  if (sign === "+") return "+";
  if (sign === " ") return " ";
  return "";
}

function formatSignedDecimal(n: number, sign: IntFormatSign): string {
  const prefix = signedPrefix(n, sign);
  return prefix + String(Math.abs(n));
}

function padIntFormat(
  n: number,
  width: number,
  type: IntFormatType,
  fill: string,
  sign: IntFormatSign = "",
): string {
  const prefix = signedPrefix(n, sign);
  const magnitude =
    type === "d" ? String(Math.abs(n)) : intFormatBody(Math.abs(n), type);
  const core = prefix + magnitude;
  if (core.length >= width) return core;
  const padCount = width - core.length;
  if (fill === "0" && prefix !== "") {
    return prefix + fill.repeat(padCount) + magnitude;
  }
  return fill.repeat(padCount) + core;
}

function formatIntSpecBody(
  n: number,
  spec: string,
  sign: IntFormatSign,
): string {
  if (spec === "d") return formatSignedDecimal(n, sign);
  if (spec.length === 1) {
    if (spec === "b" || spec === "o" || spec === "x" || spec === "X") {
      const prefix = signedPrefix(n, sign);
      return prefix + intFormatBody(Math.abs(n), spec);
    }
    if (/^\d$/.test(spec)) {
      return padIntFormat(n, Number(spec), "d", " ", sign);
    }
    throw new PyValueError(
      `Unknown format code '${spec}' for object of type 'int'`,
    );
  }

  const zeroPadDecimal = /^0(\d+)$/.exec(spec);
  if (zeroPadDecimal) {
    return padIntFormat(n, Number(zeroPadDecimal[1]), "d", "0", sign);
  }
  const spacePadDecimal = /^(\d+)$/.exec(spec);
  if (spacePadDecimal) {
    return padIntFormat(n, Number(spacePadDecimal[1]), "d", " ", sign);
  }
  const zeroPadTyped = /^0(\d+)([bodxX])$/.exec(spec);
  if (zeroPadTyped) {
    return padIntFormat(
      n,
      Number(zeroPadTyped[1]),
      zeroPadTyped[2] as IntFormatType,
      "0",
      sign,
    );
  }
  const spacePadTyped = /^(\d+)([bodxX])$/.exec(spec);
  if (spacePadTyped) {
    return padIntFormat(
      n,
      Number(spacePadTyped[1]),
      spacePadTyped[2] as IntFormatType,
      " ",
      sign,
    );
  }

  throw new PyValueError(
    `Invalid format specifier '${spec}' for object of type 'int'`,
  );
}

type FloatPresentationType = "f" | "F" | "e" | "E" | "g" | "G" | "%";

interface FloatPresentationSpec {
  readonly fill: string;
  readonly width: number | null;
  readonly precision: number | null;
  readonly type: FloatPresentationType;
}

function parseFloatPresentationSpec(spec: string): FloatPresentationSpec | null {
  let i = 0;
  let fill = " ";
  if (spec[i] === "0" && i + 1 < spec.length && /\d/.test(spec[i + 1]!)) {
    fill = "0";
    i += 1;
  }

  let widthStr = "";
  while (i < spec.length && /\d/.test(spec[i]!)) {
    widthStr += spec[i]!;
    i += 1;
  }
  const width = widthStr === "" ? null : Number(widthStr);

  let precision: number | null = null;
  if (i < spec.length && spec[i] === ".") {
    i += 1;
    let precStr = "";
    while (i < spec.length && /\d/.test(spec[i]!)) {
      precStr += spec[i]!;
      i += 1;
    }
    precision = precStr === "" ? 0 : Number(precStr);
  }

  if (i >= spec.length) return null;
  const type = spec[i]!;
  if (
    type !== "f" &&
    type !== "F" &&
    type !== "e" &&
    type !== "E" &&
    type !== "g" &&
    type !== "G" &&
    type !== "%"
  ) {
    return null;
  }
  if (i !== spec.length - 1) return null;

  return { fill, width, precision, type };
}

function normalizeExponent(s: string): string {
  return s.replace(/e([+-])(\d)$/, "e$10$2").replace(/E([+-])(\d)$/, "E$10$2");
}

function stripGeneralMantissa(mantissa: string): string {
  if (!mantissa.includes(".")) return mantissa;
  return mantissa.replace(/\.?0+$/, "");
}

function formatIntGeneralBody(value: number, precision: number, upper: boolean): string {
  if (value === 0) return "0";
  const intStr = String(Math.trunc(value));
  if (intStr.length <= precision) {
    return intStr;
  }

  const raw = value.toPrecision(precision);
  if (!/[eE]/.test(raw)) {
    return stripGeneralMantissa(raw);
  }

  const match = raw.match(/^(.+)[eE]([+-]?\d+)$/);
  if (match === null) {
    return stripGeneralMantissa(raw);
  }

  const mantissa = stripGeneralMantissa(match[1]!);
  const expNum = Number(match[2]!);
  const expSign = expNum < 0 ? "-" : "+";
  const expDigits = String(Math.abs(expNum)).padStart(2, "0");
  const eChar = upper ? "E" : "e";
  return `${mantissa}${eChar}${expSign}${expDigits}`;
}

function formatIntFloatBody(
  n: number,
  type: FloatPresentationType,
  precision: number,
): string {
  const value = Math.abs(n);
  if (type === "f" || type === "F") {
    return value.toFixed(precision);
  }
  if (type === "g" || type === "G") {
    return formatIntGeneralBody(value, precision, type === "G");
  }
  if (type === "%") {
    return `${(value * 100).toFixed(precision)}%`;
  }
  const raw = value.toExponential(precision);
  const normalized = normalizeExponent(raw);
  return type === "E" ? normalized.toUpperCase() : normalized;
}

function formatIntFloatPresentation(
  n: number,
  spec: string,
  sign: IntFormatSign,
): string {
  const parsed = parseFloatPresentationSpec(spec);
  if (parsed === null) {
    throw new PyValueError(
      `Invalid format specifier '${spec}' for object of type 'int'`,
    );
  }

  const defaultPrecision = 6;
  const precision = parsed.precision ?? defaultPrecision;
  let body = formatIntFloatBody(n, parsed.type, precision);

  if (n < 0) {
    body = "-" + body;
  } else if (sign === "+") {
    body = "+" + body;
  } else if (sign === " ") {
    body = " " + body;
  }

  if (parsed.width !== null && body.length < parsed.width) {
    return parsed.fill.repeat(parsed.width - body.length) + body;
  }
  return body;
}

function typeNameForError(arg: unknown): string {
  if (arg instanceof PyObject) return arg.type.name;
  if (arg === null) return "NoneType";
  return typeof arg;
}

function parseByteorder(
  fn: "to_bytes" | "from_bytes",
  arg: unknown,
): "big" | "little" {
  if (!(arg instanceof PyObject) || arg.type.name !== "str") {
    throw new PyTypeError(
      `${fn}() argument 'byteorder' must be str, not ${typeNameForError(arg)}`,
    );
  }
  const s = nativeVal<string>(arg);
  if (s === "big") return "big";
  if (s === "little") return "little";
  throw new PyValueError("byteorder must be either 'little' or 'big'");
}

function parseToBytesLength(arg: unknown): number {
  if (
    !(arg instanceof PyObject) ||
    (arg.type.name !== "int" && arg.type.name !== "bool")
  ) {
    throw new PyTypeError(
      `to_bytes() argument 'length' must be int, not ${typeNameForError(arg)}`,
    );
  }
  const n =
    arg.type.name === "bool"
      ? nativeVal<boolean>(arg)
        ? 1
        : 0
      : nativeVal<number>(arg);
  if (!Number.isInteger(n) || n < 0) {
    throw new PyValueError("length argument must be non-negative");
  }
  return n;
}

function parseSignedFlag(arg: unknown | undefined): boolean {
  if (arg === undefined) return false;
  if (!(arg instanceof PyObject) || arg.type.name !== "bool") {
    throw new PyTypeError(`signed must be bool, not ${typeNameForError(arg)}`);
  }
  return nativeVal<boolean>(arg);
}

/** CPython int.to_bytes: encode integer as fixed-width byte string. */
export function intToBytes(
  n: number,
  length: number,
  byteorder: "big" | "little",
  signed: boolean,
): Uint8Array {
  if (length < 0) {
    throw new PyValueError("length must be non-negative");
  }

  const v = Math.trunc(n);
  const bitCount = BigInt(length * 8);
  const maxUnsigned = bitCount === 0n ? 0n : (1n << bitCount) - 1n;
  let big = BigInt(v);

  if (!signed) {
    if (v < 0) {
      throw new PyOverflowError("can't convert negative int to unsigned");
    }
    if (big > maxUnsigned) {
      throw new PyOverflowError("int too big to convert");
    }
  } else if (length === 0) {
    if (v !== 0) {
      throw new PyOverflowError("int too big to convert");
    }
  } else {
    const minSigned = -(1n << (bitCount - 1n));
    const maxSigned = (1n << (bitCount - 1n)) - 1n;
    if (big < minSigned || big > maxSigned) {
      throw new PyOverflowError("int too big to convert");
    }
    big = big & maxUnsigned;
  }

  const out = new Uint8Array(length);
  for (let i = 0; i < length; i++) {
    const byte = Number((big >> BigInt(i * 8)) & 0xffn);
    const idx = byteorder === "little" ? i : length - 1 - i;
    out[idx] = byte;
  }
  return out;
}

/** CPython int.from_bytes: decode fixed-width byte string to integer. */
export function intFromBytes(
  data: Uint8Array,
  byteorder: "big" | "little",
  signed: boolean,
): number {
  let big = 0n;
  if (byteorder === "big") {
    for (const b of data) {
      big = (big << 8n) | BigInt(b);
    }
  } else {
    for (let i = data.length - 1; i >= 0; i--) {
      big = (big << 8n) | BigInt(data[i]!);
    }
  }

  if (signed && data.length > 0) {
    const signIndex = byteorder === "big" ? 0 : data.length - 1;
    if ((data[signIndex]! & 0x80) !== 0) {
      const bits = BigInt(data.length * 8);
      big = big - (1n << bits);
    }
  }

  const num = Number(big);
  if (!Number.isSafeInteger(num)) {
    throw new PyOverflowError("int too big to convert");
  }
  return num;
}

function intObjectFromDecoded(n: number): PyObject {
  if (n >= -0x80000000 && n <= 0x7fffffff) {
    return pyInt(n);
  }
  return pyIntFromSafeInteger(n);
}

function intNativeValue(self: PyObject): number | bigint {
  return nativeVal<number | bigint>(self);
}

function intNativeToString(v: number | bigint): string {
  return String(v);
}

function intNativeIsZero(v: number | bigint): boolean {
  return v === 0 || v === 0n;
}

function intNativeHash(v: number | bigint): number {
  if (typeof v === "bigint") {
    return Number(v & 0xffffffffn) | 0;
  }
  return v | 0;
}

/** Int from exact bigint when ratio or decode exceeds safe integer range. */
export function intObjectFromBigInt(n: bigint): PyObject {
  if (
    n >= BigInt(Number.MIN_SAFE_INTEGER) &&
    n <= BigInt(Number.MAX_SAFE_INTEGER)
  ) {
    const num = Number(n);
    if (Number.isSafeInteger(num)) {
      return intObjectFromDecoded(num);
    }
  }
  const obj = new PyObject(intType);
  setNative(obj, n);
  return obj;
}

function toIntBigInt(v: number | bigint): bigint {
  return typeof v === "bigint" ? v : BigInt(Math.trunc(v));
}

function intOperandFromObject(other: PyObject): number | bigint | null {
  if (other.type === intType) return intNativeValue(other);
  if (isBoolOperand(other)) return nativeVal<boolean>(other) ? 1 : 0;
  return null;
}

function compareIntValues(a: number | bigint, b: number | bigint): number {
  const ba = toIntBigInt(a);
  const bb = toIntBigInt(b);
  if (ba < bb) return -1;
  if (ba > bb) return 1;
  return 0;
}

export function intEqFloat(intVal: number | bigint, floatVal: number): boolean {
  if (typeof intVal === "bigint") {
    if (!Number.isFinite(floatVal) || Math.trunc(floatVal) !== floatVal) {
      return false;
    }
    const asNum = Number(intVal);
    if (BigInt(asNum) !== intVal) return false;
    return asNum === floatVal;
  }
  return intVal === floatVal;
}

function intCompareFloat(intVal: number | bigint, floatVal: number): number {
  if (typeof intVal === "bigint") {
    const asNum = Number(intVal);
    if (BigInt(asNum) === intVal) {
      return compareIntValues(asNum, floatVal);
    }
    return asNum < floatVal ? -1 : asNum > floatVal ? 1 : 0;
  }
  return compareIntValues(intVal, floatVal);
}

function intRichCompare(
  selfVal: number | bigint,
  other: PyObject,
  op: "eq" | "ne" | "lt" | "le" | "gt" | "ge",
): boolean | typeof NotImplemented {
  const intOther = intOperandFromObject(other);
  if (intOther !== null) {
    const cmp = compareIntValues(selfVal, intOther);
    switch (op) {
      case "eq":
        return cmp === 0;
      case "ne":
        return cmp !== 0;
      case "lt":
        return cmp < 0;
      case "le":
        return cmp <= 0;
      case "gt":
        return cmp > 0;
      case "ge":
        return cmp >= 0;
    }
  }
  if (other.type === floatType) {
    const f = nativeVal<number>(other);
    if (op === "eq") return intEqFloat(selfVal, f);
    if (op === "ne") return !intEqFloat(selfVal, f);
    const cmp = intCompareFloat(selfVal, f);
    switch (op) {
      case "lt":
        return cmp < 0;
      case "le":
        return cmp <= 0;
      case "gt":
        return cmp > 0;
      case "ge":
        return cmp >= 0;
    }
  }
  return NotImplemented;
}

function intToFloatOperand(v: number | bigint): number {
  return typeof v === "bigint" ? Number(v) : v;
}

function intAddInt(a: number | bigint, b: number | bigint): PyObject {
  return intObjectFromBigInt(toIntBigInt(a) + toIntBigInt(b));
}

function intSubInt(a: number | bigint, b: number | bigint): PyObject {
  return intObjectFromBigInt(toIntBigInt(a) - toIntBigInt(b));
}

function intMulInt(a: number | bigint, b: number | bigint): PyObject {
  return intObjectFromBigInt(toIntBigInt(a) * toIntBigInt(b));
}

function pythonFloorDivBigInt(a: bigint, b: bigint): bigint {
  let q = a / b;
  const r = a % b;
  if (r !== 0n && (r < 0n) !== (b < 0n)) {
    q -= 1n;
  }
  return q;
}

function pythonModBigInt(a: bigint, b: bigint): bigint {
  return a - pythonFloorDivBigInt(a, b) * b;
}

function intFloorDivInt(a: number | bigint, b: number | bigint): PyObject {
  return intObjectFromBigInt(pythonFloorDivBigInt(toIntBigInt(a), toIntBigInt(b)));
}

function intModInt(a: number | bigint, b: number | bigint): PyObject {
  return intObjectFromBigInt(pythonModBigInt(toIntBigInt(a), toIntBigInt(b)));
}

function intDivmodInt(a: number | bigint, b: number | bigint): PyObject {
  const bb = toIntBigInt(b);
  const ba = toIntBigInt(a);
  const q = pythonFloorDivBigInt(ba, bb);
  const r = pythonModBigInt(ba, bb);
  return pyTuple([intObjectFromBigInt(q), intObjectFromBigInt(r)]);
}

function intModPow(base: bigint, exp: bigint, mod: bigint): bigint {
  let b = ((base % mod) + mod) % mod;
  if (mod === 1n) return 0n;
  let e = exp;
  if (e < 0n) {
    b = intModInverse(b, mod);
    e = -e;
  }
  let result = 1n;
  while (e > 0n) {
    if (e & 1n) result = (result * b) % mod;
    e >>= 1n;
    b = (b * b) % mod;
  }
  return result;
}

function intModInverse(a: bigint, mod: bigint): bigint {
  let t = 0n;
  let newT = 1n;
  let r = mod;
  let newR = ((a % mod) + mod) % mod;
  while (newR !== 0n) {
    const q = r / newR;
    [t, newT] = [newT, t - q * newT];
    [r, newR] = [newR, r - q * newR];
  }
  if (r > 1n) {
    throw new PyValueError("base is not invertible for the given modulus");
  }
  if (t < 0n) t += mod;
  return t;
}

function intPowInt(
  base: number | bigint,
  exp: number | bigint,
  mod?: number | bigint,
): PyObject {
  const e = toIntBigInt(exp);
  const b = toIntBigInt(base);
  if (mod !== undefined) {
    const m = toIntBigInt(mod);
    if (m === 0n) throw new PyValueError("pow() 3rd argument cannot be 0");
    return intObjectFromBigInt(intModPow(b, e, m));
  }
  if (e < 0n) {
    if (b === 0n) {
      throw new PyZeroDivisionError("zero to a negative power");
    }
    return pyFloat(
      Math.pow(intToFloatOperand(base), intToFloatOperand(exp)),
    );
  }
  return intObjectFromBigInt(b ** e);
}

/** CPython int.bit_length: bits to represent abs(n) in binary; 0 → 0. */
export function intBitLength(n: number): number {
  const v = Math.trunc(n);
  if (v === 0) return 0;
  return BigInt(Math.abs(v)).toString(2).length;
}

/** CPython int.bit_count: number of 1 bits in abs(n) binary representation; 0 → 0. */
export function intBitCount(n: number): number {
  const v = Math.trunc(n);
  if (v === 0) return 0;
  const bits = BigInt(Math.abs(v)).toString(2);
  let count = 0;
  for (const ch of bits) {
    if (ch === "1") count++;
  }
  return count;
}

export function formatIntSpec(n: number, spec: string): string {
  if (spec === "" || spec === "d") return String(n);
  const { sign, rest } = parseIntFormatSign(spec);
  if (parseFloatPresentationSpec(rest) !== null) {
    return formatIntFloatPresentation(n, rest, sign);
  }
  if (rest.includes(".")) {
    throw new PyValueError("Precision not allowed in integer format specifier");
  }
  return formatIntSpecBody(n, rest, sign);
}

// ── pyInt ─────────────────────────────────────────────────────────────

export const intType = makeClass({
  name: "int",
  dict: new Map<string | symbol, unknown>([
    [Slot.repr, (self: PyObject) => intNativeToString(intNativeValue(self))],
    [Slot.str, (self: PyObject) => intNativeToString(intNativeValue(self))],
    [Slot.hash, (self: PyObject) => intNativeHash(intNativeValue(self))],
    [Slot.bool, (self: PyObject) => !intNativeIsZero(intNativeValue(self))],
    [Slot.int, (self: PyObject) => nativeVal<number>(self)],
    [Slot.float, (self: PyObject) => nativeVal<number>(self)],
    [Slot.index, (self: PyObject) => nativeVal<number>(self)],
    [Hook.complex, (self: PyObject) => pyComplex(nativeVal<number>(self), 0)],
    [Slot.eq, (self: PyObject, other: PyObject) => {
      if (!isNumericOperand(other)) return NotImplemented;
      return intRichCompare(intNativeValue(self), other, "eq");
    }],
    [Slot.lt, (self: PyObject, other: PyObject) => {
      if (!isNumericOperand(other)) return NotImplemented;
      return intRichCompare(intNativeValue(self), other, "lt");
    }],
    [Slot.le, (self: PyObject, other: PyObject) => {
      if (!isNumericOperand(other)) return NotImplemented;
      return intRichCompare(intNativeValue(self), other, "le");
    }],
    [Slot.gt, (self: PyObject, other: PyObject) => {
      if (!isNumericOperand(other)) return NotImplemented;
      return intRichCompare(intNativeValue(self), other, "gt");
    }],
    [Slot.ge, (self: PyObject, other: PyObject) => {
      if (!isNumericOperand(other)) return NotImplemented;
      return intRichCompare(intNativeValue(self), other, "ge");
    }],
    [Slot.ne, (self: PyObject, other: PyObject) => {
      if (!isNumericOperand(other)) return NotImplemented;
      return intRichCompare(intNativeValue(self), other, "ne");
    }],
    [Slot.add, (self: PyObject, other: PyObject) => {
      if (!isNumericOperand(other)) return NotImplemented;
      const selfVal = intNativeValue(self);
      const intOther = intOperandFromObject(other);
      if (intOther !== null) return intAddInt(selfVal, intOther);
      if (other.type === floatType) {
        return pyFloat(intToFloatOperand(selfVal) + nativeVal<number>(other));
      }
      return NotImplemented;
    }],
    [Slot.radd, (self: PyObject, other: PyObject) => {
      if (!isNumericOperand(other)) return NotImplemented;
      const selfVal = intNativeValue(self);
      const intOther = intOperandFromObject(other);
      if (intOther !== null) return intAddInt(intOther, selfVal);
      if (other.type === floatType) {
        return pyFloat(nativeVal<number>(other) + intToFloatOperand(selfVal));
      }
      return NotImplemented;
    }],
    [Slot.sub, (self: PyObject, other: PyObject) => {
      if (!isNumericOperand(other)) return NotImplemented;
      const selfVal = intNativeValue(self);
      const intOther = intOperandFromObject(other);
      if (intOther !== null) return intSubInt(selfVal, intOther);
      if (other.type === floatType) {
        return pyFloat(intToFloatOperand(selfVal) - nativeVal<number>(other));
      }
      return NotImplemented;
    }],
    [Slot.rsub, (self: PyObject, other: PyObject) => {
      if (!isNumericOperand(other)) return NotImplemented;
      const selfVal = intNativeValue(self);
      const intOther = intOperandFromObject(other);
      if (intOther !== null) return intSubInt(intOther, selfVal);
      if (other.type === floatType) {
        return pyFloat(nativeVal<number>(other) - intToFloatOperand(selfVal));
      }
      return NotImplemented;
    }],
    [Slot.mul, (self: PyObject, other: PyObject) => {
      if (!isNumericOperand(other)) return NotImplemented;
      const selfVal = intNativeValue(self);
      const intOther = intOperandFromObject(other);
      if (intOther !== null) return intMulInt(selfVal, intOther);
      if (other.type === floatType) {
        return pyFloat(intToFloatOperand(selfVal) * nativeVal<number>(other));
      }
      return NotImplemented;
    }],
    [Slot.rmul, (self: PyObject, other: PyObject) => {
      if (!isNumericOperand(other)) return NotImplemented;
      const selfVal = intNativeValue(self);
      const intOther = intOperandFromObject(other);
      if (intOther !== null) return intMulInt(intOther, selfVal);
      if (other.type === floatType) {
        return pyFloat(nativeVal<number>(other) * intToFloatOperand(selfVal));
      }
      return NotImplemented;
    }],
    [Slot.truediv, (self: PyObject, other: PyObject) => {
      if (!isNumericOperand(other)) return NotImplemented;
      const d = numericOperand(other);
      if (d === 0) throw new PyZeroDivisionError("division by zero");
      return pyFloat(nativeVal<number>(self) / d);
    }],
    [Slot.floordiv, (self: PyObject, other: PyObject) => {
      if (!isNumericOperand(other)) return NotImplemented;
      const selfVal = intNativeValue(self);
      const intOther = intOperandFromObject(other);
      if (intOther !== null) {
        if (intOther === 0 || intOther === 0n) {
          throw new PyZeroDivisionError("integer division or modulo by zero");
        }
        return intFloorDivInt(selfVal, intOther);
      }
      if (other.type === floatType) {
        const d = nativeVal<number>(other);
        if (d === 0) throw new PyZeroDivisionError("integer division or modulo by zero");
        return pyFloat(Math.floor(intToFloatOperand(selfVal) / d));
      }
      return NotImplemented;
    }],
    [Slot.mod, (self: PyObject, other: PyObject) => {
      if (!isNumericOperand(other)) return NotImplemented;
      const selfVal = intNativeValue(self);
      const intOther = intOperandFromObject(other);
      if (intOther !== null) {
        if (intOther === 0 || intOther === 0n) {
          throw new PyZeroDivisionError("integer modulo by zero");
        }
        return intModInt(selfVal, intOther);
      }
      if (other.type === floatType) {
        const d = nativeVal<number>(other);
        if (d === 0) throw new PyZeroDivisionError("integer modulo by zero");
        const n = intToFloatOperand(selfVal);
        const r = ((n % d) + d) % d;
        return pyFloat(r);
      }
      return NotImplemented;
    }],
    [Slot.pow, (self: PyObject, other: PyObject, modObj?: unknown) => {
      if (!isNumericOperand(other)) return NotImplemented;
      const selfVal = intNativeValue(self);
      if (other.type === floatType) {
        const exp = nativeVal<number>(other);
        if (modObj !== undefined && modObj instanceof PyObject) {
          throw new PyTypeError(
            "pow() 3rd argument not allowed unless all arguments are integers",
          );
        }
        return pyFloat(Math.pow(intToFloatOperand(selfVal), exp));
      }
      const intExp = intOperandFromObject(other);
      if (intExp !== null) {
        if (modObj !== undefined && modObj instanceof PyObject) {
          const modInt = intOperandFromObject(modObj);
          if (modInt !== null) {
            return intPowInt(selfVal, intExp, modInt);
          }
          return NotImplemented;
        }
        return intPowInt(selfVal, intExp);
      }
      return NotImplemented;
    }],
    [Slot.neg, (self: PyObject) => pyInt(-nativeVal<number>(self))],
    [Slot.pos, (self: PyObject) => pyInt(+nativeVal<number>(self))],
    [Slot.abs, (self: PyObject) => pyInt(Math.abs(nativeVal<number>(self)))],
    [Slot.invert, (self: PyObject) => pyInt(~nativeVal<number>(self))],
    [Slot.lshift, (self: PyObject, other: PyObject) => {
      if (other.type !== intType) return NotImplemented;
      return pyInt(nativeVal<number>(self) << shiftCount(other));
    }],
    [Slot.rshift, (self: PyObject, other: PyObject) => {
      if (other.type !== intType) return NotImplemented;
      return pyInt(nativeVal<number>(self) >> shiftCount(other));
    }],
    [Slot.and, (self: PyObject, other: PyObject) => {
      if (other.type !== intType) return NotImplemented;
      return pyInt(nativeVal<number>(self) & nativeVal<number>(other));
    }],
    [Slot.or, (self: PyObject, other: PyObject) => {
      if (other.type !== intType) return NotImplemented;
      return pyInt(nativeVal<number>(self) | nativeVal<number>(other));
    }],
    [Slot.xor, (self: PyObject, other: PyObject) => {
      if (other.type !== intType) return NotImplemented;
      return pyInt(nativeVal<number>(self) ^ nativeVal<number>(other));
    }],
    [Slot.divmod, (self: PyObject, other: PyObject) => {
      if (!isNumericOperand(other)) return NotImplemented;
      const selfVal = intNativeValue(self);
      const intOther = intOperandFromObject(other);
      if (intOther !== null) {
        if (intOther === 0 || intOther === 0n) {
          throw new PyZeroDivisionError("integer division or modulo by zero");
        }
        return intDivmodInt(selfVal, intOther);
      }
      return NotImplemented;
    }],
    [Hook.format, (self: PyObject, spec: string) =>
      formatIntSpec(nativeVal<number>(self), spec)],
    [Hook.round, (self: PyObject, ndigits?: PyObject) => {
      if (ndigits === undefined) return pyInt(Math.round(nativeVal<number>(self)));
      const nd = nativeVal<number>(ndigits);
      const factor = Math.pow(10, nd);
      return pyInt(Math.round(nativeVal<number>(self) * factor) / factor);
    }],
    [Hook.trunc, (self: PyObject) => pyInt(Math.trunc(nativeVal<number>(self)))],
    [Hook.floor, (self: PyObject) => pyInt(Math.floor(nativeVal<number>(self)))],
    [Hook.ceil, (self: PyObject) => pyInt(Math.ceil(nativeVal<number>(self)))],
  ]),
});

export function pyInt(v: number): PyObject {
  const obj = new PyObject(intType);
  setNative(obj, v | 0);
  return obj;
}

/** Int from a safe integer without ToInt32 truncation (e.g. float.as_integer_ratio). */
export function pyIntFromSafeInteger(v: number): PyObject {
  if (!Number.isSafeInteger(v)) {
    throw new PyOverflowError("int too large to convert to float");
  }
  const obj = new PyObject(intType);
  setNative(obj, v);
  return obj;
}

intType.typeDict.set(
  "as_integer_ratio",
  (self: PyObject) => {
    const n = Math.trunc(nativeVal<number>(self));
    return pyTuple([intObjectFromDecoded(n), pyInt(1)]);
  },
);
intType.typeDict.set(
  "bit_length",
  (self: PyObject) => pyInt(intBitLength(nativeVal<number>(self))),
);
intType.typeDict.set(
  "bit_count",
  (self: PyObject) => pyInt(intBitCount(nativeVal<number>(self))),
);
intType.typeDict.set(
  "to_bytes",
  (self: PyObject, lengthArg: unknown, byteorderArg: unknown, signedArg?: unknown) => {
    const length = parseToBytesLength(lengthArg);
    const byteorder = parseByteorder("to_bytes", byteorderArg);
    const signed = parseSignedFlag(signedArg);
    return pyBytes(
      intToBytes(nativeVal<number>(self), length, byteorder, signed),
    );
  },
);
intType.typeDict.set(
  "from_bytes",
  (_cls: unknown, bytesArg: unknown, byteorderArg: unknown, signedArg?: unknown) => {
    if (!(bytesArg instanceof PyObject) || bytesArg.type !== bytesType) {
      throw new PyTypeError(
        `cannot convert '${typeNameForError(bytesArg)}' object to bytes`,
      );
    }
    const byteorder = parseByteorder("from_bytes", byteorderArg);
    const signed = parseSignedFlag(signedArg);
    const data = nativeVal<Uint8Array>(bytesArg);
    return intObjectFromDecoded(intFromBytes(data, byteorder, signed));
  },
);

