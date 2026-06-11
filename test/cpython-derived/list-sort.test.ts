/**
 * CPython: list sort.
 */
import { describe, it, expect } from "vitest";
import {
  getAttr,
  getItem,
  instantiate,
  len,
  makeClass,
  noneType,
  objectType,
  pyFalse,
  pyInt,
  pyList,
  pyNone,
  pyStr,
  pyTrue,
  unwrap,
} from "../../src/index.js";
import { PyTypeError } from "../../src/runtime/core/errors.js";
import { Slot } from "../../src/runtime/core/slots.js";

type ListMethod = (...args: unknown[]) => unknown;

function intItems(lst: ReturnType<typeof pyList>): number[] {
  const n = len(lst);
  const out: number[] = [];
  for (let i = 0; i < n; i++) {
    out.push(unwrap(getItem(lst, i) as ReturnType<typeof pyInt>));
  }
  return out;
}

function strItems(lst: ReturnType<typeof pyList>): string[] {
  const n = len(lst);
  const out: string[] = [];
  for (let i = 0; i < n; i++) {
    out.push(unwrap(getItem(lst, i) as ReturnType<typeof pyStr>));
  }
  return out;
}

function negKey() {
  const NegKey = makeClass({
    name: "NegKey",
    bases: [objectType],
    dict: new Map<string | symbol, unknown>([
      [Slot.call, (_self: unknown, x: unknown) =>
        pyInt(-unwrap(x as ReturnType<typeof pyInt>))],
    ]),
  });
  return instantiate(NegKey);
}

function strLenKey() {
  const StrLenKey = makeClass({
    name: "StrLenKey",
    bases: [objectType],
    dict: new Map<string | symbol, unknown>([
      [Slot.call, (_self: unknown, x: unknown) =>
        pyInt(unwrap(x as ReturnType<typeof pyStr>).length)],
    ]),
  });
  return instantiate(StrLenKey);
}

describe("cpython-derived list sort", () => {
  function call(lst: ReturnType<typeof pyList>, name: string, ...args: unknown[]) {
    const fn = getAttr(lst, name) as ListMethod;
    return fn(lst, ...args);
  }

  it("sorts integers in place ascending and returns None", () => {
    const lst = pyList([pyInt(3), pyInt(1), pyInt(2)]);
    const ret = call(lst, "sort");
    expect((ret as typeof pyNone).type).toBe(noneType);
    expect(intItems(lst)).toEqual([1, 2, 3]);
  });

  it("sorts descending when reverse is true", () => {
    const lst = pyList([pyInt(1), pyInt(3), pyInt(2)]);
    call(lst, "sort", pyTrue);
    expect(intItems(lst)).toEqual([3, 2, 1]);
    const lst2 = pyList([pyInt(2), pyInt(1)]);
    call(lst2, "sort", true);
    expect(intItems(lst2)).toEqual([2, 1]);
  });

  it("reverse=False leaves ascending order", () => {
    const lst = pyList([pyInt(2), pyInt(1)]);
    call(lst, "sort", pyFalse);
    expect(intItems(lst)).toEqual([1, 2]);
  });

  it("sorts strings lexicographically", () => {
    const lst = pyList([pyStr("b"), pyStr("a"), pyStr("c")]);
    call(lst, "sort");
    expect(strItems(lst)).toEqual(["a", "b", "c"]);
  });

  it("stable sort preserves relative order of equal elements", () => {
    const oneA = pyInt(1);
    const oneB = pyInt(1);
    const lst = pyList([pyInt(2), oneA, pyInt(0), oneB]);
    call(lst, "sort");
    expect(intItems(lst)).toEqual([0, 1, 1, 2]);
    expect(getItem(lst, 1)).toBe(oneA);
    expect(getItem(lst, 2)).toBe(oneB);
  });

  it("sorts by callable key", () => {
    const lst = pyList([pyInt(1), pyInt(3), pyInt(2)]);
    call(lst, "sort", negKey());
    expect(intItems(lst)).toEqual([3, 2, 1]);
  });

  it("sorts by key with reverse", () => {
    const lst = pyList([pyStr("aaa"), pyStr("b"), pyStr("cc")]);
    call(lst, "sort", strLenKey(), pyTrue);
    expect(strItems(lst)).toEqual(["aaa", "cc", "b"]);
  });

  it("rejects non-callable key argument", () => {
    const lst = pyList([pyInt(1)]);
    expect(() => call(lst, "sort", pyInt(1))).toThrow(PyTypeError);
    expect(() => call(lst, "sort", pyInt(1))).toThrow(/key must be callable/);
  });

  it("raises TypeError when elements are not orderable", () => {
    const lst = pyList([pyInt(1), pyStr("a")]);
    expect(() => call(lst, "sort")).toThrow(PyTypeError);
  });
});
