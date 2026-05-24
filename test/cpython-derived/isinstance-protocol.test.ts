/**
 * Vitest ports of CPython Lib/test/test_isinstance.py (TestIsInstanceIsSubclass
 * normal + tuple branches, v3.14.0). Skips abstract metaclass and PEP 604 unions.
 * Source: vendor/cpython/Lib/test/test_isinstance.py
 */
import { describe, it, expect } from "vitest";
import {
  PyObject,
  makeClass,
  isinstance,
  issubclass,
  pyInt,
  intType,
  floatType,
  strType,
} from "../../src/index.js";

function superChildHierarchy() {
  const Super = makeClass({ name: "Super", dict: new Map() });
  const Child = makeClass({ name: "Child", bases: [Super], dict: new Map() });
  const superInst = new PyObject(Super);
  const childInst = new PyObject(Child);
  return { Super, Child, superInst, childInst };
}

describe("cpython-derived test_isinstance normal MRO", () => {
  it("test_isinstance_normal: Super/Child instances", () => {
    const { Super, Child, superInst, childInst } = superChildHierarchy();
    expect(isinstance(superInst, Super)).toBe(true);
    expect(isinstance(superInst, Child)).toBe(false);
    expect(isinstance(childInst, Super)).toBe(true);
    expect(isinstance(childInst, Child)).toBe(true);
  });

  it("test_subclass_normal: Super/Child types", () => {
    const { Super, Child } = superChildHierarchy();
    expect(issubclass(Super, Super)).toBe(true);
    expect(issubclass(Super, Child)).toBe(false);
    expect(issubclass(Child, Child)).toBe(true);
    expect(issubclass(Child, Super)).toBe(true);
  });

  it("builtin isinstance: pyInt is int", () => {
    expect(isinstance(pyInt(3), intType)).toBe(true);
    expect(isinstance(pyInt(3), floatType)).toBe(false);
  });
});

describe("cpython-derived test_isinstance tuple second arg", () => {
  it("test_subclass_tuple: flat and nested type tuples", () => {
    const { Super, Child } = superChildHierarchy();
    expect(issubclass(Child, [Child])).toBe(true);
    expect(issubclass(Child, [Super])).toBe(true);
    expect(issubclass(Super, [Child])).toBe(false);
    expect(issubclass(Super, [Child, Super])).toBe(true);
    expect(issubclass(Child, [])).toBe(false);
    expect(issubclass(Super, [Child, [Super]])).toBe(true);
    expect(issubclass(intType, [intType, [floatType, intType]])).toBe(true);
    expect(issubclass(strType, [strType, [Child, strType]])).toBe(true);
  });

  it("isinstance with tuple of types", () => {
    const { Super, Child, superInst, childInst } = superChildHierarchy();
    expect(isinstance(superInst, [Super, Child])).toBe(true);
    expect(isinstance(superInst, [Child])).toBe(false);
    expect(isinstance(childInst, [Child, [Super]])).toBe(true);
  });
});
