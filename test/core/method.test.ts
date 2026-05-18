import { describe, it, expect } from "vitest";
import {
  makeClass,
  objectType,
  lookupSpecial,
  PyObject,
} from "../../src/index.js";
import { Slot } from "../../src/runtime/core/slots.js";
import { bindMethod, getMethodType } from "../../src/runtime/class/method.js";

describe("bound method (MethodType shape)", () => {
  it("bindMethod produces callable with __call__", () => {
    const C = makeClass({
      name: "C",
      bases: [objectType],
      dict: new Map([
        [
          Slot.add,
          (self: PyObject, n: number) => {
            const v = (self.dict.get("v") as number) ?? 0;
            const next = v + n;
            self.dict.set("v", next);
            return next;
          },
        ],
      ]),
    });
    const inst = new PyObject(C);
    inst.dict.set("v", 1);
    const raw = C.typeDict.get(Slot.add) as Function;
    const bound = bindMethod(raw, inst);
    expect(bound.type).toBe(getMethodType());
    const callFn = lookupSpecial(bound, Slot.call)!;
    expect(callFn(2)).toBe(3);
  });

  it("lookupSpecial binds plain functions as method objects", () => {
    const C = makeClass({
      name: "C2",
      bases: [objectType],
      dict: new Map([
        [Slot.len, (self: PyObject) => self.dict.size],
      ]),
    });
    const inst = new PyObject(C);
    inst.dict.set("a", 1);
    const fn = lookupSpecial(inst, Slot.len);
    expect(fn).toBeDefined();
    expect(fn!()).toBe(1);
  });
});
