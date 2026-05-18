/**
 * Native JS payload storage for builtin wrappers and similar types.
 */

import { PyObject } from "../core/object.js";

/** Instance dict key for wrapped native values. */
export const NATIVE_VALUE = Symbol("_nativeValue");

export function setNative(obj: PyObject, value: unknown): void {
  obj.dict.set(NATIVE_VALUE, value);
}

export function nativeVal<T>(obj: PyObject): T {
  return obj.dict.get(NATIVE_VALUE) as T;
}

export function unwrap<T = unknown>(obj: PyObject): T {
  return nativeVal<T>(obj);
}
