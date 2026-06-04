import { describe, it, expect, vi } from "vitest";
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

  it("lookupSpecial invokes callable PyObject on type via __call__", () => {
    const Callable = makeClass({
      name: "Callable",
      bases: [objectType],
      dict: new Map([
        [Slot.call, (_self: PyObject, inst: PyObject) => inst.dict.get("n")],
      ]),
    });
    const C = makeClass({
      name: "C3",
      bases: [objectType],
      dict: new Map([[Slot.len, new PyObject(Callable)]]),
    });
    const inst = new PyObject(C);
    inst.dict.set("n", 99);
    const fn = lookupSpecial(inst, Slot.len);
    expect(fn).toBeDefined();
    expect(fn!()).toBe(99);
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

  it("getMethodType before init raises RuntimeError", async () => {
    vi.resetModules();
    const { getMethodType } = await import("../../src/runtime/class/method.js");
    const { PyRuntimeError } = await import("../../src/runtime/core/errors.js");
    expect(() => getMethodType()).toThrow(PyRuntimeError);
    expect(() => getMethodType()).toThrow(/methodType not initialized/);
    await import("../../src/runtime/class/class.js");
  });
});
