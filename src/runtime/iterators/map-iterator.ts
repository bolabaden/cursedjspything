import { PyObject } from "../core/object.js";
import { Slot } from "../core/slots.js";
import { makeClass } from "../class/class.js";
import { lookupSpecial } from "../core/lookup.js";
import { callSlotOrThrow } from "../dispatch/dispatch.js";
import { PyStopIteration, PyTypeError } from "../core/errors.js";

const mapIterType = makeClass({
  name: "map",
  dict: new Map<string | symbol, unknown>([
    [Slot.iter, (self: PyObject) => self],
    [Slot.next, (self: PyObject) => {
      const func = self.dict.get("_func") as PyObject;
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
              "map() expects iterator items to be PyObject",
            );
          }
          values.push(val);
        } catch (e) {
          if (e instanceof PyStopIteration) throw e;
          throw e;
        }
      }
      const result = callSlotOrThrow(
        func,
        Slot.call,
        `'${func.type.name}' object is not callable`,
        ...values,
      );
      if (!(result instanceof PyObject)) {
        throw new PyTypeError("map() function must return PyObject");
      }
      return result;
    }],
  ]),
});

export function makeMapIterator(
  func: PyObject,
  iters: PyObject[],
): PyObject {
  const it = new PyObject(mapIterType);
  it.dict.set("_func", func);
  it.dict.set("_iters", iters);
  return it;
}
