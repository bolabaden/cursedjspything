import { describe, it, expect } from "vitest";
import {
  PyObject,
  makeClass,
  Slot,
  NotImplemented,
  eq,
  pyTuple,
  pyInt,
} from "../../src/index.js";

describe("tuple __eq__", () => {
  it("cross-type rhs falls through to identity (false)", () => {
    const left = pyTuple([pyInt(1)]);
    expect(eq(left, pyInt(1))).toBe(false);
  });

  it("uses rich eq() per element (NotImplemented elements compare unequal)", () => {
    const Weird = makeClass({
      name: "Weird",
      dict: new Map<string | symbol, unknown>([
        [Slot.eq, () => NotImplemented],
      ]),
    });
    const w1 = new PyObject(Weird);
    const w2 = new PyObject(Weird);
    expect(eq(pyTuple([w1]), pyTuple([w2]))).toBe(false);
    const w = new PyObject(Weird);
    expect(eq(pyTuple([w]), pyTuple([w]))).toBe(true);
  });

  it("compares equal tuples with matching elements", () => {
    expect(
      eq(pyTuple([pyInt(1), pyInt(2)]), pyTuple([pyInt(1), pyInt(2)])),
    ).toBe(true);
  });
});
