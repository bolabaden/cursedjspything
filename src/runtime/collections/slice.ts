/**
 * slice objects for sequence/mapping subscripting.
 */

import { PyObject } from "../core/object.js";
import { makeClass } from "../class/class.js";
import { Slot } from "../core/slots.js";
import { setNative, nativeVal } from "../builtins/native.js";

export interface SliceFields {
  start: number | null;
  stop: number | null;
  step: number | null;
}

export const sliceType = makeClass({
  name: "slice",
  dict: new Map<string | symbol, unknown>([
    [Slot.repr, (self: PyObject) => {
      const { start, stop, step } = nativeVal<SliceFields>(self);
      const fmt = (v: number | null) => (v === null ? "None" : String(v));
      return `slice(${fmt(start)}, ${fmt(stop)}, ${fmt(step)})`;
    }],
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
  if (s === 0) throw new RangeError("slice step cannot be zero");

  let a = start ?? (s < 0 ? length - 1 : 0);
  let b = stop ?? (s < 0 ? -1 : length);
  if (a < 0) a += length;
  if (b < 0) b += length;
  a = Math.max(0, Math.min(a, length));
  b = Math.max(0, Math.min(b, length));

  const out: number[] = [];
  if (s > 0) {
    for (let i = a; i < b; i += s) out.push(i);
  } else {
    for (let i = a; i > b; i += s) out.push(i);
  }
  return out;
}
