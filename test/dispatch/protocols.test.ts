import { describe, it, expect } from "vitest";
import {
  PyObject, makeClass, objectType, Slot, Hook,
  call, len, lengthHint, getItem, setItem, delItem, contains,
  iter, next, reversed,
  enter, exit, aenter, aexit,
  dir, pyAwait,
  descriptorGet, descriptorSet, descriptorDelete,
  pyInt, pyStr, pyList, pyDict, pySet, pyTuple, pyNone,
  PyTypeError, PyKeyError, PyStopIteration,
  unwrap, PyType,
} from "../../src/index.js";

describe("call protocol", () => {
  it("dispatches __call__", () => {
    const Cls = makeClass({
      name: "Callable",
      dict: new Map<string | symbol, unknown>([
        [Slot.call, (_self: PyObject, x: number) => x * 2],
      ]),
    });
    const obj = new PyObject(Cls);
    expect(call(obj, 21)).toBe(42);
  });

  it("raises TypeError for non-callable", () => {
    const Cls = makeClass({ name: "NotCallable", dict: new Map() });
    expect(() => call(new PyObject(Cls))).toThrow(PyTypeError);
  });
});

describe("container protocols", () => {
  it("len on list", () => {
    expect(len(pyList([pyInt(1), pyInt(2), pyInt(3)]))).toBe(3);
  });

  it("len raises for objects without __len__", () => {
    const Cls = makeClass({ name: "Cls", dict: new Map() });
    expect(() => len(new PyObject(Cls))).toThrow(PyTypeError);
  });

  it("getItem on list", () => {
    const lst = pyList([pyInt(10), pyInt(20), pyInt(30)]);
    expect(unwrap(getItem(lst, 1) as PyObject)).toBe(20);
  });

  it("getItem negative index", () => {
    const lst = pyList([pyInt(10), pyInt(20), pyInt(30)]);
    expect(unwrap(getItem(lst, -1) as PyObject)).toBe(30);
  });

  it("setItem on list", () => {
    const lst = pyList([pyInt(1), pyInt(2)]);
    setItem(lst, 0, pyInt(99));
    expect(unwrap(getItem(lst, 0) as PyObject)).toBe(99);
  });

  it("delItem on list", () => {
    const lst = pyList([pyInt(1), pyInt(2), pyInt(3)]);
    delItem(lst, 1);
    expect(len(lst)).toBe(2);
  });

  it("contains fallback uses eq not identity", () => {
    const Box = makeClass({
      name: "Box",
      bases: [objectType],
      dict: new Map([
        [
          Slot.eq,
          (self: PyObject, other: PyObject) =>
            self.dict.get("v") === other.dict.get("v"),
        ],
        [Slot.iter, () => {
          const items = [new PyObject(Box), new PyObject(Box)];
          items[0].dict.set("v", 1);
          items[1].dict.set("v", 1);
          let i = 0;
          const It = makeClass({
            name: "it",
            dict: new Map([
              [Slot.next, () => {
                if (i >= items.length) throw new PyStopIteration();
                return items[i++];
              }],
            ]),
          });
          return new PyObject(It);
        }],
      ]),
    });
    const needle = new PyObject(Box);
    needle.dict.set("v", 1);
    const seq = new PyObject(Box);
    expect(contains(seq, needle)).toBe(true);
  });

  it("contains on list", () => {
    const one = pyInt(1);
    const two = pyInt(2);
    const lst = pyList([one, two]);
    expect(contains(lst, one)).toBe(true);
  });

  it("contains on str", () => {
    expect(contains(pyStr("hello world"), pyStr("world"))).toBe(true);
    expect(contains(pyStr("hello"), pyStr("xyz"))).toBe(false);
  });

  it("contains on dict (key membership)", () => {
    const k = pyStr("key");
    const d = pyDict([[k, pyInt(1)]]);
    expect(contains(d, k)).toBe(true);
  });

  it("getItem with __missing__ fallback", () => {
    const Cls = makeClass({
      name: "DefaultDict",
      dict: new Map<string | symbol, unknown>([
        [Slot.getitem, (_self: PyObject, key: unknown) => { throw new PyKeyError(String(key)); }],
        [Hook.missing, (_self: PyObject, key: unknown) => `default:${key}`],
      ]),
    });
    const obj = new PyObject(Cls);
    expect(getItem(obj, "x")).toBe("default:x");
  });

  it("lengthHint falls back to default", () => {
    const Cls = makeClass({ name: "NoLen", dict: new Map() });
    expect(lengthHint(new PyObject(Cls), 42)).toBe(42);
  });

  it("lengthHint uses __length_hint__", () => {
    const Cls = makeClass({
      name: "Hinted",
      dict: new Map<string | symbol, unknown>([
        [Hook.lengthHint, () => 100],
      ]),
    });
    expect(lengthHint(new PyObject(Cls))).toBe(100);
  });
});

describe("iteration protocol", () => {
  it("iter + next on list", () => {
    const lst = pyList([pyInt(10), pyInt(20)]);
    const it = iter(lst);
    expect(unwrap(next(it) as PyObject)).toBe(10);
    expect(unwrap(next(it) as PyObject)).toBe(20);
    expect(() => next(it)).toThrow(PyStopIteration);
  });

  it("sequence fallback iteration (via __getitem__)", () => {
    const Cls = makeClass({
      name: "Seq",
      dict: new Map<string | symbol, unknown>([
        [Slot.getitem, (_self: PyObject, idx: number) => {
          if (idx >= 3) throw new Error("IndexError");
          return pyInt(idx * 10);
        }],
      ]),
    });
    const obj = new PyObject(Cls);
    const it = iter(obj);
    expect(unwrap(next(it) as PyObject)).toBe(0);
    expect(unwrap(next(it) as PyObject)).toBe(10);
    expect(unwrap(next(it) as PyObject)).toBe(20);
    expect(() => next(it)).toThrow(PyStopIteration);
  });

  it("reversed on list", () => {
    const lst = pyList([pyInt(1), pyInt(2), pyInt(3)]);
    const it = reversed(lst);
    expect(unwrap(next(it) as PyObject)).toBe(3);
    expect(unwrap(next(it) as PyObject)).toBe(2);
    expect(unwrap(next(it) as PyObject)).toBe(1);
    expect(() => next(it)).toThrow(PyStopIteration);
  });
});

describe("context manager protocol", () => {
  it("enter/exit lifecycle", () => {
    const log: string[] = [];
    const Cls = makeClass({
      name: "CM",
      dict: new Map<string | symbol, unknown>([
        [Hook.enter, (self: PyObject) => { log.push("enter"); return self; }],
        [Hook.exit, (_self: PyObject, _et: unknown, _ev: unknown, _tb: unknown) => {
          log.push("exit");
          return false;
        }],
      ]),
    });
    const cm = new PyObject(Cls);
    const val = enter(cm);
    expect(val).toBe(cm);
    exit(cm, null, null, null);
    expect(log).toEqual(["enter", "exit"]);
  });

  it("raises TypeError without __enter__", () => {
    const Cls = makeClass({ name: "NoCM", dict: new Map() });
    expect(() => enter(new PyObject(Cls))).toThrow(PyTypeError);
  });
});

describe("async protocols", () => {
  it("__await__", () => {
    const awaitableType = makeClass({
      name: "Awaitable",
      dict: new Map<string | symbol, unknown>([
        [Slot.await, (self: PyObject) => {
          // Return an iterator that yields once.
          const iterType = makeClass({
            name: "AwaitIter",
            dict: new Map<string | symbol, unknown>([
              [Slot.iter, (it: PyObject) => it],
              [Slot.next, () => { throw new PyStopIteration("done"); }],
            ]),
          });
          return new PyObject(iterType);
        }],
      ]),
    });
    const obj = new PyObject(awaitableType);
    const it = pyAwait(obj);
    expect(() => next(it)).toThrow(PyStopIteration);
  });

  it("aenter/aexit", async () => {
    const log: string[] = [];
    const Cls = makeClass({
      name: "AsyncCM",
      dict: new Map<string | symbol, unknown>([
        [Hook.aenter, (_self: PyObject) => { log.push("aenter"); return pyNone; }],
        [Hook.aexit, (_self: PyObject, _et: unknown, _ev: unknown, _tb: unknown) => {
          log.push("aexit");
          return false;
        }],
      ]),
    });
    const cm = new PyObject(Cls);
    await aenter(cm);
    await aexit(cm, null, null, null);
    expect(log).toEqual(["aenter", "aexit"]);
  });
});

describe("dir()", () => {
  it("collects from type MRO and instance dict", () => {
    const A = makeClass({
      name: "A",
      dict: new Map<string | symbol, unknown>([["method_a", () => {}]]),
    });
    const B = makeClass({
      name: "B",
      bases: [A],
      dict: new Map<string | symbol, unknown>([["method_b", () => {}]]),
    });
    const obj = new PyObject(B);
    obj.dict.set("inst_attr", 1);
    const d = dir(obj);
    expect(d).toContain("method_a");
    expect(d).toContain("method_b");
    expect(d).toContain("inst_attr");
  });

  it("custom __dir__", () => {
    const Cls = makeClass({
      name: "Cls",
      dict: new Map<string | symbol, unknown>([
        [Hook.dir, () => ["custom_a", "custom_b"]],
      ]),
    });
    expect(dir(new PyObject(Cls))).toEqual(["custom_a", "custom_b"]);
  });
});

describe("descriptor protocol helpers", () => {
  it("descriptorGet/Set/Delete", () => {
    let stored: unknown = null;
    const descType = makeClass({
      name: "Desc",
      dict: new Map<string | symbol, unknown>([
        [Slot.get, (_d: PyObject, _obj: PyObject | null, _o: PyType) => stored],
        [Slot.set, (_d: PyObject, _obj: PyObject, val: unknown) => { stored = val; }],
        [Slot.delete, (_d: PyObject, _obj: PyObject) => { stored = null; }],
      ]),
    });
    const desc = new PyObject(descType);
    const Cls = makeClass({ name: "Cls", dict: new Map() });
    const obj = new PyObject(Cls);

    descriptorSet(desc, obj, 42);
    expect(descriptorGet(desc, obj, Cls)).toBe(42);
    descriptorDelete(desc, obj);
    expect(descriptorGet(desc, obj, Cls)).toBe(null);
  });
});
