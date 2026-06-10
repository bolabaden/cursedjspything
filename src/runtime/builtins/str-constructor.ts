import { PyObject } from "../core/object.js";
import { PyTypeError } from "../core/errors.js";
import { str as strProtocol } from "../dispatch/operators/numeric.js";
import { pyStr } from "./str.js";

export function str(...args: unknown[]): PyObject {
  if (args.length === 0) {
    return pyStr("");
  }
  if (args.length === 1) {
    const arg = args[0];
    if (!(arg instanceof PyObject)) {
      const kind = typeof arg;
      throw new PyTypeError(`str() argument must be PyObject, not ${kind}`);
    }
    return pyStr(strProtocol(arg));
  }
  const encoding = args[1];
  const kind =
    encoding instanceof PyObject ? encoding.type.name : typeof encoding;
  throw new PyTypeError(`str() argument 'encoding' must be str, not ${kind}`);
}
