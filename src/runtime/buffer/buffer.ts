/**
 * Minimal PEP 688 / buffer protocol surface (3.12+).
 */

import { PyObject } from "../core/object.js";
import { NATIVE_VALUE } from "../builtins/native.js";

export interface PyBufferView {
  readonly data: ArrayBuffer | SharedArrayBuffer;
  readonly byteLength: number;
  readonly readonly: boolean;
}

export function wrapBuffer(
  data: ArrayBuffer | SharedArrayBuffer,
  readonly = false,
): PyBufferView {
  return Object.freeze({
    data,
    byteLength: data.byteLength,
    readonly,
  });
}

export function attachBufferView(obj: PyObject, view: PyBufferView): void {
  obj.dict.set(NATIVE_VALUE, view);
}

export function getAttachedBufferView(obj: PyObject): PyBufferView | null {
  const v = obj.dict.get(NATIVE_VALUE);
  return v && typeof v === "object" && "byteLength" in (v as object)
    ? (v as PyBufferView)
    : null;
}
