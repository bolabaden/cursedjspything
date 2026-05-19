import { describe, it, expect } from "vitest";
import {
  PyObject,
  makeClass,
  Slot,
  NotImplemented,
  eq,
  pyList,
  pyInt,
} from "../../src/index.js";

describe("list __eq__", () => {
  it("returns NotImplemented for non-list rhs", () => {
    const left = pyList([pyInt(1)]);
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
    expect(eq(pyList([w1]), pyList([w2]))).toBe(false);
    const w = new PyObject(Weird);
    expect(eq(pyList([w]), pyList([w]))).toBe(true);
  });

  it("compares equal lists with matching elements", () => {
    expect(eq(pyList([pyInt(1), pyInt(2)]), pyList([pyInt(1), pyInt(2)]))).toBe(
      true,
    );
  });
});
