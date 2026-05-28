/**
 * slice objects for sequence/mapping subscripting.
 */

import { PyObject } from "../core/object.js";
import { makeClass } from "../class/class.js";
import { Slot, Hook } from "../core/slots.js";
import { setNative, nativeVal } from "../builtins/native.js";
import { PyTypeError, PyValueError } from "../core/errors.js";

export interface SliceFields {
  start: number | null;
  stop: number | null;
  step: number | null;
}

function sliceFmt(v: number | null): string {
  return v === null ? "None" : String(v);
}

function sliceRepr(self: PyObject): string {
  const { start, stop, step } = nativeVal<SliceFields>(self);
  return `slice(${sliceFmt(start)}, ${sliceFmt(stop)}, ${sliceFmt(step)})`;
}

function formatSliceSpec(self: PyObject, spec: string): string {
  if (spec === "") return sliceRepr(self);
  throw new PyTypeError("unsupported format string passed to slice.__format__");
}

export const sliceType = makeClass({
  name: "slice",
  dict: new Map<string | symbol, unknown>([
    [Slot.repr, (self: PyObject) => sliceRepr(self)],
    [Slot.bool, (_self: PyObject) => true],
    [Hook.format, (self: PyObject, spec: string) => formatSliceSpec(self, spec)],
  ]),
});

export function pySlice(
  start: number | null = null,
  stop: number | null = null,
  step: number | null = null,
): PyObject {
  const obj = new PyObject(sliceType);
  setNative(obj, { start, stop, step });
  return obj;
}

export function isSlice(v: unknown): v is PyObject {
  return v instanceof PyObject && v.type === sliceType;
}

export function sliceFields(obj: PyObject): SliceFields {
  return nativeVal<SliceFields>(obj);
}

/** Normalize slice indices for a sequence of given length. */
export function sliceIndices(
  length: number,
  start: number | null,
  stop: number | null,
  step: number | null,
): number[] {
  const s = step ?? 1;
  if (s === 0) throw new PyValueError("slice step cannot be zero");

  const out: number[] = [];
  if (s > 0) {
    let a = start ?? 0;
    let b = stop ?? length;
    if (a < 0) a += length;
    if (b < 0) b += length;
    a = Math.max(0, Math.min(a, length));
    b = Math.max(0, Math.min(b, length));
    for (let i = a; i < b; i += s) out.push(i);
  } else {
    let a = start ?? length - 1;
    let b: number;
    if (stop === null) {
      b = -1;
    } else {
      b = stop;
      if (b < 0) {
        b += length;
        if (b < 0) b = -1;
      }
    }
    if (a < 0) {
      a += length;
      if (a < 0) a = -1;
    }
    if (a >= length) a = length - 1;
    for (let i = a; i > b; i += s) {
      if (i >= 0 && i < length) out.push(i);
    }
  }
  return out;
}
