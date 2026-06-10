import { PyObject, NotImplemented } from "../core/object.js";
import { Slot, Hook } from "../core/slots.js";
import { makeClass } from "../class/class.js";
import { PyStopIteration, lookupSpecial } from "../core/lookup.js";
import { makeReversedIterator } from "../iterators/reversed-iterator.js";
import { PyTypeError, PyIndexError } from "../core/errors.js";
import { nativeVal, setNative } from "./native.js";
import { pyIndexAsInteger, sequenceRepeatCount } from "./int.js";
import { buildRepeatedArray } from "./sequence-repeat.js";
import { isSlice, sliceFields, sliceIndices } from "../collections/slice.js";
import { eq, hash as objectHash } from "../dispatch/operators/compare.js";

function resolveTupleIndex(key: unknown, length: number): number {
  let n: number | null = null;
  if (typeof key === "number") {
    n = key;
  } else if (key instanceof PyObject) {
    n = pyIndexAsInteger(key);
  }
  if (n === null) {
    throw new PyTypeError("tuple indices must be integers");
  }
  const idx = n < 0 ? length + n : n;
  if (idx < 0 || idx >= length) {
    throw new PyIndexError("tuple index out of range");
  }
  return idx;
}

function tupleRepr(self: PyObject): string {
  const items = nativeVal<readonly PyObject[]>(self);
  if (items.length === 1) {
    const r = items[0].type.typeDict.get(Slot.repr);
    return "(" + (typeof r === "function" ? (r as Function)(items[0]) : "<object>") + ",)";
  }
  return (
    "(" +
    items
      .map((o) => {
        const r = o.type.typeDict.get(Slot.repr);
        return typeof r === "function" ? (r as Function)(o) : "<object>";
      })
      .join(", ") +
    ")"
  );
}

function formatTupleSpec(self: PyObject, spec: string): string {
  if (spec === "") return tupleRepr(self);
  throw new PyTypeError("unsupported format string passed to tuple.__format__");
}

function repeatTuple(self: PyObject, other: PyObject) {
  const n = sequenceRepeatCount(other);
  if (n === null) return NotImplemented;
  const built = buildRepeatedArray(nativeVal<readonly PyObject[]>(self), n);
  const obj = new PyObject(tupleType);
  setNative(obj, Object.freeze(built));
  return obj;
}

// ── pyTuple ───────────────────────────────────────────────────────────

export const tupleType = makeClass({
  name: "tuple",
  dict: new Map<string | symbol, unknown>([
    [Slot.repr, (self: PyObject) => tupleRepr(self)],
    [Hook.format, (self: PyObject, spec: string) => formatTupleSpec(self, spec)],
    [Slot.len, (self: PyObject) => nativeVal<readonly PyObject[]>(self).length],
    [Slot.bool, (self: PyObject) => nativeVal<readonly PyObject[]>(self).length > 0],
    [Slot.hash, (self: PyObject) => {
      const items = nativeVal<readonly PyObject[]>(self);
      let h = 0x345678;
      for (const item of items) {
        const ih = objectHash(item);
        h = (Math.imul(h, 1000003) ^ ih) | 0;
      }
      return h;
    }],
    [Slot.getitem, (self: PyObject, key: unknown) => {
      const arr = nativeVal<readonly PyObject[]>(self);
      if (isSlice(key)) {
        const { start, stop, step } = sliceFields(key);
        const indices = sliceIndices(arr.length, start, stop, step);
        return pyTuple(indices.map((i) => arr[i]));
      }
      const idx = resolveTupleIndex(key, arr.length);
      return arr[idx];
    }],
    [Slot.contains, (self: PyObject, value: unknown) => {
      for (const item of nativeVal<readonly PyObject[]>(self)) {
        if (item instanceof PyObject && value instanceof PyObject) {
          if (eq(item, value)) return true;
        } else if (item === value) {
          return true;
        }
      }
      return false;
    }],
    [Slot.add, (self: PyObject, other: PyObject) => {
      if (other.type !== tupleType) return NotImplemented;
      return pyTuple([...nativeVal<readonly PyObject[]>(self), ...nativeVal<readonly PyObject[]>(other)]);
    }],
    [Slot.mul, repeatTuple],
    [Slot.rmul, repeatTuple],
    [Slot.iter, (self: PyObject) => {
      const arr = nativeVal<readonly PyObject[]>(self);
      let i = 0;
      const iterType = makeClass({
        name: "tuple_iterator",
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
      const lenFn = lookupSpecial(self, Slot.len);
      const giFn = lookupSpecial(self, Slot.getitem);
      if (!lenFn || !giFn) {
        throw new PyTypeError("'tuple' object is not reversible");
      }
      return makeReversedIterator(self, lenFn, giFn);
    }],
    [Slot.eq, (self: PyObject, other: PyObject) => {
      if (other.type !== tupleType) return NotImplemented;
      const a = nativeVal<readonly PyObject[]>(self);
      const b = nativeVal<readonly PyObject[]>(other);
      if (a.length !== b.length) return false;
      for (let i = 0; i < a.length; i++) {
        if (eq(a[i], b[i]) !== true) return false;
      }
      return true;
    }],
  ]),
});

export function pyTuple(items: PyObject[]): PyObject {
  const obj = new PyObject(tupleType);
  setNative(obj, Object.freeze([...items]));
  return obj;
}

