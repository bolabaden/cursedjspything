/**
 * CPython: set mutation methods and frozenset copy.
 */
import { describe, it, expect } from "vitest";
import {
  contains,
  instantiate,
  makeClass,
  objectType,
  PyObject,
  eq,
  getAttr,
  pyFrozenSet,
  pyInt,
  pyList,
  pySet,
  pyStr,
} from "../../src/index.js";
import { Slot } from "../../src/runtime/core/slots.js";
import { PyKeyError, PyTypeError } from "../../src/runtime/core/errors.js";

function badHashElement(): PyObject {
  const BadHash = makeClass({
    name: "BadHash",
    bases: [objectType],
    dict: new Map([[Slot.hash, () => "nope"]]),
  });
  return instantiate(BadHash);
}

const UNHASHABLE_LIST_MSG = /unhashable type: 'list'/;
const INVALID_HASH_MSG = /__hash__ method should return an integer/;

type SetMutFn = (self: PyObject, ...args: unknown[]) => unknown;

describe("set mutation methods", () => {
  function call(self: PyObject, name: string, ...args: unknown[]): unknown {
    const fn = getAttr(self, name) as SetMutFn;
    return fn(self, ...args);
  }

  it("add, remove, discard, and clear mutate set", () => {
    const one = pyInt(1);
    const two = pyInt(2);
    const s = pySet([]);
    call(s, "add", one);
    call(s, "add", two);
    expect(eq(s, pySet([one, two]))).toBe(true);

    call(s, "discard", one);
    expect(eq(s, pySet([two]))).toBe(true);

    call(s, "remove", two);
    expect(eq(s, pySet([]))).toBe(true);

    call(s, "add", one);
    call(s, "clear");
    expect(eq(s, pySet([]))).toBe(true);
  });

  it("remove and pop raise KeyError on miss or empty", () => {
    const one = pyInt(1);
    const s = pySet([one]);
    expect(() => call(s, "remove", pyInt(2))).toThrow(PyKeyError);
    expect(() => call(s, "remove", pyInt(2))).toThrow(/^2$/);
    expect(() => call(s, "remove", pyStr("missing"))).toThrow(PyKeyError);
    expect(() => call(s, "remove", pyStr("missing"))).toThrow(/'missing'/);
    expect(() => call(pySet([]), "pop")).toThrow(PyKeyError);
    expect(() => call(pySet([]), "pop")).toThrow(/empty set/);
  });

  it("pop removes and returns an element", () => {
    const one = pyInt(1);
    const s = pySet([one]);
    const item = call(s, "pop");
    expect(item).toBe(one);
    expect(eq(s, pySet([]))).toBe(true);
  });

  it("copy returns equal independent set or frozenset", () => {
    const one = pyInt(1);
    const s = pySet([one]);
    const copied = call(s, "copy") as PyObject;
    expect(copied).not.toBe(s);
    expect(eq(copied, s)).toBe(true);

    const fs = pyFrozenSet([one]);
    const fsCopy = call(fs, "copy") as PyObject;
    expect(fsCopy).not.toBe(fs);
    expect(eq(fsCopy, fs)).toBe(true);
  });

  it("update accepts frozenset and iterable operands", () => {
    const one = pyInt(1);
    const two = pyInt(2);
    const s = pySet([]);
    call(s, "update", pyFrozenSet([one]));
    expect(eq(s, pySet([one]))).toBe(true);

    call(s, "update", pyList([two]));
    expect(eq(s, pySet([one, two]))).toBe(true);
  });

  it("update rejects non-iterable operand", () => {
    expect(() => call(pySet([]), "update", pyInt(1))).toThrow(PyTypeError);
  });

  it("rejects unhashable elements on add, remove, discard, and contains", () => {
    const s = pySet([pyInt(0)]);
    const key = pyList([]);
    expect(() => call(pySet([]), "add", key)).toThrow(UNHASHABLE_LIST_MSG);
    expect(() => call(s, "remove", key)).toThrow(UNHASHABLE_LIST_MSG);
    expect(() => call(s, "discard", key)).toThrow(UNHASHABLE_LIST_MSG);
    expect(() => contains(s, key)).toThrow(UNHASHABLE_LIST_MSG);
  });

  it("rejects invalid __hash__ on add and contains", () => {
    const key = badHashElement();
    expect(() => call(pySet([]), "add", key)).toThrow(INVALID_HASH_MSG);
    expect(() => contains(pySet([]), key)).toThrow(INVALID_HASH_MSG);
  });

  it("update rejects iterable with unhashable element", () => {
    expect(() => call(pySet([]), "update", pyList([pyList([])]))).toThrow(
      UNHASHABLE_LIST_MSG,
    );
  });

  it("rejects unhashable elements at pySet construction", () => {
    expect(() => pySet([pyList([])])).toThrow(UNHASHABLE_LIST_MSG);
    expect(() => pySet([badHashElement()])).toThrow(INVALID_HASH_MSG);
  });
});
