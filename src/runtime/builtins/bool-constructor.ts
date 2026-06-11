import { PyObject } from "../core/object.js";
import { PyTypeError } from "../core/errors.js";
import { bool as boolProtocol } from "../dispatch/operators/compare.js";
import { boolType, pyFalse, pyTrue } from "./bool.js";

export function bool(...args: unknown[]): PyObject {
  if (args.length === 0) {
    return pyFalse;
  }
  if (args.length > 1) {
    throw new PyTypeError(
      `bool expected at most 1 argument, got ${args.length}`,
    );
  }
  const arg = args[0];
  if (!(arg instanceof PyObject)) {
    const kind = typeof arg;
    throw new PyTypeError(`bool() argument must be PyObject, not ${kind}`);
  }
  if (arg.type === boolType) {
    return arg;
  }
  return boolProtocol(arg) ? pyTrue : pyFalse;
}
