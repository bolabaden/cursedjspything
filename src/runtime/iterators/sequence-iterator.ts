import { PyObject } from "../core/object.js";
import { Slot } from "../core/slots.js";
import { makeClass } from "../class/class.js";
import { lookupSpecial } from "../core/lookup.js";
import { PyStopIteration } from "../core/errors.js";

const seqIterType = makeClass({
  name: "sequence_iterator",
  dict: new Map<string | symbol, unknown>([
    [Slot.iter, (self: PyObject) => self],
    [Slot.next, (self: PyObject) => {
      const idx = self.dict.get("_idx") as number;
      const target = self.dict.get("_target") as PyObject;
      const giFn = lookupSpecial(target, Slot.getitem);
      if (!giFn) throw new PyStopIteration();
      try {
        const val = giFn(idx);
        self.dict.set("_idx", idx + 1);
        return val;
      } catch {
        throw new PyStopIteration();
      }
    }],
  ]),
});

export function makeSequenceIterator(obj: PyObject): PyObject {
  const it = new PyObject(seqIterType);
  it.dict.set("_idx", 0);
  it.dict.set("_target", obj);
  return it;
}
