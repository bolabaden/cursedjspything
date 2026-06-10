import { PyObject, NotImplemented } from "../core/object.js";
import { Slot, Hook } from "../core/slots.js";
import { makeClass } from "../class/class.js";
import { PyStopIteration } from "../core/lookup.js";
import { PyTypeError, PyIndexError, PyValueError } from "../core/errors.js";
import { nativeVal, setNative } from "./native.js";
import { pyIndexAsInteger, sequenceRepeatCount } from "./int.js";
import { buildRepeatedArray } from "./sequence-repeat.js";
import {
  isSlice,
  resolvedSliceFields,
  sliceAdjustIndices,
  sliceIndices,
} from "../collections/slice.js";
import { tupleType } from "./tuple.js";
import { eq } from "../dispatch/operators/compare.js";

function listIndexKey(key: unknown): number {
  let n: number | null = null;
  if (typeof key === "number") {
    n = key;
  } else if (key instanceof PyObject) {
    n = pyIndexAsInteger(key);
  }
  if (n === null) {
    throw new PyTypeError("list indices must be integers");
  }
  return n;
}

function resolveListIndex(key: unknown, length: number, rangeMsg: string): number {
  const n = listIndexKey(key);
  const idx = n < 0 ? length + n : n;
  if (idx < 0 || idx >= length) {
    throw new PyIndexError(rangeMsg);
  }
  return idx;
}

function listRepr(self: PyObject): string {
  const items = nativeVal<PyObject[]>(self);
  return (
    "[" +
    items
      .map((o) => {
        const reprFn = o.type.typeDict.get(Slot.repr);
        return typeof reprFn === "function" ? (reprFn as Function)(o) : "<object>";
      })
      .join(", ") +
    "]"
  );
}

function formatListSpec(self: PyObject, spec: string): string {
  if (spec === "") return listRepr(self);
  throw new PyTypeError("unsupported format string passed to list.__format__");
}

function repeatList(self: PyObject, other: PyObject) {
  const n = sequenceRepeatCount(other);
  if (n === null) return NotImplemented;
  const built = buildRepeatedArray(nativeVal<PyObject[]>(self), n);
  const obj = new PyObject(listType);
  setNative(obj, built);
  return obj;
}

function imulList(self: PyObject, other: PyObject) {
  const n = sequenceRepeatCount(other);
  if (n === null) return NotImplemented;
  setNative(self, buildRepeatedArray(nativeVal<PyObject[]>(self), n));
  return self;
}

function listItemsFromIterable(value: unknown): PyObject[] {
  if (value instanceof PyObject) {
    if (value.type === listType) {
      return [...nativeVal<PyObject[]>(value)];
    }
    if (value.type === tupleType) {
      return [...nativeVal<readonly PyObject[]>(value)];
    }
  }
  const kind = value instanceof PyObject ? value.type.name : typeof value;
  throw new PyTypeError("can only assign an iterable");
}

function delListSlice(arr: PyObject[], key: PyObject): void {
  const { start, stop, step } = resolvedSliceFields(key);
  const indices = sliceIndices(arr.length, start, stop, step);
  for (let i = indices.length - 1; i >= 0; i--) {
    arr.splice(indices[i]!, 1);
  }
}

function setListSlice(arr: PyObject[], key: PyObject, value: unknown): void {
  const items = listItemsFromIterable(value);
  const { start, stop, step } = resolvedSliceFields(key);
  const s = step ?? 1;
  if (s === 1) {
    const [a, b] = sliceAdjustIndices(arr.length, start, stop, step);
    arr.splice(a, b - a, ...items);
    return;
  }
  const indices = sliceIndices(arr.length, start, stop, step);
  if (items.length !== indices.length) {
    throw new PyValueError(
      `attempt to assign sequence of size ${items.length} to extended slice of size ${indices.length}`,
    );
  }
  for (let i = 0; i < indices.length; i++) {
    arr[indices[i]!] = items[i]!;
  }
}

// ── pyList ────────────────────────────────────────────────────────────

export const listType = makeClass({
  name: "list",
  dict: new Map<string | symbol, unknown>([
    [Slot.repr, (self: PyObject) => listRepr(self)],
    [Hook.format, (self: PyObject, spec: string) => formatListSpec(self, spec)],
    [Slot.len, (self: PyObject) => nativeVal<PyObject[]>(self).length],
    [Slot.bool, (self: PyObject) => nativeVal<PyObject[]>(self).length > 0],
    [Slot.getitem, (self: PyObject, key: unknown) => {
      const arr = nativeVal<PyObject[]>(self);
      if (isSlice(key)) {
        const { start, stop, step } = resolvedSliceFields(key);
        const indices = sliceIndices(arr.length, start, stop, step);
        return pyList(indices.map((i) => arr[i]));
      }
      const idx = resolveListIndex(key, arr.length, "list index out of range");
      return arr[idx];
    }],
    [Slot.setitem, (self: PyObject, key: unknown, value: unknown) => {
      const arr = nativeVal<PyObject[]>(self);
      if (isSlice(key)) {
        setListSlice(arr, key, value);
        return;
      }
      const idx = resolveListIndex(
        key,
        arr.length,
        "list assignment index out of range",
      );
      arr[idx] = value as PyObject;
    }],
    [Slot.delitem, (self: PyObject, key: unknown) => {
      const arr = nativeVal<PyObject[]>(self);
      if (isSlice(key)) {
        delListSlice(arr, key);
        return;
      }
      const idx = resolveListIndex(
        key,
        arr.length,
        "list deletion index out of range",
      );
      arr.splice(idx, 1);
    }],
    [Slot.contains, (self: PyObject, value: unknown) => {
      const arr = nativeVal<PyObject[]>(self);
      for (const item of arr) {
        if (item instanceof PyObject && value instanceof PyObject) {
          if (eq(item, value)) return true;
        } else if (item === value) {
          return true;
        }
      }
      return false;
    }],
    [Slot.add, (self: PyObject, other: PyObject) => {
      if (other.type !== listType) return NotImplemented;
      return pyList([...nativeVal<PyObject[]>(self), ...nativeVal<PyObject[]>(other)]);
    }],
    [Slot.iadd, (self: PyObject, other: PyObject) => {
      if (other.type === listType) {
        nativeVal<PyObject[]>(self).push(...nativeVal<PyObject[]>(other));
        return self;
      }
      if (other.type.name === "tuple") {
        nativeVal<PyObject[]>(self).push(...nativeVal<readonly PyObject[]>(other));
        return self;
      }
      return NotImplemented;
    }],
    [Slot.imul, imulList],
    [Slot.mul, repeatList],
    [Slot.rmul, repeatList],
    [Slot.iter, (self: PyObject) => {
      const arr = nativeVal<PyObject[]>(self);
      let i = 0;
      const iterType = makeClass({
        name: "list_iterator",
        dict: new Map<string | symbol, unknown>([
          [Slot.iter, (it: PyObject) => it],
          [Slot.next, (_it: PyObject) => {
            if (i >= arr.length) throw new PyStopIteration();
            return arr[i++];
          }],
        ]),
      });
      return new PyObject(iterType);
    }],
    [Hook.reversed, (self: PyObject) => {
      const arr = nativeVal<PyObject[]>(self);
      let i = arr.length - 1;
      const iterType = makeClass({
        name: "list_reverseiterator",
        dict: new Map<string | symbol, unknown>([
          [Slot.iter, (it: PyObject) => it],
          [Slot.next, (_it: PyObject) => {
            if (i < 0) throw new PyStopIteration();
            return arr[i--];
          }],
        ]),
      });
      return new PyObject(iterType);
    }],
    [Slot.eq, (self: PyObject, other: PyObject) => {
      if (other.type !== listType) return NotImplemented;
      const a = nativeVal<PyObject[]>(self);
      const b = nativeVal<PyObject[]>(other);
      if (a.length !== b.length) return false;
      for (let i = 0; i < a.length; i++) {
        if (eq(a[i], b[i]) !== true) return false;
      }
      return true;
    }],
  ]),
});

export function pyList(items: PyObject[]): PyObject {
  const obj = new PyObject(listType);
  setNative(obj, [...items]);
  return obj;
}

