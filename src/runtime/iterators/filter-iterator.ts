import { PyObject } from "../core/object.js";
import { Slot } from "../core/slots.js";
import { makeClass } from "../class/class.js";
import { lookupSpecial } from "../core/lookup.js";
import { callSlotOrThrow } from "../dispatch/dispatch.js";
import { bool } from "../dispatch/operators/compare.js";
import { PyStopIteration, PyTypeError } from "../core/errors.js";

const filterIterType = makeClass({
  name: "filter",
  dict: new Map<string | symbol, unknown>([
    [Slot.iter, (self: PyObject) => self],
    [Slot.next, (self: PyObject) => {
      const inner = self.dict.get("_iter") as PyObject;
      const func = self.dict.get("_func") as PyObject | null;
      const identity = self.dict.get("_identity") as boolean;
      const nextFn = lookupSpecial(inner, Slot.next);
      if (!nextFn) {
        throw new PyTypeError(
          `'${inner.type.name}' object is not an iterator`,
        );
      }
      while (true) {
        try {
          const item = nextFn();
          if (!(item instanceof PyObject)) {
            throw new PyTypeError(
              "filter() expects iterator items to be PyObject",
            );
          }
          if (identity) {
            if (bool(item)) return item;
            continue;
          }
          const result = callSlotOrThrow(
            func!,
            Slot.call,
            `'${func!.type.name}' object is not callable`,
            item,
          );
          if (!(result instanceof PyObject)) {
            throw new PyTypeError("filter() function must return PyObject");
          }
          if (bool(result)) return item;
        } catch (e) {
          if (e instanceof PyStopIteration) throw e;
          throw e;
        }
      }
    }],
  ]),
});

export function makeFilterIterator(
  func: PyObject | null,
  innerIter: PyObject,
  identity: boolean,
): PyObject {
  const it = new PyObject(filterIterType);
  it.dict.set("_func", func);
  it.dict.set("_iter", innerIter);
  it.dict.set("_identity", identity);
  return it;
}
