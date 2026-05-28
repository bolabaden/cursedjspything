import { PyObject } from "../core/object.js";
import { eq } from "../dispatch/operators/compare.js";
import { nativeVal } from "./native.js";

export function isSetLikeTypeName(name: string): boolean {
  return name === "set" || name === "frozenset";
}

export function setLikeContentsEqual(self: PyObject, other: PyObject): boolean {
  const a = [...nativeVal<Set<unknown>>(self)];
  const b = [...nativeVal<Set<unknown>>(other)];
  if (a.length !== b.length) return false;

  const used = new Array<boolean>(b.length).fill(false);
  for (const item of a) {
    let matched = false;
    for (let i = 0; i < b.length; i++) {
      if (used[i]) continue;
      if (eq(item as PyObject, b[i] as PyObject) === true) {
        used[i] = true;
        matched = true;
        break;
      }
    }
    if (!matched) return false;
  }
  return true;
}
