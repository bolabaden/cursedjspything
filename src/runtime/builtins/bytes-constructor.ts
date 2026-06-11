import { PyObject } from "../core/object.js";
import {
  PyStopIteration,
  PyTypeError,
  PyValueError,
} from "../core/errors.js";
import { nativeVal } from "./native.js";
import { pyIndexAsInteger } from "./int.js";
import { pyStr, strType, pyStrEncode } from "./str.js";
import { pyBytes, bytesType } from "./bytes.js";
import { iter, next } from "../dispatch/protocols.js";

function bytesEncodingArg(encoding: unknown): string {
  if (encoding instanceof PyObject && encoding.type === strType) {
    return nativeVal<string>(encoding);
  }
  const kind =
    encoding instanceof PyObject ? encoding.type.name : typeof encoding;
  throw new PyTypeError(
    `bytes() argument 'encoding' must be str, not ${kind}`,
  );
}

function bytesErrorsArg(errors: unknown): string {
  if (errors instanceof PyObject && errors.type === strType) {
    return nativeVal<string>(errors);
  }
  const kind = errors instanceof PyObject ? errors.type.name : typeof errors;
  throw new PyTypeError(`bytes() argument 'errors' must be str, not ${kind}`);
}

function bytesFromSize(n: number): PyObject {
  if (n < 0) {
    throw new PyValueError("negative count");
  }
  return pyBytes(new Uint8Array(n));
}

function bytesFromIterable(arg: PyObject): PyObject {
  const out: number[] = [];
  const it = iter(arg);
  for (;;) {
    let item: unknown;
    try {
      item = next(it);
    } catch (e) {
      if (e instanceof PyStopIteration) break;
      throw e;
    }
    if (!(item instanceof PyObject)) {
      const kind = typeof item;
      throw new PyTypeError(`'${kind}' object cannot be interpreted as an integer`);
    }
    const n = pyIndexAsInteger(item);
    if (n === null) {
      throw new PyTypeError(
        `'${item.type.name}' object cannot be interpreted as an integer`,
      );
    }
    if (n < 0 || n > 255) {
      throw new PyValueError("bytes must be in range(0, 256)");
    }
    out.push(n);
  }
  return pyBytes(new Uint8Array(out));
}

function bytesFromSingleArg(arg: PyObject): PyObject {
  if (arg.type === bytesType) {
    return arg;
  }
  if (arg.type === strType) {
    throw new PyTypeError("string argument without an encoding");
  }
  const size = pyIndexAsInteger(arg);
  if (size !== null) {
    return bytesFromSize(size);
  }
  try {
    return bytesFromIterable(arg);
  } catch (e) {
    if (e instanceof PyValueError) throw e;
    if (
      e instanceof PyTypeError &&
      e.message.includes("object is not iterable")
    ) {
      throw new PyTypeError(`cannot convert '${arg.type.name}' object to bytes`);
    }
    throw e;
  }
}

export function bytes(...args: unknown[]): PyObject {
  if (args.length === 0) {
    return pyBytes(new Uint8Array(0));
  }
  if (args.length > 3) {
    throw new PyTypeError(
      `bytes() takes at most 3 arguments (${args.length} given)`,
    );
  }
  if (args.length >= 2) {
    const arg = args[0];
    if (!(arg instanceof PyObject)) {
      const kind = typeof arg;
      throw new PyTypeError(`bytes() argument must be PyObject, not ${kind}`);
    }
    const encodingName = bytesEncodingArg(args[1]);
    const errorsName =
      args.length === 3 ? bytesErrorsArg(args[2]) : undefined;
    if (arg.type !== strType) {
      throw new PyTypeError("encoding without a string argument");
    }
    return pyStrEncode(
      arg,
      pyStr(encodingName),
      errorsName === undefined ? undefined : pyStr(errorsName),
    );
  }
  const arg = args[0];
  if (!(arg instanceof PyObject)) {
    const kind = typeof arg;
    throw new PyTypeError(`bytes() argument must be PyObject, not ${kind}`);
  }
  return bytesFromSingleArg(arg);
}
