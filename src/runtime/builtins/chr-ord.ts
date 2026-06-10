import { PyObject } from "../core/object.js";
import { PyTypeError, PyValueError } from "../core/errors.js";
import { pyIndexAsInteger, pyInt } from "./int.js";
import { pyStr, strType } from "./str.js";
import { bytesType } from "./bytes.js";
import { nativeVal } from "./native.js";

const CHR_MAX = 0x110000;

function requireSingleArg(name: string, args: unknown[]): void {
  if (args.length === 0) {
    throw new PyTypeError(`${name}() takes exactly one argument (0 given)`);
  }
  if (args.length > 1) {
    throw new PyTypeError(
      `${name}() takes exactly one argument (${args.length} given)`,
    );
  }
}

function strCodePointCount(text: string): number {
  let count = 0;
  for (let i = 0; i < text.length; ) {
    const cp = text.codePointAt(i)!;
    i += cp > 0xffff ? 2 : 1;
    count++;
  }
  return count;
}

export function chr(...args: unknown[]): PyObject {
  requireSingleArg("chr", args);
  const arg = args[0];
  if (!(arg instanceof PyObject)) {
    const kind = typeof arg;
    throw new PyTypeError(`chr() argument must be PyObject, not ${kind}`);
  }
  const i = pyIndexAsInteger(arg);
  if (i === null) {
    throw new PyTypeError(
      `'${arg.type.name}' object cannot be interpreted as an integer`,
    );
  }
  if (i < 0 || i >= CHR_MAX) {
    throw new PyValueError("chr() arg not in range(0x110000)");
  }
  return pyStr(String.fromCodePoint(i));
}

export function ord(...args: unknown[]): PyObject {
  requireSingleArg("ord", args);
  const arg = args[0];
  if (!(arg instanceof PyObject)) {
    const kind = typeof arg;
    throw new PyTypeError(`ord() argument must be PyObject, not ${kind}`);
  }
  if (arg.type === strType) {
    const text = nativeVal<string>(arg);
    const n = strCodePointCount(text);
    if (n !== 1) {
      throw new PyTypeError(
        `ord() expected a character, but string of length ${n} found`,
      );
    }
    return pyInt(text.codePointAt(0)!);
  }
  if (arg.type === bytesType) {
    const data = nativeVal<Uint8Array>(arg);
    if (data.length !== 1) {
      throw new PyTypeError(
        `ord() expected a character, but string of length ${data.length} found`,
      );
    }
    return pyInt(data[0]!);
  }
  throw new PyTypeError(
    `ord() expected string of length 1, but ${arg.type.name} found`,
  );
}
