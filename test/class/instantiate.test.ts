import { describe, it, expect } from "vitest";
import {
  makeClass,
  instantiate,
  objectType,
  PyObject,
  PyType,
} from "../../src/index.js";
import { Slot } from "../../src/runtime/core/slots.js";

describe("instantiate", () => {
  it("does not treat instance __call__ in class dict as type.__call__", () => {
    const Adder = makeClass({
      name: "Adder",
      bases: [objectType],
      dict: new Map<string | symbol, unknown>([
        [Slot.init, (self: PyObject, n: number) => {
          self.dict.set("n", n);
        }],
        [Slot.call, (self: PyObject, x: number) =>
          (self.dict.get("n") as number) + x
        ],
      ]),
    });
    const adder = instantiate(Adder, 10);
    expect(adder.dict.get("n")).toBe(10);
  });

  it("uses __new__ and __init__ when present", () => {
    const Box = makeClass({
      name: "Box",
      bases: [objectType],
      dict: new Map<string | symbol, unknown>([
        [Slot.new, (cls: PyType) => {
          const inst = new PyObject(cls);
          inst.dict.set("n", 0);
          return inst;
        }],
        [Slot.init, (self: PyObject, n: number) => {
          self.dict.set("n", n);
        }],
      ]),
    });
    const b = instantiate(Box, 42);
    expect(b.dict.get("n")).toBe(42);
  });
});
