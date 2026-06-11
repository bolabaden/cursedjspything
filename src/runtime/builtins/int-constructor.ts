import { PyObject } from "../core/object.js";
import { PyTypeError, PyValueError } from "../core/errors.js";
import { toInt, repr } from "../dispatch/operators/numeric.js";
import { nativeVal } from "./native.js";
import { pyIndexAsInteger, pyInt, intType } from "./int.js";
import { strType } from "./str.js";
import { bytesType } from "./bytes.js";

const DIGIT_VALUES: Record<string, number> = Object.fromEntries(
  "0123456789abcdefghijklmnopqrstuvwxyz".split("").map((ch, i) => [ch, i]),
);

function stripOuterWhitespace(text: string): string {
  let start = 0;
  let end = text.length;
  while (start < end && /^\s$/u.test(text[start]!)) start += 1;
  while (end > start && /^\s$/u.test(text[end - 1]!)) end -= 1;
  return text.slice(start, end);
}

function removeUnderscores(
  digits: string,
  allowLeadingUnderscore = false,
): string | null {
  if (digits.endsWith("_") || digits.includes("__")) {
    return null;
  }
  let body = digits;
  if (body.startsWith("_")) {
    if (!allowLeadingUnderscore) return null;
    body = body.slice(1);
  }
  if (body.endsWith("_") || body.includes("__")) {
    return null;
  }
  return body.replaceAll("_", "");
}

function detectBase0Prefix(body: string): { base: number; digits: string } {
  const lower = body.toLowerCase();
  if (lower.startsWith("0x")) return { base: 16, digits: body.slice(2) };
  if (lower.startsWith("0o")) return { base: 8, digits: body.slice(2) };
  if (lower.startsWith("0b")) return { base: 2, digits: body.slice(2) };
  return { base: 10, digits: body };
}

function isBase0AmbiguousLeadingZero(body: string): boolean {
  const lower = body.toLowerCase();
  if (
    lower.startsWith("0x") ||
    lower.startsWith("0o") ||
    lower.startsWith("0b")
  ) {
    return false;
  }
  if (!body.startsWith("0") || body.length <= 1) return false;
  const withoutUnderscores = body.replaceAll("_", "");
  return !/^0+$/.test(withoutUnderscores);
}

function parseDigits(cleaned: string, base: number): number | null {
  if (cleaned === "") return null;
  let value = 0;
  for (const ch of cleaned.toLowerCase()) {
    const digit = DIGIT_VALUES[ch];
    if (digit === undefined || digit >= base) return null;
    value = value * base + digit;
  }
  return value;
}

function literalErrorBase(requestedBase: number, effectiveBase: number): number {
  return requestedBase === 0 ? 0 : effectiveBase;
}

function invalidLiteralError(
  display: string,
  requestedBase: number,
  effectiveBase: number,
): never {
  throw new PyValueError(
    `invalid literal for int() with base ${literalErrorBase(requestedBase, effectiveBase)}: ${display}`,
  );
}

function parseIntLiteralText(text: string, base: number, display: string): number {
  const stripped = stripOuterWhitespace(text);
  if (stripped === "") {
    invalidLiteralError(display, base, base === 0 ? 0 : 10);
  }

  let sign = 1;
  let body = stripped;
  if (body.startsWith("+")) {
    body = body.slice(1);
  } else if (body.startsWith("-")) {
    sign = -1;
    body = body.slice(1);
  }

  let effectiveBase = base;
  let prefixedBase0 = false;
  if (base === 0) {
    const detected = detectBase0Prefix(body);
    effectiveBase = detected.base;
    prefixedBase0 = effectiveBase !== 10;
    if (effectiveBase === 10 && isBase0AmbiguousLeadingZero(body)) {
      invalidLiteralError(display, base, 0);
    }
    body = detected.digits;
  }

  const cleaned = removeUnderscores(body, prefixedBase0);
  if (cleaned === null) {
    invalidLiteralError(display, base, effectiveBase);
  }

  const parsed = parseDigits(cleaned, effectiveBase);
  if (parsed === null) {
    invalidLiteralError(display, base, effectiveBase);
  }
  return sign * parsed;
}

function literalDisplay(arg: PyObject): string {
  if (arg.type === strType) {
    return `'${nativeVal<string>(arg)}'`;
  }
  return repr(arg);
}

function intFromStrOrBytes(arg: PyObject, base: number): PyObject {
  const text =
    arg.type === strType
      ? nativeVal<string>(arg)
      : String.fromCharCode(...nativeVal<Uint8Array>(arg));
  const display = literalDisplay(arg);
  return pyInt(parseIntLiteralText(text, base, display));
}

function intBaseArg(baseArg: unknown): number {
  if (!(baseArg instanceof PyObject)) {
    const kind = typeof baseArg;
    throw new PyTypeError(`int() argument must be PyObject, not ${kind}`);
  }
  const n = pyIndexAsInteger(baseArg);
  if (n === null) {
    throw new PyTypeError(
      `'${baseArg.type.name}' object cannot be interpreted as an integer`,
    );
  }
  if (n !== 0 && (n < 2 || n > 36)) {
    throw new PyValueError("int() base must be >= 2 and <= 36, or 0");
  }
  return n;
}

function intFromNumeric(arg: PyObject): PyObject {
  const result = toInt(arg);
  if (result instanceof PyObject && result.type === intType) {
    return result;
  }
  if (typeof result === "number") {
    if (Number.isNaN(result)) {
      throw new PyValueError("cannot convert float NaN to integer");
    }
    if (!Number.isFinite(result)) {
      throw new PyValueError("cannot convert float infinity to integer");
    }
    return pyInt(result);
  }
  throw new PyTypeError("__int__ returned non-int");
}

function intFromSingleArg(arg: PyObject): PyObject {
  if (arg.type === strType || arg.type === bytesType) {
    return intFromStrOrBytes(arg, 10);
  }
  return intFromNumeric(arg);
}

export function int(...args: unknown[]): PyObject {
  if (args.length === 0) {
    return pyInt(0);
  }
  if (args.length > 2) {
    throw new PyTypeError(
      `int expected at most 2 arguments, got ${args.length}`,
    );
  }
  const arg = args[0];
  if (!(arg instanceof PyObject)) {
    const kind = typeof arg;
    throw new PyTypeError(`int() argument must be PyObject, not ${kind}`);
  }
  if (args.length === 1) {
    return intFromSingleArg(arg);
  }
  const base = intBaseArg(args[1]);
  if (arg.type !== strType && arg.type !== bytesType) {
    throw new PyTypeError("int() can't convert non-string with explicit base");
  }
  return intFromStrOrBytes(arg, base);
}
