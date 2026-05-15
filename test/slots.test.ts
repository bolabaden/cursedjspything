import { describe, it, expect } from "vitest";
import { Slot, Hook, SLOTDEF_COUNT, SLOT_DUNDER_NAMES, ALL_SYMBOLS, dunderName } from "../src/index.js";

describe("slot registry", () => {
  it("has exactly 81 slot-backed dunder names matching CPython slotdefs[]", () => {
    expect(SLOTDEF_COUNT).toBe(81);
    expect(SLOT_DUNDER_NAMES.length).toBe(81);
  });

  it("every Slot entry maps to a dunder name starting and ending with __", () => {
    for (const sym of Object.values(Slot)) {
      const name = dunderName(sym);
      expect(name).toBeDefined();
      expect(name!.startsWith("__")).toBe(true);
      expect(name!.endsWith("__")).toBe(true);
    }
  });

  it("every Hook entry maps to a dunder name", () => {
    for (const sym of Object.values(Hook)) {
      const name = dunderName(sym);
      expect(name).toBeDefined();
      expect(name!.startsWith("__")).toBe(true);
    }
  });

  it("ALL_SYMBOLS contains every slot and hook", () => {
    const allSlots = Object.values(Slot);
    const allHooks = Object.values(Hook);
    for (const sym of [...allSlots, ...allHooks]) {
      const name = dunderName(sym);
      expect(ALL_SYMBOLS.has(name!)).toBe(true);
    }
  });

  it("covers the complete CPython slotdefs[] inventory", () => {
    const expected = [
      "__getattribute__", "__getattr__", "__setattr__", "__delattr__",
      "__repr__", "__hash__", "__call__", "__str__",
      "__lt__", "__le__", "__eq__", "__ne__", "__gt__", "__ge__",
      "__iter__", "__next__", "__get__", "__set__", "__delete__",
      "__init__", "__new__", "__del__",
      "__buffer__", "__release_buffer__",
      "__await__", "__aiter__", "__anext__",
      "__add__", "__radd__", "__sub__", "__rsub__",
      "__mul__", "__rmul__", "__matmul__", "__rmatmul__",
      "__truediv__", "__rtruediv__", "__floordiv__", "__rfloordiv__",
      "__mod__", "__rmod__", "__divmod__", "__rdivmod__",
      "__pow__", "__rpow__",
      "__neg__", "__pos__", "__abs__", "__bool__", "__invert__",
      "__lshift__", "__rlshift__", "__rshift__", "__rrshift__",
      "__and__", "__rand__", "__xor__", "__rxor__", "__or__", "__ror__",
      "__int__", "__float__", "__index__",
      "__iadd__", "__isub__", "__imul__", "__imatmul__",
      "__itruediv__", "__ifloordiv__", "__imod__", "__ipow__",
      "__ilshift__", "__irshift__", "__iand__", "__ixor__", "__ior__",
      "__len__", "__getitem__", "__setitem__", "__delitem__", "__contains__",
    ];
    expect(expected.length).toBe(81);
    for (const name of expected) {
      expect(SLOT_DUNDER_NAMES).toContain(name);
    }
  });
});
