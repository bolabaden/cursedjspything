import { PyObject, NotImplemented } from "../core/object.js";
import { Slot, Hook } from "../core/slots.js";
import { makeClass } from "../class/class.js";
import { nativeVal, setNative } from "./native.js";
import { floatType, pyFloat } from "./float.js";
import { pyTuple } from "./tuple.js";
import { PyZeroDivisionError, PyValueError } from "../core/errors.js";

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

/** Repeat count for str/list/tuple `__mul__`: int or bool (0/1), non-negative. */
export function sequenceRepeatCount(other: PyObject): number | null {
  if (other.type === intType || isBoolOperand(other)) {
    return Math.max(0, numericOperand(other));
  }
  return null;
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
    [Slot.repr, (self: PyObject) => String(nativeVal<number>(self))],
    [Slot.str, (self: PyObject) => String(nativeVal<number>(self))],
    [Slot.hash, (self: PyObject) => nativeVal<number>(self) | 0],
    [Slot.bool, (self: PyObject) => nativeVal<number>(self) !== 0],
    [Slot.int, (self: PyObject) => nativeVal<number>(self)],
    [Slot.float, (self: PyObject) => nativeVal<number>(self)],
    [Slot.index, (self: PyObject) => nativeVal<number>(self)],
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
      return other.type === floatType
        ? pyFloat(nativeVal<number>(self) + numericOperand(other))
        : pyInt(nativeVal<number>(self) + numericOperand(other));
    }],
    [Slot.radd, (self: PyObject, other: PyObject) => {
      if (!isNumericOperand(other)) return NotImplemented;
      return other.type === floatType
        ? pyFloat(numericOperand(other) + nativeVal<number>(self))
        : pyInt(numericOperand(other) + nativeVal<number>(self));
    }],
    [Slot.sub, (self: PyObject, other: PyObject) => {
      if (!isNumericOperand(other)) return NotImplemented;
      return other.type === floatType
        ? pyFloat(nativeVal<number>(self) - numericOperand(other))
        : pyInt(nativeVal<number>(self) - numericOperand(other));
    }],
    [Slot.rsub, (self: PyObject, other: PyObject) => {
      if (!isNumericOperand(other)) return NotImplemented;
      return other.type === floatType
        ? pyFloat(numericOperand(other) - nativeVal<number>(self))
        : pyInt(numericOperand(other) - nativeVal<number>(self));
    }],
    [Slot.mul, (self: PyObject, other: PyObject) => {
      if (!isNumericOperand(other)) return NotImplemented;
      return other.type === floatType
        ? pyFloat(nativeVal<number>(self) * numericOperand(other))
        : pyInt(nativeVal<number>(self) * numericOperand(other));
    }],
    [Slot.rmul, (self: PyObject, other: PyObject) => {
      if (!isNumericOperand(other)) return NotImplemented;
      return other.type === floatType
        ? pyFloat(numericOperand(other) * nativeVal<number>(self))
        : pyInt(numericOperand(other) * nativeVal<number>(self));
    }],
    [Slot.truediv, (self: PyObject, other: PyObject) => {
      if (!isNumericOperand(other)) return NotImplemented;
      const d = numericOperand(other);
      if (d === 0) throw new PyZeroDivisionError("division by zero");
      return pyFloat(nativeVal<number>(self) / d);
    }],
    [Slot.floordiv, (self: PyObject, other: PyObject) => {
      if (!isNumericOperand(other)) return NotImplemented;
      const d = numericOperand(other);
      if (d === 0) throw new PyZeroDivisionError("integer division or modulo by zero");
      return other.type === floatType
        ? pyFloat(Math.floor(nativeVal<number>(self) / d))
        : pyInt(Math.floor(nativeVal<number>(self) / d));
    }],
    [Slot.mod, (self: PyObject, other: PyObject) => {
      if (!isNumericOperand(other)) return NotImplemented;
      const d = numericOperand(other);
      if (d === 0) throw new PyZeroDivisionError("integer modulo by zero");
      const n = nativeVal<number>(self);
      const r = ((n % d) + d) % d;  // Python-style modulo
      return other.type === floatType ? pyFloat(r) : pyInt(r);
    }],
    [Slot.pow, (self: PyObject, other: PyObject, modObj?: unknown) => {
      if (!isNumericOperand(other)) return NotImplemented;
      const base = nativeVal<number>(self);
      const exp = numericOperand(other);
      if (modObj !== undefined && modObj instanceof PyObject) {
        const m = nativeVal<number>(modObj);
        if (m === 0) throw new PyValueError("pow() 3rd argument cannot be 0");
        return pyInt(Number(BigInt(base) ** BigInt(exp) % BigInt(m)));
      }
      return other.type === floatType
        ? pyFloat(Math.pow(base, exp))
        : pyInt(Math.pow(base, exp));
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
      if (other.type !== intType) return NotImplemented;
      const d = nativeVal<number>(other);
      if (d === 0) throw new PyZeroDivisionError("integer division or modulo by zero");
      const n = nativeVal<number>(self);
      const q = Math.floor(n / d);
      const r = ((n % d) + d) % d;
      return pyTuple([pyInt(q), pyInt(r)]);
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

