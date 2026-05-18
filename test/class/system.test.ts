import { describe, it, expect } from "vitest";
import {
  PyObject, PyType, makeClass, instantiate,
  pyClass, setPyClass, isinstance, issubclass, classGetitem,
  objectType, typeType, Slot, Hook,
  PyTypeError,
} from "../../src/index.js";

describe("makeClass", () => {
  it("creates a type with correct name and bases", () => {
    const A = makeClass({ name: "A", dict: new Map() });
    expect(A.name).toBe("A");
    expect(A.bases).toEqual([objectType]);
  });

  it("__set_name__ is called on descriptors", () => {
    const log: [string, string | symbol][] = [];
    const descType = makeClass({
      name: "Desc",
      dict: new Map<string | symbol, unknown>([
        [Hook.setName, (self: PyObject, owner: PyType, name: string | symbol) => {
          log.push([owner.name, name]);
        }],
        [Slot.get, () => "val"],
        [Slot.set, () => {}],
      ]),
    });
    const desc = new PyObject(descType);

    makeClass({
      name: "Owner",
      dict: new Map<string | symbol, unknown>([["my_desc", desc]]),
    });

    expect(log).toEqual([["Owner", "my_desc"]]);
  });

  it("__init_subclass__ is called on bases", () => {
    const log: string[] = [];
    const Base = makeClass({
      name: "Base",
      dict: new Map<string | symbol, unknown>([
        [Hook.initSubclass, (_cls: PyType) => { log.push("init_subclass"); }],
      ]),
    });

    makeClass({ name: "Child", bases: [Base], dict: new Map() });
    expect(log).toEqual(["init_subclass"]);
  });
});

describe("metaclass", () => {
  it("custom metaclass is used", () => {
    const Meta = makeClass({
      name: "Meta",
      bases: [typeType],
      dict: new Map(),
      metaclass: typeType,
    });
    const Cls = makeClass({
      name: "Cls",
      dict: new Map(),
      metaclass: Meta,
    });
    expect(Cls.type).toBe(Meta);
  });
});

describe("__class__ access and reassignment", () => {
  it("pyClass returns the type", () => {
    const A = makeClass({ name: "A", dict: new Map() });
    const obj = new PyObject(A);
    expect(pyClass(obj)).toBe(A);
  });

  it("setPyClass changes the type when both have no slots", () => {
    const A = makeClass({ name: "A", dict: new Map() });
    const B = makeClass({ name: "B", dict: new Map() });
    const obj = new PyObject(A);
    setPyClass(obj, B);
    expect(pyClass(obj)).toBe(B);
  });

  it("setPyClass works with compatible slots", () => {
    const A = makeClass({ name: "A", dict: new Map(), slotNames: ["x", "y"] });
    const B = makeClass({ name: "B", dict: new Map(), slotNames: ["x", "y"] });
    const obj = new PyObject(A);
    setPyClass(obj, B);
    expect(pyClass(obj)).toBe(B);
  });

  it("setPyClass rejects incompatible slots", () => {
    const A = makeClass({ name: "A", dict: new Map(), slotNames: ["x"] });
    const B = makeClass({ name: "B", dict: new Map(), slotNames: ["x", "y"] });
    const obj = new PyObject(A);
    expect(() => setPyClass(obj, B)).toThrow(PyTypeError);
  });

  it("setPyClass rejects slots vs no-slots", () => {
    const A = makeClass({ name: "A", dict: new Map() });
    const B = makeClass({ name: "B", dict: new Map(), slotNames: ["x"] });
    const obj = new PyObject(A);
    expect(() => setPyClass(obj, B)).toThrow(PyTypeError);
  });
});

describe("isinstance / issubclass", () => {
  it("isinstance checks MRO", () => {
    const A = makeClass({ name: "A", dict: new Map() });
    const B = makeClass({ name: "B", bases: [A], dict: new Map() });
    const obj = new PyObject(B);
    expect(isinstance(obj, B)).toBe(true);
    expect(isinstance(obj, A)).toBe(true);
    expect(isinstance(obj, objectType)).toBe(true);
  });

  it("issubclass checks MRO", () => {
    const A = makeClass({ name: "A", dict: new Map() });
    const B = makeClass({ name: "B", bases: [A], dict: new Map() });
    expect(issubclass(B, A)).toBe(true);
    expect(issubclass(A, B)).toBe(false);
  });

  it("isinstance supports tuple of types", () => {
    const A = makeClass({ name: "A", dict: new Map() });
    const B = makeClass({ name: "B", dict: new Map() });
    const obj = new PyObject(A);
    expect(isinstance(obj, [A, B])).toBe(true);
    expect(isinstance(obj, [B])).toBe(false);
  });

  it("custom __instancecheck__ on metaclass", () => {
    const Meta = makeClass({
      name: "Meta",
      bases: [typeType],
      dict: new Map<string | symbol, unknown>([
        [Hook.instancecheck, (_cls: PyType, _obj: PyObject) => true],
      ]),
      metaclass: typeType,
    });
    const Cls = makeClass({ name: "Cls", dict: new Map(), metaclass: Meta });
    const Unrelated = makeClass({ name: "Unrelated", dict: new Map() });
    const obj = new PyObject(Unrelated);
    expect(isinstance(obj, Cls)).toBe(true);
  });
});

describe("classGetitem (generic aliases)", () => {
  it("dispatches __class_getitem__", () => {
    const Cls = makeClass({
      name: "Cls",
      dict: new Map<string | symbol, unknown>([
        [Hook.classGetitem, (_cls: PyType, params: unknown) => `generic[${params}]`],
      ]),
    });
    expect(classGetitem(Cls, "int")).toBe("generic[int]");
  });

  it("raises TypeError when not subscriptable", () => {
    const Cls = makeClass({ name: "Cls", dict: new Map() });
    expect(() => classGetitem(Cls, "int")).toThrow(PyTypeError);
  });
});
