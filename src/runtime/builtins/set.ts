import { PyObject, NotImplemented } from "../core/object.js";
import { Slot, Hook } from "../core/slots.js";
import { makeClass } from "../class/class.js";
import { PyTypeError, PyKeyError } from "../core/errors.js";
import {
  setAddMember,
  setDeleteMember,
  setMemberHas,
} from "./set-membership.js";
import { iter, next } from "../dispatch/protocols.js";
import { PyStopIteration } from "../core/lookup.js";
import { nativeVal, setNative } from "./native.js";
import { keyErrorArg } from "./key-error-arg.js";
import { isSetLikeTypeName, requireSetLikeOperand, setLikeContentsEqual } from "./set-equality.js";
import {
  differenceItems,
  intersectionItems,
  symmetricDifferenceItems,
  unionItems,
} from "./set-algebra.js";
import {
  areDisjoint,
  isProperSubsetOf,
  isProperSupersetOf,
  isSubsetOf,
  isSupersetOf,
} from "./set-ordering.js";

function setRepr(self: PyObject): string {
  const s = nativeVal<Set<unknown>>(self);
  if (s.size === 0) return "set()";
  const items = [...s].map((v) =>
    v instanceof PyObject
      ? typeof v.type.typeDict.get(Slot.repr) === "function"
        ? (v.type.typeDict.get(Slot.repr) as Function)(v)
        : "<item>"
      : String(v),
  );
  return "{" + items.join(", ") + "}";
}

function formatSetSpec(self: PyObject, spec: string): string {
  if (spec === "") return setRepr(self);
  throw new PyTypeError("unsupported format string passed to set.__format__");
}

function forEachSetOperandItem(
  other: unknown,
  method: string,
  visit: (item: unknown) => void,
): void {
  if (other instanceof PyObject && isSetLikeTypeName(other.type.name)) {
    for (const item of nativeVal<Set<unknown>>(other)) visit(item);
    return;
  }
  if (!(other instanceof PyObject)) {
    throw new PyTypeError(
      `'${method}' requires a set-like or iterable operand`,
    );
  }
  let it: PyObject;
  try {
    it = iter(other);
  } catch (e) {
    if (e instanceof PyTypeError) {
      throw new PyTypeError(
        `'${method}' requires a set-like or iterable operand`,
      );
    }
    throw e;
  }
  while (true) {
    try {
      visit(next(it));
    } catch (e) {
      if (e instanceof PyStopIteration) break;
      throw e;
    }
  }
}

function updateSetFrom(other: unknown, target: Set<unknown>): void {
  forEachSetOperandItem(other, "update", (item) => setAddMember(target, item));
}

function intersectionUpdateFrom(other: unknown, target: Set<unknown>): void {
  const otherItems = new Set<unknown>();
  forEachSetOperandItem(other, "intersection_update", (item) =>
    setAddMember(otherItems, item),
  );
  for (const item of [...target]) {
    if (!setMemberHas(otherItems, item)) setDeleteMember(target, item);
  }
}

function differenceUpdateFrom(other: unknown, target: Set<unknown>): void {
  forEachSetOperandItem(other, "difference_update", (item) =>
    setDeleteMember(target, item),
  );
}

function symmetricDifferenceUpdateFrom(
  other: unknown,
  target: Set<unknown>,
): void {
  const otherItems = new Set<unknown>();
  forEachSetOperandItem(other, "symmetric_difference_update", (item) =>
    setAddMember(otherItems, item),
  );
  for (const item of otherItems) {
    if (setMemberHas(target, item)) setDeleteMember(target, item);
    else setAddMember(target, item);
  }
}

// ── pySet ─────────────────────────────────────────────────────────────

export const setType = makeClass({
  name: "set",
  dict: new Map<string | symbol, unknown>([
    [Slot.repr, (self: PyObject) => setRepr(self)],
    [Hook.format, (self: PyObject, spec: string) => formatSetSpec(self, spec)],
    [Slot.len, (self: PyObject) => nativeVal<Set<unknown>>(self).size],
    [Slot.bool, (self: PyObject) => nativeVal<Set<unknown>>(self).size > 0],
    [Slot.contains, (self: PyObject, value: unknown) => {
      return setMemberHas(nativeVal<Set<unknown>>(self), value);
    }],
    [Slot.iter, (self: PyObject) => {
      const vals = [...nativeVal<Set<unknown>>(self)];
      let i = 0;
      const iterType = makeClass({
        name: "set_iterator",
        dict: new Map<string | symbol, unknown>([
          [Slot.iter, (it: PyObject) => it],
          [Slot.next, (_it: PyObject) => {
            if (i >= vals.length) throw new PyStopIteration();
            return vals[i++];
          }],
        ]),
      });
      return new PyObject(iterType);
    }],
    [Slot.and, (self: PyObject, other: PyObject) => {
      if (!isSetLikeTypeName(other.type.name)) return NotImplemented;
      const a = nativeVal<Set<unknown>>(self);
      const b = nativeVal<Set<unknown>>(other);
      return pySet(intersectionItems(a, b));
    }],
    [Slot.or, (self: PyObject, other: PyObject) => {
      if (!isSetLikeTypeName(other.type.name)) return NotImplemented;
      const a = nativeVal<Set<unknown>>(self);
      const b = nativeVal<Set<unknown>>(other);
      return pySet(unionItems(a, b));
    }],
    [Slot.sub, (self: PyObject, other: PyObject) => {
      if (!isSetLikeTypeName(other.type.name)) return NotImplemented;
      const a = nativeVal<Set<unknown>>(self);
      const b = nativeVal<Set<unknown>>(other);
      return pySet(differenceItems(a, b));
    }],
    [Slot.xor, (self: PyObject, other: PyObject) => {
      if (!isSetLikeTypeName(other.type.name)) return NotImplemented;
      const a = nativeVal<Set<unknown>>(self);
      const b = nativeVal<Set<unknown>>(other);
      return pySet(symmetricDifferenceItems(a, b));
    }],
    [Slot.eq, (self: PyObject, other: PyObject) => {
      if (!isSetLikeTypeName(other.type.name)) return NotImplemented;
      return setLikeContentsEqual(self, other);
    }],
    [Slot.le, (self: PyObject, other: PyObject) => {
      if (!isSetLikeTypeName(other.type.name)) return NotImplemented;
      const a = nativeVal<Set<unknown>>(self);
      const b = nativeVal<Set<unknown>>(other);
      return isSubsetOf(a, b);
    }],
    [Slot.lt, (self: PyObject, other: PyObject) => {
      if (!isSetLikeTypeName(other.type.name)) return NotImplemented;
      const a = nativeVal<Set<unknown>>(self);
      const b = nativeVal<Set<unknown>>(other);
      return isProperSubsetOf(a, b);
    }],
    [Slot.ge, (self: PyObject, other: PyObject) => {
      if (!isSetLikeTypeName(other.type.name)) return NotImplemented;
      const a = nativeVal<Set<unknown>>(self);
      const b = nativeVal<Set<unknown>>(other);
      return isSupersetOf(a, b);
    }],
    [Slot.gt, (self: PyObject, other: PyObject) => {
      if (!isSetLikeTypeName(other.type.name)) return NotImplemented;
      const a = nativeVal<Set<unknown>>(self);
      const b = nativeVal<Set<unknown>>(other);
      return isProperSupersetOf(a, b);
    }],
    [Slot.ior, (self: PyObject, other: PyObject) => {
      if (!isSetLikeTypeName(other.type.name)) return NotImplemented;
      const a = nativeVal<Set<unknown>>(self);
      const b = nativeVal<Set<unknown>>(other);
      for (const item of b) setAddMember(a, item);
      return self;
    }],
    [Slot.iand, (self: PyObject, other: PyObject) => {
      if (!isSetLikeTypeName(other.type.name)) return NotImplemented;
      const a = nativeVal<Set<unknown>>(self);
      const b = nativeVal<Set<unknown>>(other);
      for (const item of [...a]) {
        if (!setMemberHas(b, item)) setDeleteMember(a, item);
      }
      return self;
    }],
    [Slot.isub, (self: PyObject, other: PyObject) => {
      if (!isSetLikeTypeName(other.type.name)) return NotImplemented;
      const a = nativeVal<Set<unknown>>(self);
      const b = nativeVal<Set<unknown>>(other);
      for (const item of b) setDeleteMember(a, item);
      return self;
    }],
    [Slot.ixor, (self: PyObject, other: PyObject) => {
      if (!isSetLikeTypeName(other.type.name)) return NotImplemented;
      const a = nativeVal<Set<unknown>>(self);
      const b = nativeVal<Set<unknown>>(other);
      for (const item of b) {
        if (setMemberHas(a, item)) setDeleteMember(a, item);
        else setAddMember(a, item);
      }
      return self;
    }],
    ["issubset", (self: PyObject, other: PyObject) => {
      requireSetLikeOperand(other, "issubset");
      return isSubsetOf(
        nativeVal<Set<unknown>>(self),
        nativeVal<Set<unknown>>(other),
      );
    }],
    ["issuperset", (self: PyObject, other: PyObject) => {
      requireSetLikeOperand(other, "issuperset");
      return isSupersetOf(
        nativeVal<Set<unknown>>(self),
        nativeVal<Set<unknown>>(other),
      );
    }],
    ["isdisjoint", (self: PyObject, other: PyObject) => {
      requireSetLikeOperand(other, "isdisjoint");
      return areDisjoint(
        nativeVal<Set<unknown>>(self),
        nativeVal<Set<unknown>>(other),
      );
    }],
    ["add", (self: PyObject, item: unknown) => {
      setAddMember(nativeVal<Set<unknown>>(self), item);
      return undefined;
    }],
    ["remove", (self: PyObject, item: unknown) => {
      const s = nativeVal<Set<unknown>>(self);
      if (!setDeleteMember(s, item)) throw new PyKeyError(keyErrorArg(item));
      return undefined;
    }],
    ["discard", (self: PyObject, item: unknown) => {
      setDeleteMember(nativeVal<Set<unknown>>(self), item);
      return undefined;
    }],
    ["pop", (self: PyObject) => {
      const s = nativeVal<Set<unknown>>(self);
      if (s.size === 0) throw new PyKeyError("pop from an empty set");
      const item = s.values().next().value;
      s.delete(item);
      return item;
    }],
    ["clear", (self: PyObject) => {
      nativeVal<Set<unknown>>(self).clear();
      return undefined;
    }],
    ["copy", (self: PyObject) => pySet([...nativeVal<Set<unknown>>(self)])],
    ["update", (self: PyObject, other: unknown) => {
      updateSetFrom(other, nativeVal<Set<unknown>>(self));
      return undefined;
    }],
    ["intersection_update", (self: PyObject, other: unknown) => {
      intersectionUpdateFrom(other, nativeVal<Set<unknown>>(self));
      return undefined;
    }],
    ["difference_update", (self: PyObject, other: unknown) => {
      differenceUpdateFrom(other, nativeVal<Set<unknown>>(self));
      return undefined;
    }],
    ["symmetric_difference_update", (self: PyObject, other: unknown) => {
      symmetricDifferenceUpdateFrom(other, nativeVal<Set<unknown>>(self));
      return undefined;
    }],
    ["union", (self: PyObject, other: PyObject) => {
      requireSetLikeOperand(other, "union");
      const a = nativeVal<Set<unknown>>(self);
      const b = nativeVal<Set<unknown>>(other);
      return pySet(unionItems(a, b));
    }],
    ["intersection", (self: PyObject, other: PyObject) => {
      requireSetLikeOperand(other, "intersection");
      const a = nativeVal<Set<unknown>>(self);
      const b = nativeVal<Set<unknown>>(other);
      return pySet(intersectionItems(a, b));
    }],
    ["difference", (self: PyObject, other: PyObject) => {
      requireSetLikeOperand(other, "difference");
      const a = nativeVal<Set<unknown>>(self);
      const b = nativeVal<Set<unknown>>(other);
      return pySet(differenceItems(a, b));
    }],
    ["symmetric_difference", (self: PyObject, other: PyObject) => {
      requireSetLikeOperand(other, "symmetric_difference");
      const a = nativeVal<Set<unknown>>(self);
      const b = nativeVal<Set<unknown>>(other);
      return pySet(symmetricDifferenceItems(a, b));
    }],
  ]),
});

export function pySet(items: unknown[]): PyObject {
  const obj = new PyObject(setType);
  const s = new Set<unknown>();
  for (const item of items) {
    setAddMember(s, item);
  }
  setNative(obj, s);
  return obj;
}

