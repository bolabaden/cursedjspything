import { PyObject } from "../core/object.js";
import { PyTypeError } from "../core/errors.js";
import { pyIndexAsInteger } from "./int.js";
import { pyStr } from "./str.js";

function requireSingleArg(name: string, args: unknown[]): PyObject {
  if (args.length === 0) {
    throw new PyTypeError(`${name}() takes exactly one argument (0 given)`);
  }
  if (args.length > 1) {
    throw new PyTypeError(
      `${name}() takes exactly one argument (${args.length} given)`,
    );
  }
  const arg = args[0];
  if (!(arg instanceof PyObject)) {
    const kind = typeof arg;
    throw new PyTypeError(`${name}() argument must be PyObject, not ${kind}`);
  }
  return arg;
}

function formatRadix(n: number, prefix: string, radix: number): string {
  if (n < 0) {
    return `-${prefix}${Math.abs(n).toString(radix)}`;
  }
  return `${prefix}${n.toString(radix)}`;
}

function intToRadixStr(
  name: string,
  args: unknown[],
  prefix: string,
  radix: number,
): PyObject {
  const arg = requireSingleArg(name, args);
  const n = pyIndexAsInteger(arg);
  if (n === null) {
    throw new PyTypeError(
      `'${arg.type.name}' object cannot be interpreted as an integer`,
    );
  }
  return pyStr(formatRadix(n, prefix, radix));
}

export function bin(...args: unknown[]): PyObject {
  return intToRadixStr("bin", args, "0b", 2);
}

export function oct(...args: unknown[]): PyObject {
  return intToRadixStr("oct", args, "0o", 8);
}

export function hex(...args: unknown[]): PyObject {
  return intToRadixStr("hex", args, "0x", 16);
}
