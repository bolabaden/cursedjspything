import { describe, it, expect } from "vitest";
import {
  makeClass,
  instantiate,
  pyDict,
  pyInt,
  getItem,
  setItem,
  PyObject,
  objectType,
} from "../../src/index.js";
import { Slot } from "../../src/runtime/core/slots.js";

describe("dict key equality", () => {
  it("finds keys by eq/hash for PyObject keys", () => {
    const Key = makeClass({
      name: "Key",
      bases: [objectType],
      dict: new Map([
        [Slot.eq, (a: PyObject, b: PyObject) => a.dict.get("v") === b.dict.get("v")],
        [Slot.hash, (a: PyObject) => (a.dict.get("v") as number) | 0],
      ]),
    });
    const k1 = instantiate(Key);
    k1.dict.set("v", 1);
    const k2 = instantiate(Key);
    k2.dict.set("v", 1);
    const d = pyDict([[k1, pyInt(99)]]);
    expect(getItem(d, k2)).toBeDefined();
    setItem(d, k2, pyInt(100));
    expect(getItem(d, k1)).toBeDefined();
  });
});
