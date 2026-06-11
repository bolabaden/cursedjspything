import { PyObject } from "../core/object.js";
import { PyTypeError, PyValueError } from "../core/errors.js";
import { toFloat, repr } from "../dispatch/operators/numeric.js";
import { nativeVal } from "./native.js";
import { pyFloat, floatType } from "./float.js";
import { strType } from "./str.js";
import { bytesType } from "./bytes.js";

const FLOAT_LITERAL_RE = /^(\d+(\.\d*)?|\.\d+)([eE][+-]?\d+)?$/;
const FLOAT_UNDERSCORE_RE = new RegExp(
  "^(?:\\d+(_\\d+)*(?:\\.(?:\\d+(_\\d+)*)?)?|\\.\\d+(_\\d+)*)(?:[eE][+-]?(?:\\d+(_\\d+)*))?$",
);

function stripOuterWhitespace(text: string): string {
  let start = 0;
  let end = text.length;
  while (start < end && /^\s$/u.test(text[start]!)) start += 1;
  while (end > start && /^\s$/u.test(text[end - 1]!)) end -= 1;
  return text.slice(start, end);
}

function removeUnderscores(digits: string): string | null {
  if (digits.endsWith("_") || digits.includes("__")) {
    return null;
  }
  if (digits.startsWith("_")) {
    return null;
  }
  return digits.replaceAll("_", "");
}

function invalidFloatLiteral(display: string): never {
  throw new PyValueError(`could not convert string to float: ${display}`);
}

function parseFloatLiteralText(text: string, display: string): number {
  const stripped = stripOuterWhitespace(text);
  if (stripped === "") {
    invalidFloatLiteral(display);
  }

  let sign = 1;
  let body = stripped;
  if (body.startsWith("+")) {
    body = body.slice(1);
  } else if (body.startsWith("-")) {
    sign = -1;
    body = body.slice(1);
  }

  const lower = body.toLowerCase();
  if (lower === "inf" || lower === "infinity") {
    return sign * Infinity;
  }
  if (lower === "nan") {
    return NaN;
  }

  if (!FLOAT_UNDERSCORE_RE.test(body)) {
    invalidFloatLiteral(display);
  }

  const cleaned = removeUnderscores(body);
  if (cleaned === null || cleaned === "") {
    invalidFloatLiteral(display);
  }

  if (!FLOAT_LITERAL_RE.test(cleaned)) {
    invalidFloatLiteral(display);
  }

  const value = Number(cleaned);
  if (Number.isNaN(value)) {
    invalidFloatLiteral(display);
  }
  return sign * value;
}

function literalDisplay(arg: PyObject): string {
  if (arg.type === strType) {
    return `'${nativeVal<string>(arg)}'`;
  }
  return repr(arg);
}

function floatFromStrOrBytes(arg: PyObject): PyObject {
  const text =
    arg.type === strType
      ? nativeVal<string>(arg)
      : String.fromCharCode(...nativeVal<Uint8Array>(arg));
  const display = literalDisplay(arg);
  return pyFloat(parseFloatLiteralText(text, display));
}

function floatFromNumeric(arg: PyObject): PyObject {
  if (arg.type === floatType) {
    return arg;
  }
  const result = toFloat(arg);
  if (result instanceof PyObject && result.type === floatType) {
    return result;
  }
  if (typeof result === "number") {
    return pyFloat(result);
  }
  throw new PyTypeError("__float__ returned non-float");
}

function floatFromSingleArg(arg: PyObject): PyObject {
  if (arg.type === strType || arg.type === bytesType) {
    return floatFromStrOrBytes(arg);
  }
  return floatFromNumeric(arg);
}

export function float(...args: unknown[]): PyObject {
  if (args.length === 0) {
    return pyFloat(0.0);
  }
  if (args.length > 1) {
    throw new PyTypeError(
      `float expected at most 1 argument, got ${args.length}`,
    );
  }
  const arg = args[0];
  if (!(arg instanceof PyObject)) {
    const kind = typeof arg;
    throw new PyTypeError(`float() argument must be PyObject, not ${kind}`);
  }
  return floatFromSingleArg(arg);
}
