import { PyObject, NotImplemented } from "../core/object.js";
import { Hook, Slot } from "../core/slots.js";
import { makeClass } from "../class/class.js";
import { PyTypeError } from "../core/errors.js";

function formatNoneSpec(spec: string): string {
  if (spec === "") return "None";
  throw new PyTypeError("unsupported format string passed to NoneType.__format__");
}

export const noneType = makeClass({
  name: "NoneType",
  dict: new Map<string | symbol, unknown>([
    [Slot.repr, (_self: PyObject) => "None"],
    [Slot.bool, (_self: PyObject) => false],
    [Slot.hash, (_self: PyObject) => 0x345678],
    [Slot.eq, (self: PyObject, other: PyObject) =>
      self.id === other.id ? true : NotImplemented],
    [Hook.format, (_self: PyObject, spec: string) => formatNoneSpec(spec)],
  ]),
});

export const pyNone: PyObject = new PyObject(noneType);
