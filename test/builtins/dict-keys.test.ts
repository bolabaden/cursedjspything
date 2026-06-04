import { describe, it, expect } from "vitest";
import {
  contains,
  delItem,
  makeClass,
  hash,
  instantiate,
  pyDict,
  pyInt,
  pyList,
  getItem,
  setItem,
  PyObject,
  objectType,
} from "../../src/index.js";
import { Slot } from "../../src/runtime/core/slots.js";
import { PyTypeError } from "../../src/runtime/core/errors.js";

function badHashKey(): PyObject {
  const BadHash = makeClass({
    name: "BadHash",
    bases: [objectType],
    dict: new Map([[Slot.hash, () => "nope"]]),
  });
  return instantiate(BadHash);
}

const INVALID_HASH_MSG = /__hash__ method should return an integer/;
const UNHASHABLE_LIST_MSG = /unhashable type: 'list'/;

describe("dict key equality", () => {
  it("finds keys by eq/hash for PyObject keys", () => {
    const Key = makeClass({
      name: "Key",
      bases: [objectType],
      dict: new Map([
        [Slot.eq, (a: PyObject, b: PyObject) => a.dict.get("v") === b.dict.get("v")],
        [Slot.hash, (a: PyObject) => (a.dict.get("v") as number) | 0],
      ]),
    });
    const k1 = instantiate(Key);
    k1.dict.set("v", 1);
    const k2 = instantiate(Key);
    k2.dict.set("v", 1);
    const d = pyDict([[k1, pyInt(99)]]);
    expect(getItem(d, k2)).toBeDefined();
    setItem(d, k2, pyInt(100));
    expect(getItem(d, k1)).toBeDefined();
  });
});

describe("dict key hash strictness", () => {
  it("hash() rejects non-integer __hash__ return", () => {
    expect(() => hash(badHashKey())).toThrow(PyTypeError);
    expect(() => hash(badHashKey())).toThrow(INVALID_HASH_MSG);
  });

  it("setItem rejects PyObject keys with invalid __hash__", () => {
    const key = badHashKey();
    expect(() => setItem(pyDict(), key, pyInt(1))).toThrow(PyTypeError);
    expect(() => setItem(pyDict(), key, pyInt(1))).toThrow(INVALID_HASH_MSG);
  });

  it("getItem rejects probe keys with invalid __hash__", () => {
    const Key = makeClass({
      name: "Key",
      bases: [objectType],
      dict: new Map([
        [Slot.eq, (a: PyObject, b: PyObject) => a.id === b.id],
        [Slot.hash, (a: PyObject) => a.id | 0],
      ]),
    });
    const stored = instantiate(Key);
    const d = pyDict([[stored, pyInt(42)]]);
    const probe = badHashKey();
    expect(() => getItem(d, probe)).toThrow(PyTypeError);
    expect(() => getItem(d, probe)).toThrow(INVALID_HASH_MSG);
  });

  it("delItem rejects probe keys with invalid __hash__", () => {
    const Key = makeClass({
      name: "Key",
      bases: [objectType],
      dict: new Map([
        [Slot.eq, (a: PyObject, b: PyObject) => a.id === b.id],
        [Slot.hash, (a: PyObject) => a.id | 0],
      ]),
    });
    const stored = instantiate(Key);
    const d = pyDict([[stored, pyInt(1)]]);
    const probe = badHashKey();
    expect(() => delItem(d, probe)).toThrow(PyTypeError);
    expect(() => delItem(d, probe)).toThrow(INVALID_HASH_MSG);
  });

  it("contains rejects probe keys with invalid __hash__", () => {
    const d = pyDict([[pyInt(0), pyInt(1)]]);
    const probe = badHashKey();
    expect(() => contains(d, probe)).toThrow(PyTypeError);
    expect(() => contains(d, probe)).toThrow(INVALID_HASH_MSG);
  });

  it("pyDict constructor rejects unhashable keys", () => {
    expect(() => pyDict([[pyList([]), pyInt(1)]])).toThrow(UNHASHABLE_LIST_MSG);
    expect(() => pyDict([[badHashKey(), pyInt(1)]])).toThrow(INVALID_HASH_MSG);
  });

  it("rejects unhashable list keys on insert and lookup paths", () => {
    const d = () => pyDict([[pyInt(0), pyInt(1)]]);
    const key = pyList([]);
    expect(() => setItem(pyDict(), key, pyInt(1))).toThrow(UNHASHABLE_LIST_MSG);
    expect(() => getItem(d(), key)).toThrow(UNHASHABLE_LIST_MSG);
    expect(() => delItem(d(), key)).toThrow(UNHASHABLE_LIST_MSG);
    expect(() => contains(d(), key)).toThrow(UNHASHABLE_LIST_MSG);
  });
});
