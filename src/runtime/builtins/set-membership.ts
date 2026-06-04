import { PyObject } from "../core/object.js";
import { dictKeysEqual } from "../collections/dict-keys.js";
import { requireHashableElement } from "./hashable-element.js";

/** Find a member in the backing set that matches `item`, or undefined. */
export function setFindMember(
  members: Set<unknown>,
  item: unknown,
): unknown | undefined {
  if (members.has(item)) return item;
  if (!(item instanceof PyObject)) return undefined;
  requireHashableElement(item);
  for (const k of members) {
    if (dictKeysEqual(k, item)) return k;
  }
  return undefined;
}

export function setMemberHas(members: Set<unknown>, item: unknown): boolean {
  return setFindMember(members, item) !== undefined;
}

export function setAddMember(members: Set<unknown>, item: unknown): void {
  if (setFindMember(members, item) !== undefined) return;
  requireHashableElement(item);
  members.add(item);
}

export function setDeleteMember(members: Set<unknown>, item: unknown): boolean {
  const found = setFindMember(members, item);
  if (found === undefined) return false;
  members.delete(found);
  return true;
}
