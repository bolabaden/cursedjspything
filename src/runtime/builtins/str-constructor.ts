import { PyObject } from "../core/object.js";
import { PyTypeError } from "../core/errors.js";
import { str as strProtocol } from "../dispatch/operators/numeric.js";
import { pyStr } from "./str.js";
import { bytesType, pyBytesDecode } from "./bytes.js";

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
  if (args.length > 3) {
    throw new PyTypeError(
      `str expected at most 3 arguments, got ${args.length}`,
    );
  }
  const arg = args[0];
  if (!(arg instanceof PyObject)) {
    const kind = typeof arg;
    throw new PyTypeError(`str() argument must be PyObject, not ${kind}`);
  }
  if (arg.type !== bytesType) {
    throw new PyTypeError("decoding str is not supported");
  }
  return pyBytesDecode(arg, args[1], args[2]);
}
