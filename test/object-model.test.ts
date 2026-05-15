import { describe, it, expect } from "vitest";
import {
  PyObject, PyType, objectType, typeType, computeC3,
  makeClass, instantiate, Slot, Hook,
  getAttr, setAttr, delAttr, lookupSpecial,
  PyAttributeError, isDataDescriptor,
} from "../src/index.js";

describe("bootstrap types", () => {
  it("object and type exist with correct names", () => {
    expect(objectType.name).toBe("object");
    expect(typeType.name).toBe("type");
  });

  it("type(object) === type", () => {
    expect(objectType.type).toBe(typeType);
  });

  it("type(type) === type", () => {
    expect(typeType.type).toBe(typeType);
  });

  it("object MRO is [object]", () => {
    expect(objectType.mro).toEqual([objectType]);
  });

  it("type MRO is [type, object]", () => {
    expect(typeType.mro).toEqual([typeType, objectType]);
  });
});

describe("C3 linearisation", () => {
  it("single inheritance chain", () => {
    const A = makeClass({ name: "A", dict: new Map() });
    const B = makeClass({ name: "B", bases: [A], dict: new Map() });
    const C = makeClass({ name: "C", bases: [B], dict: new Map() });
    expect(C.mro.map((t) => t.name)).toEqual(["C", "B", "A", "object"]);
  });

  it("diamond inheritance", () => {
    const A = makeClass({ name: "A", dict: new Map() });
    const B = makeClass({ name: "B", bases: [A], dict: new Map() });
    const C = makeClass({ name: "C", bases: [A], dict: new Map() });
    const D = makeClass({ name: "D", bases: [B, C], dict: new Map() });
    expect(D.mro.map((t) => t.name)).toEqual(["D", "B", "C", "A", "object"]);
  });
});

describe("attribute access", () => {
  it("get/set instance attributes", () => {
    const Cls = makeClass({ name: "Cls", dict: new Map() });
    const obj = new PyObject(Cls);
    setAttr(obj, "x", 42);
    expect(getAttr(obj, "x")).toBe(42);
  });

  it("raises AttributeError for missing attributes", () => {
    const Cls = makeClass({ name: "Cls", dict: new Map() });
    const obj = new PyObject(Cls);
    expect(() => getAttr(obj, "nope")).toThrow(PyAttributeError);
  });

  it("delAttr removes instance attributes", () => {
    const Cls = makeClass({ name: "Cls", dict: new Map() });
    const obj = new PyObject(Cls);
    setAttr(obj, "x", 1);
    delAttr(obj, "x");
    expect(() => getAttr(obj, "x")).toThrow(PyAttributeError);
  });

  it("class attributes are visible on instances", () => {
    const Cls = makeClass({
      name: "Cls",
      dict: new Map<string | symbol, unknown>([["class_var", 99]]),
    });
    const obj = new PyObject(Cls);
    expect(getAttr(obj, "class_var")).toBe(99);
  });

  it("instance attributes shadow class attributes", () => {
    const Cls = makeClass({
      name: "Cls",
      dict: new Map<string | symbol, unknown>([["x", 1]]),
    });
    const obj = new PyObject(Cls);
    setAttr(obj, "x", 2);
    expect(getAttr(obj, "x")).toBe(2);
  });
});

describe("descriptor protocol", () => {
  it("data descriptor takes precedence over instance dict", () => {
    const descriptorType = makeClass({
      name: "Descriptor",
      dict: new Map<string | symbol, unknown>([
        [Slot.get, (desc: PyObject, obj: PyObject | null, _owner: PyType) => {
          if (obj === null) return desc;
          return "descriptor-value";
        }],
        [Slot.set, (desc: PyObject, obj: PyObject, value: unknown) => {
          obj.dict.set("_stored", value);
        }],
      ]),
    });
    const desc = new PyObject(descriptorType);

    const Cls = makeClass({
      name: "Cls",
      dict: new Map<string | symbol, unknown>([["attr", desc]]),
    });
    const obj = new PyObject(Cls);
    obj.dict.set("attr", "instance-value");

    // Data descriptor wins over instance dict.
    expect(getAttr(obj, "attr")).toBe("descriptor-value");
  });

  it("non-data descriptor loses to instance dict", () => {
    const descriptorType = makeClass({
      name: "NonDataDesc",
      dict: new Map<string | symbol, unknown>([
        [Slot.get, (_desc: PyObject, _obj: PyObject | null, _owner: PyType) => "desc-value"],
      ]),
    });
    const desc = new PyObject(descriptorType);

    const Cls = makeClass({
      name: "Cls",
      dict: new Map<string | symbol, unknown>([["attr", desc]]),
    });
    const obj = new PyObject(Cls);
    obj.dict.set("attr", "instance-value");

    expect(getAttr(obj, "attr")).toBe("instance-value");
  });
});

describe("special method lookup", () => {
  it("bypasses instance dict", () => {
    const Cls = makeClass({
      name: "Cls",
      dict: new Map<string | symbol, unknown>([
        [Slot.len, (_self: PyObject) => 5],
      ]),
    });
    const obj = new PyObject(Cls);
    // Put a different __len__ on the instance — it must be ignored.
    obj.dict.set(Slot.len, () => 999);

    const lenFn = lookupSpecial(obj, Slot.len);
    expect(lenFn).toBeDefined();
    expect(lenFn!()).toBe(5);
  });
});

describe("__slots__ enforcement", () => {
  it("only allows declared slot names", () => {
    const Cls = makeClass({
      name: "Slotted",
      dict: new Map(),
      slotNames: ["x", "y"],
    });
    const obj = new PyObject(Cls);
    setAttr(obj, "x", 10);
    expect(getAttr(obj, "x")).toBe(10);
    expect(() => setAttr(obj, "z", 1)).toThrow(PyAttributeError);
  });
});

describe("__getattr__ fallback", () => {
  it("is called when normal lookup fails", () => {
    const Cls = makeClass({
      name: "Magic",
      dict: new Map<string | symbol, unknown>([
        [Slot.getattr, (_self: PyObject, name: string) => `fallback:${name}`],
      ]),
    });
    const obj = new PyObject(Cls);
    expect(getAttr(obj, "anything")).toBe("fallback:anything");
  });
});

describe("instantiate (type.__call__)", () => {
  it("calls __new__ then __init__", () => {
    const log: string[] = [];
    const Cls = makeClass({
      name: "Cls",
      dict: new Map<string | symbol, unknown>([
        [Slot.new, (cls: PyType, val: number) => {
          log.push("new");
          const obj = new PyObject(cls);
          obj.dict.set("val", val);
          return obj;
        }],
        [Slot.init, (self: PyObject, val: number) => {
          log.push("init");
          self.dict.set("doubled", (self.dict.get("val") as number) * 2);
        }],
      ]),
    });
    const obj = instantiate(Cls, 21);
    expect(log).toEqual(["new", "init"]);
    expect(obj.dict.get("val")).toBe(21);
    expect(obj.dict.get("doubled")).toBe(42);
  });
});
