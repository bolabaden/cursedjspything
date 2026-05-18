import { PyObject, NotImplemented } from "../core/object.js";
import { Slot } from "../core/slots.js";
import { makeClass } from "../class/class.js";

export const noneType = makeClass({
  name: "NoneType",
  dict: new Map<string | symbol, unknown>([
    [Slot.repr, (_self: PyObject) => "None"],
    [Slot.bool, (_self: PyObject) => false],
    [Slot.hash, (_self: PyObject) => 0x345678],
    [Slot.eq, (self: PyObject, other: PyObject) =>
      self.id === other.id ? true : NotImplemented],
  ]),
});

export const pyNone: PyObject = new PyObject(noneType);
