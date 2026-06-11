import { PyObject, NotImplemented } from "../core/object.js";
import { Slot, Hook } from "../core/slots.js";
import { makeClass } from "../class/class.js";
import { nativeVal, setNative } from "./native.js";
import {
  intType,
  isNumericOperand,
  numericOperand,
  truncatingIntFromFloatNumber,
} from "./int.js";
import { pyInt, pyIntFromSafeInteger } from "./int.js";
import { pyTuple } from "./tuple.js";
import { pyComplex } from "./complex.js";
import { PyZeroDivisionError, PyValueError, PyOverflowError } from "../core/errors.js";

function gcdBigInt(a: bigint, b: bigint): bigint {
  a = a < 0n ? -a : a;
  b = b < 0n ? -b : b;
  while (b !== 0n) {
    const t = b;
    b = a % b;
    a = t;
  }
  return a;
}

function floatAsIntegerRatio(value: number): [bigint, bigint] {
  if (Number.isNaN(value)) {
    throw new PyValueError("cannot convert NaN to integer ratio");
  }
  if (!Number.isFinite(value)) {
    throw new PyOverflowError("cannot convert Infinity to integer ratio");
  }

  const buf = new ArrayBuffer(8);
  const view = new DataView(buf);
  view.setFloat64(0, value);
  const bits = view.getBigUint64(0);

  const sign = bits >> 63n;
  let exp = (bits >> 52n) & 0x7ffn;
  let mant = bits & 0xfffffffffffffn;

  if (exp === 0n) {
    if (mant === 0n) {
      return [0n, 1n];
    }
  } else {
    mant |= 1n << 52n;
  }

  const exponent = Number(exp) - 1023;
  let numerator = sign === 1n ? -mant : mant;
  let denominator = 1n << 52n;

  if (exponent > 0) {
    numerator <<= BigInt(exponent);
  } else if (exponent < 0) {
    denominator <<= BigInt(-exponent);
  }

  const g = gcdBigInt(numerator < 0n ? -numerator : numerator, denominator);
  numerator /= g;
  denominator /= g;

  return [numerator, denominator];
}

function floatIsInteger(value: number): boolean {
  return Number.isFinite(value) && Number.isInteger(value);
}

function floatDivmodPair(n: number, d: number): PyObject {
  if (d === 0) throw new PyZeroDivisionError("division by zero");
  const q = Math.floor(n / d);
  const r = ((n % d) + d) % d;
  return pyTuple([pyFloat(q), pyFloat(r)]);
}

type FloatFormatSign = "" | "+" | "-" | " ";
type FloatPresentationType = "f" | "F" | "e" | "E" | "g" | "G" | "%";

interface FloatPresentationSpec {
  readonly fill: string;
  readonly width: number | null;
  readonly precision: number | null;
  readonly type: FloatPresentationType;
}

function parseFloatFormatSign(spec: string): {
  sign: FloatFormatSign;
  rest: string;
} {
  if (spec.startsWith("+") || spec.startsWith("-") || spec.startsWith(" ")) {
    return { sign: spec[0] as FloatFormatSign, rest: spec.slice(1) };
  }
  return { sign: "", rest: spec };
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

function formatFloatStrValue(n: number): string {
  const s = String(n);
  return s.includes(".") || s.includes("e") || s.includes("E") ? s : s + ".0";
}

function formatFloatSpecialBody(n: number): string | null {
  if (Number.isNaN(n)) return "nan";
  if (n === Infinity) return "inf";
  if (n === -Infinity) return "-inf";
  return null;
}

function isNegativeFloat(n: number): boolean {
  return n < 0 || Object.is(n, -0);
}

function formatFloatGeneralBody(
  value: number,
  precision: number,
  upper: boolean,
): string {
  if (value === 0) return "0";
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

function formatFloatPresentationBody(
  n: number,
  type: FloatPresentationType,
  precision: number,
): string {
  const special = formatFloatSpecialBody(n);
  if (special !== null) return special;

  const value = Math.abs(n);
  if (type === "f" || type === "F") {
    return value.toFixed(precision);
  }
  if (type === "g" || type === "G") {
    return formatFloatGeneralBody(value, precision, type === "G");
  }
  if (type === "%") {
    return `${(value * 100).toFixed(precision)}%`;
  }
  const raw = value.toExponential(precision);
  const normalized = normalizeExponent(raw);
  return type === "E" ? normalized.toUpperCase() : normalized;
}

function formatFloatPresentation(
  n: number,
  spec: string,
  sign: FloatFormatSign,
): string {
  const parsed = parseFloatPresentationSpec(spec);
  if (parsed === null) {
    throw new PyValueError(
      `Invalid format specifier '${spec}' for object of type 'float'`,
    );
  }

  const defaultPrecision = 6;
  const precision = parsed.precision ?? defaultPrecision;
  let body = formatFloatPresentationBody(n, parsed.type, precision);

  const special = formatFloatSpecialBody(n);
  if (special !== null) {
    if (special.startsWith("-")) {
      body = special;
    } else if (isNegativeFloat(n)) {
      body = "-" + body;
    } else if (sign === "+") {
      body = "+" + body;
    } else if (sign === " ") {
      body = " " + body;
    }
  } else if (isNegativeFloat(n)) {
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

function formatFloatSpec(n: number, spec: string): string {
  if (spec === "") return formatFloatStrValue(n);

  const { sign, rest } = parseFloatFormatSign(spec);
  if (parseFloatPresentationSpec(rest) !== null) {
    return formatFloatPresentation(n, rest, sign);
  }
  if (rest.length === 1 && /[a-zA-Z]/.test(rest)) {
    throw new PyValueError(
      `Unknown format code '${rest}' for object of type 'float'`,
    );
  }
  throw new PyValueError(
    `Invalid format specifier '${spec}' for object of type 'float'`,
  );
}

// ── pyFloat ───────────────────────────────────────────────────────────

export const floatType = makeClass({
  name: "float",
  dict: new Map<string | symbol, unknown>([
    [Slot.repr, (self: PyObject) => {
      const v = nativeVal<number>(self);
      const s = String(v);
      return s.includes(".") || s.includes("e") || s.includes("E") ? s : s + ".0";
    }],
    [Slot.str, (self: PyObject) => {
      const v = nativeVal<number>(self);
      const s = String(v);
      return s.includes(".") || s.includes("e") || s.includes("E") ? s : s + ".0";
    }],
    [Slot.hash, (self: PyObject) => {
      const v = nativeVal<number>(self);
      if (Number.isInteger(v)) return v | 0;
      const buf = new ArrayBuffer(8);
      new Float64Array(buf)[0] = v;
      const [lo, hi] = new Uint32Array(buf);
      return (lo ^ hi) | 0;
    }],
    [Slot.bool, (self: PyObject) => nativeVal<number>(self) !== 0],
    [Slot.int, (self: PyObject) =>
      truncatingIntFromFloatNumber(nativeVal<number>(self))],
    [Slot.float, (self: PyObject) => nativeVal<number>(self)],
    [Hook.complex, (self: PyObject) => pyComplex(nativeVal<number>(self), 0)],
    [Slot.eq, (self: PyObject, other: PyObject) => {
      if (!isNumericOperand(other)) return NotImplemented;
      return nativeVal<number>(self) === numericOperand(other);
    }],
    [Slot.lt, (self: PyObject, other: PyObject) => {
      if (!isNumericOperand(other)) return NotImplemented;
      return nativeVal<number>(self) < numericOperand(other);
    }],
    [Slot.le, (self: PyObject, other: PyObject) => {
      if (!isNumericOperand(other)) return NotImplemented;
      return nativeVal<number>(self) <= numericOperand(other);
    }],
    [Slot.gt, (self: PyObject, other: PyObject) => {
      if (!isNumericOperand(other)) return NotImplemented;
      return nativeVal<number>(self) > numericOperand(other);
    }],
    [Slot.ge, (self: PyObject, other: PyObject) => {
      if (!isNumericOperand(other)) return NotImplemented;
      return nativeVal<number>(self) >= numericOperand(other);
    }],
    [Slot.ne, (self: PyObject, other: PyObject) => {
      if (!isNumericOperand(other)) return NotImplemented;
      return nativeVal<number>(self) !== numericOperand(other);
    }],
    [Slot.add, (self: PyObject, other: PyObject) => {
      if (!isNumericOperand(other)) return NotImplemented;
      return pyFloat(nativeVal<number>(self) + numericOperand(other));
    }],
    [Slot.radd, (self: PyObject, other: PyObject) => {
      if (!isNumericOperand(other)) return NotImplemented;
      return pyFloat(numericOperand(other) + nativeVal<number>(self));
    }],
    [Slot.sub, (self: PyObject, other: PyObject) => {
      if (!isNumericOperand(other)) return NotImplemented;
      return pyFloat(nativeVal<number>(self) - numericOperand(other));
    }],
    [Slot.mul, (self: PyObject, other: PyObject) => {
      if (!isNumericOperand(other)) return NotImplemented;
      return pyFloat(nativeVal<number>(self) * numericOperand(other));
    }],
    [Slot.truediv, (self: PyObject, other: PyObject) => {
      if (!isNumericOperand(other)) return NotImplemented;
      const d = numericOperand(other);
      if (d === 0) throw new PyZeroDivisionError("float division by zero");
      return pyFloat(nativeVal<number>(self) / d);
    }],
    [Slot.floordiv, (self: PyObject, other: PyObject) => {
      if (!isNumericOperand(other)) return NotImplemented;
      const d = numericOperand(other);
      if (d === 0) throw new PyZeroDivisionError("float floor division by zero");
      return pyFloat(Math.floor(nativeVal<number>(self) / d));
    }],
    [Slot.mod, (self: PyObject, other: PyObject) => {
      if (!isNumericOperand(other)) return NotImplemented;
      const d = numericOperand(other);
      if (d === 0) throw new PyZeroDivisionError("float modulo");
      const n = nativeVal<number>(self);
      return pyFloat(((n % d) + d) % d);
    }],
    [Slot.divmod, (self: PyObject, other: PyObject) => {
      if (!isNumericOperand(other)) return NotImplemented;
      return floatDivmodPair(nativeVal<number>(self), numericOperand(other));
    }],
    [Slot.rdivmod, (self: PyObject, other: PyObject) => {
      if (!isNumericOperand(other)) return NotImplemented;
      return floatDivmodPair(numericOperand(other), nativeVal<number>(self));
    }],
    [Slot.pow, (self: PyObject, other: PyObject) => {
      if (!isNumericOperand(other)) return NotImplemented;
      return pyFloat(Math.pow(nativeVal<number>(self), numericOperand(other)));
    }],
    [Slot.neg, (self: PyObject) => pyFloat(-nativeVal<number>(self))],
    [Slot.pos, (self: PyObject) => pyFloat(+nativeVal<number>(self))],
    [Slot.abs, (self: PyObject) => pyFloat(Math.abs(nativeVal<number>(self)))],
    [Hook.round, (self: PyObject, ndigits?: PyObject) => {
      const v = nativeVal<number>(self);
      if (ndigits === undefined) return pyInt(Math.round(v));
      const nd = nativeVal<number>(ndigits);
      const factor = Math.pow(10, nd);
      return pyFloat(Math.round(v * factor) / factor);
    }],
    [Hook.trunc, (self: PyObject) => pyInt(Math.trunc(nativeVal<number>(self)))],
    [Hook.floor, (self: PyObject) => pyInt(Math.floor(nativeVal<number>(self)))],
    [Hook.ceil, (self: PyObject) => pyInt(Math.ceil(nativeVal<number>(self)))],
    [Hook.format, (self: PyObject, spec: string) =>
      formatFloatSpec(nativeVal<number>(self), spec)],
  ]),
});

floatType.typeDict.set(
  "is_integer",
  (self: PyObject) => floatIsInteger(nativeVal<number>(self)),
);
floatType.typeDict.set("as_integer_ratio", (self: PyObject) => {
  const [num, den] = floatAsIntegerRatio(nativeVal<number>(self));
  const numN = Number(num);
  const denN = Number(den);
  if (!Number.isSafeInteger(numN) || !Number.isSafeInteger(denN)) {
    throw new PyOverflowError("integer ratio component too large");
  }
  return pyTuple([pyIntFromSafeInteger(numN), pyIntFromSafeInteger(denN)]);
});

export function pyFloat(v: number): PyObject {
  const obj = new PyObject(floatType);
  setNative(obj, v);
  return obj;
}
