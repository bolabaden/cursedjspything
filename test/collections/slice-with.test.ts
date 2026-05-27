import { describe, it, expect } from "vitest";
import {
  makeClass,
  objectType,
  pyList,
  pyTuple,
  pyInt,
  pySlice,
  getItem,
  len,
  withObject,
  PyObject,
} from "../../src/index.js";
import { Hook } from "../../src/runtime/core/slots.js";
import { PyValueError } from "../../src/runtime/core/errors.js";

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
