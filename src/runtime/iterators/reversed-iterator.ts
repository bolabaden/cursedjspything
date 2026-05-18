import { PyObject } from "../core/object.js";
import { Slot } from "../core/slots.js";
import { makeClass } from "../class/class.js";
import { PyStopIteration } from "../core/errors.js";

const revIterType = makeClass({
  name: "reversed_iterator",
  dict: new Map<string | symbol, unknown>([
    [Slot.iter, (self: PyObject) => self],
    [Slot.next, (self: PyObject) => {
      const idx = self.dict.get("_idx") as number;
      if (idx < 0) throw new PyStopIteration();
      const giFn = self.dict.get("_getitem") as (...a: unknown[]) => unknown;
      const val = giFn(idx);
      self.dict.set("_idx", idx - 1);
      return val;
    }],
  ]),
});

export function makeReversedIterator(
  obj: PyObject,
  lenFn: (...a: unknown[]) => unknown,
  giFn: (...a: unknown[]) => unknown,
): PyObject {
  const length = lenFn() as number;
  const it = new PyObject(revIterType);
  it.dict.set("_idx", length - 1);
  it.dict.set("_target", obj);
  it.dict.set("_getitem", giFn);
  return it;
}
