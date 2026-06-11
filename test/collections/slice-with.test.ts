import { describe, it, expect } from "vitest";
import {
  bytes,
  bytesType,
  getItem,
  instantiate,
  len,
  makeClass,
  objectType,
  pyBytes,
  pyInt,
  pyList,
  pySlice,
  pyStr,
  pyTrue,
  pyTuple,
  unwrap,
  withObject,
  PyObject,
} from "../../src/index.js";
import { Hook, Slot } from "../../src/runtime/core/slots.js";
import { PyTypeError, PyValueError } from "../../src/runtime/core/errors.js";

function indexOne() {
  const IndexOne = makeClass({
    name: "IndexOne",
    bases: [objectType],
    dict: new Map<string | symbol, unknown>([
      [Slot.index, () => pyInt(1)],
    ]),
  });
  return instantiate(IndexOne);
}

describe("slice", () => {
  it("supports slice subscript via getItem", () => {
    const list = pyList([pyInt(0), pyInt(1), pyInt(2)]);
    const part = getItem(list, pySlice(1, 3, null)) as PyObject;
    expect(len(part)).toBe(2);
  });

  it("rejects zero step with ValueError on list", () => {
    const list = pyList([pyInt(0), pyInt(1)]);
    expect(() => getItem(list, pySlice(null, null, 0))).toThrow(PyValueError);
    expect(() => getItem(list, pySlice(null, null, 0))).toThrow(
      /slice step cannot be zero/,
    );
  });

  it("rejects zero step with ValueError on tuple", () => {
    const tup = pyTuple([pyInt(0), pyInt(1)]);
    expect(() => getItem(tup, pySlice(null, null, 0))).toThrow(PyValueError);
    expect(() => getItem(tup, pySlice(null, null, 0))).toThrow(
      /slice step cannot be zero/,
    );
  });

  it("resolves pyInt and __index__ bounds on list and tuple", () => {
    const list = pyList([pyInt(0), pyInt(1), pyInt(2), pyInt(3)]);
    const part = getItem(list, pySlice(pyInt(1), pyInt(3), null)) as PyObject;
    expect(len(part)).toBe(2);
    expect(unwrap(getItem(part, 0) as ReturnType<typeof pyInt>)).toBe(1);
    expect(unwrap(getItem(part, 1) as ReturnType<typeof pyInt>)).toBe(2);

    const tup = pyTuple([pyInt(10), pyInt(20), pyInt(30)]);
    const tpart = getItem(tup, pySlice(indexOne(), pyInt(3), pyInt(1))) as PyObject;
    expect(len(tpart)).toBe(2);
    expect(unwrap(getItem(tpart, 0) as ReturnType<typeof pyInt>)).toBe(20);
    expect(unwrap(getItem(tpart, 1) as ReturnType<typeof pyInt>)).toBe(30);
  });

  it("resolves pyInt bounds on str and bytes", () => {
    expect(unwrap(getItem(pyStr("abcd"), pySlice(pyInt(1), pyInt(3), null)) as ReturnType<typeof pyStr>)).toBe(
      "bc",
    );
    const b = bytes(pyStr("abcd")) as ReturnType<typeof pyBytes>;
    const part = getItem(b, pySlice(pyTrue, pyInt(3), null));
    expect((part as ReturnType<typeof pyBytes>).type).toBe(bytesType);
    expect(Array.from(unwrap<Uint8Array>(part as ReturnType<typeof pyBytes>))).toEqual([98, 99]);
  });

  it("rejects non-integer slice bounds", () => {
    const list = pyList([pyInt(0)]);
    expect(() => getItem(list, pySlice(pyStr("x"), null, null))).toThrow(PyTypeError);
    expect(() => getItem(list, pySlice(pyStr("x"), null, null))).toThrow(
      /slice indices must be integers or None or have an __index__ method/,
    );
  });
});

describe("with", () => {
  it("withObject calls enter/exit", () => {
    const log: string[] = [];
    const Ctx = makeClass({
      name: "Ctx",
      bases: [objectType],
      dict: new Map([
        [Hook.enter, () => { log.push("in"); return "res"; }],
        [Hook.exit, () => { log.push("out"); return false; }],
      ]),
    });
    const ctx = new PyObject(Ctx);
    const v = withObject(ctx, (r) => {
      expect(r).toBe("res");
      return 7;
    });
    expect(v).toBe(7);
    expect(log).toEqual(["in", "out"]);
  });
});
