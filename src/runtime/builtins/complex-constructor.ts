import { PyObject } from "../core/object.js";
import { PyTypeError, PyValueError } from "../core/errors.js";
import { toComplex, repr } from "../dispatch/operators/numeric.js";
import { nativeVal } from "./native.js";
import { complexType, pyComplex, type ComplexNative } from "./complex.js";
import { strType } from "./str.js";
import { bytesType } from "./bytes.js";
import { floatType } from "./float.js";
import { intType } from "./int.js";
import { boolType } from "./bool.js";
import { numericOperand } from "./int.js";

const FLOAT_COMPONENT_RE = /^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?$/;

function stripOuterWhitespace(text: string): string {
  let start = 0;
  let end = text.length;
  while (start < end && /^\s$/u.test(text[start]!)) start += 1;
  while (end > start && /^\s$/u.test(text[end - 1]!)) end -= 1;
  return text.slice(start, end);
}

function parseFloatComponent(text: string, display: string): number {
  if (!FLOAT_COMPONENT_RE.test(text)) {
    invalidComplexLiteral(display);
  }
  const value = Number(text);
  if (Number.isNaN(value)) {
    invalidComplexLiteral(display);
  }
  return value;
}

function invalidComplexLiteral(display: string): never {
  throw new PyValueError(`complex() arg is a malformed string: ${display}`);
}

function parseComplexLiteralText(text: string, display: string): ComplexNative {
  const parseComponent = (part: string) => parseFloatComponent(part, display);
  let body = stripOuterWhitespace(text);
  if (body === "") {
    invalidComplexLiteral(display);
  }
  if (body.startsWith("(") && body.endsWith(")")) {
    body = body.slice(1, -1).trim();
    if (body === "") {
      invalidComplexLiteral(display);
    }
  }

  const lower = body.toLowerCase();
  if (!lower.endsWith("j")) {
    return { real: parseComponent(body), imag: 0 };
  }

  const withoutJ = body.slice(0, -1);
  const plus = withoutJ.lastIndexOf("+");
  const minus = withoutJ.lastIndexOf("-");
  let splitAt = -1;
  if (plus > 0) splitAt = plus;
  if (minus > 0 && minus > splitAt) splitAt = minus;

  if (splitAt < 0) {
    const imagText = withoutJ.startsWith("+") ? withoutJ.slice(1) : withoutJ;
    if (imagText === "" || imagText === "+") {
      invalidComplexLiteral(display);
    }
    return { real: 0, imag: parseComponent(imagText) };
  }

  const realText = withoutJ.slice(0, splitAt);
  const imagText = withoutJ.slice(splitAt);
  if (realText === "" || imagText === "" || imagText === "+" || imagText === "-") {
    invalidComplexLiteral(display);
  }
  return {
    real: parseComponent(realText),
    imag: parseComponent(imagText),
  };
}

function literalDisplay(arg: PyObject): string {
  if (arg.type === strType) {
    return `'${nativeVal<string>(arg)}'`;
  }
  return repr(arg);
}

function complexFromStrOrBytes(arg: PyObject): PyObject {
  const text =
    arg.type === strType
      ? nativeVal<string>(arg)
      : String.fromCharCode(...nativeVal<Uint8Array>(arg));
  const display = literalDisplay(arg);
  const { real, imag } = parseComplexLiteralText(text, display);
  return pyComplex(real, imag);
}

function asComplexComponent(arg: PyObject): number {
  if (
    arg.type === intType ||
    arg.type === floatType ||
    arg.type === boolType
  ) {
    return numericOperand(arg);
  }
  throw new PyTypeError(
    "complex() argument must be a string or a number, not '" +
      arg.type.name +
      "'",
  );
}

function complexFromTwoArgs(realArg: PyObject, imagArg: PyObject): PyObject {
  return pyComplex(asComplexComponent(realArg), asComplexComponent(imagArg));
}

function complexFromNumeric(arg: PyObject): PyObject {
  if (arg.type === complexType) {
    return arg;
  }
  const result = toComplex(arg);
  if (result instanceof PyObject && result.type === complexType) {
    return result;
  }
  throw new PyTypeError("__complex__ returned non-complex");
}

function complexFromSingleArg(arg: PyObject): PyObject {
  if (arg.type === strType || arg.type === bytesType) {
    return complexFromStrOrBytes(arg);
  }
  return complexFromNumeric(arg);
}

export function complex(...args: unknown[]): PyObject {
  if (args.length === 0) {
    return pyComplex(0, 0);
  }
  if (args.length > 2) {
    throw new PyTypeError(
      `complex expected at most 2 arguments, got ${args.length}`,
    );
  }
  const first = args[0];
  if (!(first instanceof PyObject)) {
    const kind = typeof first;
    throw new PyTypeError(`complex() argument must be PyObject, not ${kind}`);
  }
  if (args.length === 1) {
    return complexFromSingleArg(first);
  }
  const second = args[1];
  if (!(second instanceof PyObject)) {
    const kind = typeof second;
    throw new PyTypeError(`complex() argument must be PyObject, not ${kind}`);
  }
  if (first.type === strType || first.type === bytesType) {
    throw new PyTypeError("complex() can't take second arg if first is a string");
  }
  return complexFromTwoArgs(first, second);
}
