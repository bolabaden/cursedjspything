import { describe, it, expect } from "vitest";
import {
  PyObject,
  contains,
  instantiate,
  makeClass,
  objectType,
  Slot,
  NotImplemented,
  eq,
  pyList,
  pyInt,
} from "../../src/index.js";

function equalKeyPair(): [PyObject, PyObject] {
  const Key = makeClass({
    name: "Key",
    bases: [objectType],
    dict: new Map<string | symbol, unknown>([
      [Slot.hash, () => 55],
      [
        Slot.eq,
        (_self: PyObject, other: PyObject) => {
          if (other.type.name === "Key") return true;
          return NotImplemented;
        },
      ],
    ]),
  });
  return [instantiate(Key), instantiate(Key)];
}

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

  it("compares equal-but-distinct elements at each index", () => {
    const [k1, k2] = equalKeyPair();
    expect(eq(pyList([k1]), pyList([k2]))).toBe(true);
    expect(
      eq(pyList([k1, pyInt(1)]), pyList([k2, pyInt(1)])),
    ).toBe(true);
    expect(eq(pyList([k1, pyInt(1)]), pyList([k2, pyInt(2)]))).toBe(false);
    expect(eq(pyList([k1]), pyList([]))).toBe(false);
  });

  it("__contains__ matches equal-but-distinct elements", () => {
    const [k1, k2] = equalKeyPair();
    const lst = pyList([k1]);
    expect(contains(lst, k2)).toBe(true);
    expect(contains(lst, pyInt(0))).toBe(false);
  });
});
