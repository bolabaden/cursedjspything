/**
 * CPython: slice.start / stop / step attributes.
 */
import { describe, it, expect } from "vitest";
import {
  eq,
  getAttr,
  noneType,
  pyInt,
  pyNone,
  pySlice,
  pyTrue,
  unwrap,
} from "../../src/index.js";

describe("cpython-derived slice attributes", () => {
  it("exposes numeric bounds as pyInt", () => {
    const sl = pySlice(1, 2, 3);
    expect(unwrap(getAttr(sl, "start") as ReturnType<typeof pyInt>)).toBe(1);
    expect(unwrap(getAttr(sl, "stop") as ReturnType<typeof pyInt>)).toBe(2);
    expect(unwrap(getAttr(sl, "step") as ReturnType<typeof pyInt>)).toBe(3);
  });

  it("exposes omitted bounds as None", () => {
    const sl = pySlice();
    expect((getAttr(sl, "start") as typeof pyNone).type).toBe(noneType);
    expect((getAttr(sl, "stop") as typeof pyNone).type).toBe(noneType);
    expect((getAttr(sl, "step") as typeof pyNone).type).toBe(noneType);
    expect(eq(getAttr(sl, "start"), pyNone)).toBe(true);
  });

  it("round-trips pyInt and bool bounds", () => {
    const sl = pySlice(pyInt(5), null, pyTrue);
    expect(eq(getAttr(sl, "start"), pyInt(5))).toBe(true);
    expect(eq(getAttr(sl, "stop"), pyNone)).toBe(true);
    expect(eq(getAttr(sl, "step"), pyTrue)).toBe(true);
  });
});
