import { PyObject } from "../core/object.js";
import { Slot } from "../core/slots.js";
import { makeClass } from "../class/class.js";
import { lookupSpecial } from "../core/lookup.js";
import { PyStopIteration, PyTypeError } from "../core/errors.js";
import { pyTuple } from "../builtins/tuple.js";

const zipIterType = makeClass({
  name: "zip",
  dict: new Map<string | symbol, unknown>([
    [Slot.iter, (self: PyObject) => self],
    [Slot.next, (self: PyObject) => {
      const iters = self.dict.get("_iters") as PyObject[];
      const values: PyObject[] = [];
      for (const inner of iters) {
        const nextFn = lookupSpecial(inner, Slot.next);
        if (!nextFn) {
          throw new PyTypeError(
            `'${inner.type.name}' object is not an iterator`,
          );
        }
        try {
          const val = nextFn();
          if (!(val instanceof PyObject)) {
            throw new PyTypeError(
              "zip() expects iterator items to be PyObject",
            );
          }
          values.push(val);
        } catch (e) {
          if (e instanceof PyStopIteration) throw e;
          throw e;
        }
      }
      return pyTuple(values);
    }],
  ]),
});

export function makeZipIterator(iters: PyObject[]): PyObject {
  const it = new PyObject(zipIterType);
  it.dict.set("_iters", iters);
  return it;
}
