import { PyObject, NotImplemented } from "../core/object.js";
import { Slot, Hook } from "../core/slots.js";
import { makeClass } from "../class/class.js";
import { PyStopIteration } from "../core/lookup.js";
import { nativeVal, setNative } from "./native.js";
import { intType } from "./int.js";
import { isSlice, sliceFields, sliceIndices } from "../collections/slice.js";
import { eq } from "../dispatch/operators/compare.js";

// ── pyList ────────────────────────────────────────────────────────────

export const listType = makeClass({
  name: "list",
  dict: new Map<string | symbol, unknown>([
    [Slot.repr, (self: PyObject) => {
      const items = nativeVal<PyObject[]>(self);
      return "[" + items.map((o) => {
        const reprFn = o.type.typeDict.get(Slot.repr);
        return typeof reprFn === "function" ? (reprFn as Function)(o) : "<object>";
      }).join(", ") + "]";
    }],
    [Slot.len, (self: PyObject) => nativeVal<PyObject[]>(self).length],
    [Slot.bool, (self: PyObject) => nativeVal<PyObject[]>(self).length > 0],
    [Slot.getitem, (self: PyObject, key: unknown) => {
      const arr = nativeVal<PyObject[]>(self);
      if (isSlice(key)) {
        const { start, stop, step } = sliceFields(key);
        const indices = sliceIndices(arr.length, start, stop, step);
        return pyList(indices.map((i) => arr[i]));
      }
      if (typeof key !== "number") throw new Error("TypeError: list indices must be integers");
      const idx = key < 0 ? arr.length + key : key;
      if (idx < 0 || idx >= arr.length) throw new Error("IndexError: list index out of range");
      return arr[idx];
    }],
    [Slot.setitem, (self: PyObject, key: unknown, value: unknown) => {
      const arr = nativeVal<PyObject[]>(self);
      if (typeof key !== "number") throw new Error("TypeError: list indices must be integers");
      const idx = key < 0 ? arr.length + key : key;
      if (idx < 0 || idx >= arr.length) throw new Error("IndexError: list assignment index out of range");
      arr[idx] = value as PyObject;
    }],
    [Slot.delitem, (self: PyObject, key: unknown) => {
      const arr = nativeVal<PyObject[]>(self);
      if (typeof key !== "number") throw new Error("TypeError: list indices must be integers");
      const idx = key < 0 ? arr.length + key : key;
      if (idx < 0 || idx >= arr.length) throw new Error("IndexError: list deletion index out of range");
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
      if (other.type !== listType) return NotImplemented;
      nativeVal<PyObject[]>(self).push(...nativeVal<PyObject[]>(other));
      return self;
    }],
    [Slot.mul, (self: PyObject, other: PyObject) => {
      if (other.type !== intType) return NotImplemented;
      const n = nativeVal<number>(other);
      const src = nativeVal<PyObject[]>(self);
      const result: PyObject[] = [];
      for (let i = 0; i < n; i++) result.push(...src);
      return pyList(result);
    }],
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
        const eqFn = a[i].type.typeDict.get(Slot.eq);
        if (typeof eqFn === "function") {
          if ((eqFn as Function)(a[i], b[i]) !== true) return false;
        } else if (a[i] !== b[i]) return false;
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

