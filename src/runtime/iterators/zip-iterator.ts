import { PyObject } from "../core/object.js";
import { Slot } from "../core/slots.js";
import { makeClass } from "../class/class.js";
import { lookupSpecial } from "../core/lookup.js";
import { PyStopIteration, PyTypeError, PyValueError } from "../core/errors.js";
import { pyTuple } from "../builtins/tuple.js";

function zipIteratorNext(self: PyObject): PyObject {
  const iters = self.dict.get("_iters") as PyObject[];
  const strict = self.dict.get("_strict") as boolean;
  const values: PyObject[] = [];

  for (let i = 0; i < iters.length; i++) {
    const inner = iters[i]!;
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
      if (!(e instanceof PyStopIteration)) throw e;

      if (values.length === 0) {
        if (strict) {
          for (let j = i + 1; j < iters.length; j++) {
            const other = iters[j]!;
            const otherNext = lookupSpecial(other, Slot.next);
            if (!otherNext) {
              throw new PyTypeError(
                `'${other.type.name}' object is not an iterator`,
              );
            }
            try {
              otherNext();
              throw new PyValueError(
                `zip() argument ${j + 1} is longer than argument ${i + 1}`,
              );
            } catch (innerErr) {
              if (innerErr instanceof PyValueError) throw innerErr;
              if (!(innerErr instanceof PyStopIteration)) throw innerErr;
            }
          }
        }
        throw new PyStopIteration();
      }

      if (strict) {
        throw new PyValueError(
          `zip() argument ${i + 1} is shorter than argument ${i}`,
        );
      }
      throw new PyStopIteration();
    }
  }

  return pyTuple(values);
}

const zipIterType = makeClass({
  name: "zip",
  dict: new Map<string | symbol, unknown>([
    [Slot.iter, (self: PyObject) => self],
    [Slot.next, zipIteratorNext],
  ]),
});

export function makeZipIterator(
  iters: PyObject[],
  strict = false,
): PyObject {
  const it = new PyObject(zipIterType);
  it.dict.set("_iters", iters);
  it.dict.set("_strict", strict);
  return it;
}
