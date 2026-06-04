import { PyObject } from "../core/object.js";
import { hash as hashElement } from "../dispatch/operators/compare.js";

/** CPython hashes set/frozenset elements on insert and membership probes. */
export function requireHashableElement(item: unknown): void {
  if (item instanceof PyObject) {
    hashElement(item);
  }
}
