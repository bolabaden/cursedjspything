import { PyObject, NotImplemented } from "../core/object.js";
import { Slot, Hook } from "../core/slots.js";
import { makeClass } from "../class/class.js";
import { PyStopIteration, lookupSpecial } from "../core/lookup.js";
import { callSlotOrThrow } from "../dispatch/dispatch.js";
import { PyTypeError, PyIndexError, PyValueError } from "../core/errors.js";
import { nativeVal, setNative } from "./native.js";
import { pyIndexAsInteger, pyInt, sequenceRepeatCount } from "./int.js";
import { buildRepeatedArray } from "./sequence-repeat.js";
import {
  isSlice,
  resolvedSliceFields,
  sliceAdjustIndices,
  sliceIndices,
} from "../collections/slice.js";
import { pyNone } from "./none.js";
import { tupleType } from "./tuple.js";
import { eq, gt, lt } from "../dispatch/operators/compare.js";
import { iter, next } from "../dispatch/protocols.js";
import { boolType } from "./bool.js";

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
  if (!(value instanceof PyObject)) {
    throw new PyTypeError(`'${typeof value}' object is not iterable`);
  }
  if (value.type === listType) {
    return [...nativeVal<PyObject[]>(value)];
  }
  if (value.type === tupleType) {
    return [...nativeVal<readonly PyObject[]>(value)];
  }
  const out: PyObject[] = [];
  const it = iter(value);
  for (;;) {
    let item: unknown;
    try {
      item = next(it);
    } catch (e) {
      if (e instanceof PyStopIteration) break;
      throw e;
    }
    if (!(item instanceof PyObject)) {
      throw new PyTypeError("iter() returned non-PyObject");
    }
    out.push(item);
  }
  return out;
}

function delListSlice(arr: PyObject[], key: PyObject): void {
  const { start, stop, step } = resolvedSliceFields(key);
  const indices = sliceIndices(arr.length, start, stop, step);
  for (let i = indices.length - 1; i >= 0; i--) {
    arr.splice(indices[i]!, 1);
  }
}

function listInsertIndex(key: unknown, length: number): number {
  let n = listIndexKey(key);
  if (n < 0) n += length;
  if (n < 0) n = 0;
  if (n > length) n = length;
  return n;
}

function parseListBoundIndex(value: unknown): number {
  if (typeof value === "number") return value;
  if (value instanceof PyObject) {
    const n = pyIndexAsInteger(value);
    if (n !== null) return n;
  }
  const kind = value instanceof PyObject ? value.type.name : typeof value;
  throw new PyTypeError(
    "slice indices must be integers or None or have an __index__ method",
  );
}

function listSearchBounds(
  length: number,
  start?: unknown,
  end?: unknown,
): [number, number] {
  let a =
    start === undefined || start === null ? 0 : parseListBoundIndex(start);
  let b = end === undefined || end === null ? length : parseListBoundIndex(end);
  if (a < 0) a += length;
  if (b < 0) b += length;
  a = Math.max(0, Math.min(a, length));
  b = Math.max(0, Math.min(b, length));
  return [a, b];
}

function listItemEq(item: PyObject, value: unknown): boolean {
  if (item instanceof PyObject && value instanceof PyObject) {
    return eq(item, value) === true;
  }
  return item === value;
}

export function sequenceIndex(
  arr: readonly PyObject[],
  value: unknown,
  notFoundMsg: string,
  start?: unknown,
  end?: unknown,
): PyObject {
  const [a, b] = listSearchBounds(arr.length, start, end);
  for (let i = a; i < b; i++) {
    if (listItemEq(arr[i]!, value)) return pyInt(i);
  }
  throw new PyValueError(notFoundMsg);
}

export function sequenceCount(
  arr: readonly PyObject[],
  value: unknown,
  start?: unknown,
  end?: unknown,
): PyObject {
  const [a, b] = listSearchBounds(arr.length, start, end);
  let n = 0;
  for (let i = a; i < b; i++) {
    if (listItemEq(arr[i]!, value)) n++;
  }
  return pyInt(n);
}

function indexList(
  arr: PyObject[],
  value: unknown,
  start?: unknown,
  end?: unknown,
): PyObject {
  return sequenceIndex(
    arr,
    value,
    "list.index(x): x not in list",
    start,
    end,
  );
}

function countList(
  arr: PyObject[],
  value: unknown,
  start?: unknown,
  end?: unknown,
): PyObject {
  return sequenceCount(arr, value, start, end);
}

function removeList(arr: PyObject[], value: unknown): void {
  for (let i = 0; i < arr.length; i++) {
    if (listItemEq(arr[i]!, value)) {
      arr.splice(i, 1);
      return;
    }
  }
  throw new PyValueError("list.remove(x): x not in list");
}

export function parseSortReverse(
  reverse: unknown,
  context: "sort" | "sorted" = "sort",
): boolean {
  if (reverse === undefined || reverse === null) return false;
  if (typeof reverse === "boolean") return reverse;
  if (reverse instanceof PyObject && reverse.type === boolType) {
    return nativeVal<boolean>(reverse);
  }
  const kind = reverse instanceof PyObject ? reverse.type.name : typeof reverse;
  throw new PyTypeError(`${context}() argument must be bool, not ${kind}`);
}

function isSortKeyCallable(value: unknown): value is PyObject {
  return (
    value instanceof PyObject && lookupSpecial(value, Slot.call) !== undefined
  );
}

function sortKeyResult(
  keyFn: PyObject,
  item: PyObject,
  context: "sort" | "sorted" | "min" | "max",
): PyObject {
  const result = callSlotOrThrow(
    keyFn,
    Slot.call,
    `'${keyFn.type.name}' object is not callable`,
    item,
  );
  if (!(result instanceof PyObject)) {
    throw new PyTypeError(`${context}() key function must return PyObject`);
  }
  return result;
}

export function comparePyObjectsForOrder(
  a: PyObject,
  b: PyObject,
  keyFn: PyObject | null,
  context: "sort" | "sorted" | "min" | "max",
): number {
  const ka = keyFn ? sortKeyResult(keyFn, a, context) : a;
  const kb = keyFn ? sortKeyResult(keyFn, b, context) : b;
  if (lt(ka, kb) === true) return -1;
  if (gt(ka, kb) === true) return 1;
  return 0;
}

export function resolveSortOptions(
  key: unknown,
  reverse: unknown,
  context: "sort" | "sorted",
): { keyFn: PyObject | null; reverse: boolean } {
  let keyFn: PyObject | null = null;
  let reverseArg = reverse;

  if (key !== undefined && key !== null && key !== pyNone) {
    if (isSortKeyCallable(key)) {
      keyFn = key;
    } else if (
      reverseArg === undefined &&
      (typeof key === "boolean" ||
        (key instanceof PyObject && key.type === boolType))
    ) {
      reverseArg = key;
    } else {
      throw new PyTypeError(`${context}() key must be callable or None`);
    }
  }

  return {
    keyFn,
    reverse: parseSortReverse(reverseArg, context),
  };
}

export function sortPyObjectsInPlace(
  arr: PyObject[],
  reverse: boolean,
  keyFn: PyObject | null = null,
  context: "sort" | "sorted" = "sort",
): void {
  arr.sort((a, b) => {
    const cmp = comparePyObjectsForOrder(a, b, keyFn, context);
    return reverse ? -cmp : cmp;
  });
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
    ["append", (self: PyObject, item: unknown) => {
      nativeVal<PyObject[]>(self).push(item as PyObject);
      return pyNone;
    }],
    ["extend", (self: PyObject, iterable: unknown) => {
      nativeVal<PyObject[]>(self).push(...listItemsFromIterable(iterable));
      return pyNone;
    }],
    ["insert", (self: PyObject, index: unknown, item: unknown) => {
      const arr = nativeVal<PyObject[]>(self);
      arr.splice(listInsertIndex(index, arr.length), 0, item as PyObject);
      return pyNone;
    }],
    ["pop", (self: PyObject, index?: unknown) => {
      const arr = nativeVal<PyObject[]>(self);
      if (arr.length === 0) {
        throw new PyIndexError("pop from empty list");
      }
      const idx =
        index === undefined || index === null
          ? arr.length - 1
          : resolveListIndex(index, arr.length, "pop index out of range");
      return arr.splice(idx, 1)[0]!;
    }],
    ["index", (self: PyObject, value: unknown, start?: unknown, end?: unknown) => {
      return indexList(nativeVal<PyObject[]>(self), value, start, end);
    }],
    ["count", (self: PyObject, value: unknown, start?: unknown, end?: unknown) => {
      return countList(nativeVal<PyObject[]>(self), value, start, end);
    }],
    ["clear", (self: PyObject) => {
      nativeVal<PyObject[]>(self).length = 0;
      return pyNone;
    }],
    ["copy", (self: PyObject) => {
      return pyList([...nativeVal<PyObject[]>(self)]);
    }],
    ["remove", (self: PyObject, value: unknown) => {
      removeList(nativeVal<PyObject[]>(self), value);
      return pyNone;
    }],
    ["reverse", (self: PyObject) => {
      nativeVal<PyObject[]>(self).reverse();
      return pyNone;
    }],
    ["sort", (self: PyObject, key?: unknown, reverse?: unknown) => {
      const opts = resolveSortOptions(key, reverse, "sort");
      sortPyObjectsInPlace(
        nativeVal<PyObject[]>(self),
        opts.reverse,
        opts.keyFn,
        "sort",
      );
      return pyNone;
    }],
  ]),
});

export function pyList(items: PyObject[]): PyObject {
  const obj = new PyObject(listType);
  setNative(obj, [...items]);
  return obj;
}

