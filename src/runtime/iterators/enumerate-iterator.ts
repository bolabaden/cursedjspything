import { PyObject } from "../core/object.js";
import { Slot } from "../core/slots.js";
import { makeClass } from "../class/class.js";
import { lookupSpecial } from "../core/lookup.js";
import { PyStopIteration, PyTypeError } from "../core/errors.js";
import { pyInt } from "../builtins/int.js";
import { pyTuple } from "../builtins/tuple.js";

const enumerateIterType = makeClass({
  name: "enumerate",
  dict: new Map<string | symbol, unknown>([
    [Slot.iter, (self: PyObject) => self],
    [Slot.next, (self: PyObject) => {
      const innerIter = self.dict.get("_iter") as PyObject;
      const idx = self.dict.get("_index") as number;
      const nextFn = lookupSpecial(innerIter, Slot.next);
      if (!nextFn) {
        throw new PyTypeError(
          `'${innerIter.type.name}' object is not an iterator`,
        );
      }
      try {
        const val = nextFn();
        if (!(val instanceof PyObject)) {
          throw new PyTypeError(
            "enumerate() expects iterator items to be PyObject",
          );
        }
        const pair = pyTuple([pyInt(idx), val]);
        self.dict.set("_index", idx + 1);
        return pair;
      } catch (e) {
        if (e instanceof PyStopIteration) throw e;
        throw e;
      }
    }],
  ]),
});

export function makeEnumerateIterator(
  innerIter: PyObject,
  startIndex: number,
): PyObject {
  const it = new PyObject(enumerateIterType);
  it.dict.set("_iter", innerIter);
  it.dict.set("_index", startIndex);
  return it;
}
