import { PyObject } from "../core/object.js";
import { repr } from "../dispatch/operators/index.js";

/** CPython KeyError argument: repr for PyObject keys/items, String otherwise. */
export function keyErrorArg(key: unknown): string {
  if (key instanceof PyObject) return repr(key);
  return String(key);
}
