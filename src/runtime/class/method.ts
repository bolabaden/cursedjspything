/**
 * Bound-method objects (`types.MethodType` shape) for special-method binding.
 */

import { PyObject, PyType, objectType, NotImplemented } from "../core/object.js";
import { Slot } from "../core/slots.js";
import type { makeClass as MakeClassFn } from "./class.js";

let methodType: PyType | undefined;

export function initMethodType(makeClassFn: typeof MakeClassFn): void {
  if (methodType !== undefined) return;
  methodType = makeClassFn({
    name: "method",
    bases: [objectType],
    dict: new Map<string | symbol, unknown>([
      [Slot.repr, (self: PyObject) => {
        const fn = self.dict.get("_methodFunc") as Function;
        const inst = self.dict.get("_methodSelf") as PyObject;
        const name = fn.name || "<lambda>";
        const r = inst.type.typeDict.get(Slot.repr);
        const instRepr =
          typeof r === "function" ? (r as Function)(inst) : `<${inst.type.name}>`;
        return `<bound method ${name} of ${instRepr}>`;
      }],
      [Slot.call, (self: PyObject, ...args: unknown[]) => {
        const fn = self.dict.get("_methodFunc") as Function;
        const inst = self.dict.get("_methodSelf") as PyObject;
        return fn(inst, ...args);
      }],
      [Slot.get, (self: PyObject, _instance: unknown, owner: unknown) => {
        if (owner === self.dict.get("_methodSelf")) return self;
        return NotImplemented;
      }],
      [Slot.eq, (self: PyObject, other: PyObject) => {
        if (other.type !== methodType) return NotImplemented;
        return (
          self.dict.get("_methodFunc") === other.dict.get("_methodFunc") &&
          self.dict.get("_methodSelf") === other.dict.get("_methodSelf")
        );
      }],
    ]),
  });
}

export function getMethodType(): PyType {
  if (!methodType) {
    throw new Error("methodType not initialized; import class module first");
  }
  return methodType;
}

export function bindMethod(func: Function, self: PyObject): PyObject {
  const m = new PyObject(getMethodType());
  m.dict.set("_methodFunc", func);
  m.dict.set("_methodSelf", self);
  return m;
}

export function bindIfFunction(value: unknown, self: PyObject): unknown {
  if (typeof value === "function") return bindMethod(value, self);
  return value;
}
