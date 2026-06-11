import { PyObject } from "../core/object.js";
import { PyTypeError } from "../core/errors.js";
import { ascii as asciiRepr } from "../dispatch/operators/numeric.js";
import { pyStr } from "./str.js";

export function ascii(...args: unknown[]): PyObject {
  if (args.length === 0) {
    throw new PyTypeError("ascii() takes exactly one argument (0 given)");
  }
  if (args.length > 1) {
    throw new PyTypeError(
      `ascii() takes exactly one argument (${args.length} given)`,
    );
  }
  const arg = args[0];
  if (!(arg instanceof PyObject)) {
    const kind = typeof arg;
    throw new PyTypeError(`ascii() argument must be PyObject, not ${kind}`);
  }
  return pyStr(asciiRepr(arg));
}
