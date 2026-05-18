import { describe, it, expect } from "vitest";
import {
  makeClass,
  instantiate,
  objectType,
  PyObject,
} from "../../src/index.js";
import { Slot } from "../../src/runtime/core/slots.js";

describe("instantiate", () => {
  it("uses type.__call__ when defined on class dict", () => {
    const Box = makeClass({
      name: "Box",
      bases: [objectType],
      dict: {},
    });
    Box.typeDict.set(Slot.call, (...args: unknown[]) => {
      const inst = new PyObject(Box);
      inst.dict.set("n", args[0]);
      return inst;
    });
    const b = instantiate(Box, 42);
    expect(b.dict.get("n")).toBe(42);
  });
});
