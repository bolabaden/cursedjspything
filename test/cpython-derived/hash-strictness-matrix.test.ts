/**
 * Cross-cutting hash strictness: dict / set / frozenset / tuple / hash() builtin.
 * Plans 574–588.
 */
import { describe, it, expect } from "vitest";
import {
  contains,
  delItem,
  getAttr,
  getItem,
  hash,
  instantiate,
  makeClass,
  objectType,
  pyDict,
  pyFrozenSet,
  pyInt,
  pyList,
  pySet,
  pyTuple,
  PyObject,
  setItem,
} from "../../src/index.js";
import { Slot } from "../../src/runtime/core/slots.js";
import { PyTypeError } from "../../src/runtime/core/errors.js";

const UNHASHABLE_LIST = /unhashable type: 'list'/;
const INVALID_HASH = /__hash__ method should return an integer/;

function badHashElement(): PyObject {
  const BadHash = makeClass({
    name: "BadHash",
    bases: [objectType],
    dict: new Map([[Slot.hash, () => "nope"]]),
  });
  return instantiate(BadHash);
}

type HashCase = {
  label: string;
  run: () => void;
  msg: RegExp;
};

function casesForKey(key: () => PyObject, msg: RegExp): HashCase[] {
  const k = key;
  return [
    {
      label: "hash()",
      run: () => hash(k()),
      msg,
    },
    {
      label: "dict setItem",
      run: () => setItem(pyDict(), k(), pyInt(0)),
      msg,
    },
    {
      label: "dict getItem",
      run: () => getItem(pyDict([[pyInt(1), pyInt(2)]]), k()),
      msg,
    },
    {
      label: "dict delItem",
      run: () => delItem(pyDict([[pyInt(1), pyInt(2)]]), k()),
      msg,
    },
    {
      label: "dict contains",
      run: () => contains(pyDict([[pyInt(1), pyInt(2)]]), k()),
      msg,
    },
    {
      label: "dict pyDict ctor",
      run: () => pyDict([[k(), pyInt(0)]]),
      msg,
    },
    {
      label: "set add",
      run: () => {
        const add = getAttr(pySet([]), "add") as (s: PyObject, x: unknown) => void;
        add(pySet([]), k());
      },
      msg,
    },
    {
      label: "set contains",
      run: () => contains(pySet([pyInt(1)]), k()),
      msg,
    },
    {
      label: "pySet ctor",
      run: () => pySet([k()]),
      msg,
    },
    {
      label: "pyFrozenSet ctor",
      run: () => pyFrozenSet([k()]),
      msg,
    },
    {
      label: "frozenset contains",
      run: () => contains(pyFrozenSet([pyInt(1)]), k()),
      msg,
    },
    {
      label: "tuple hash",
      run: () => hash(pyTuple([k()])),
      msg,
    },
  ];
}

describe("cpython-derived hash strictness matrix", () => {
  describe.each(casesForKey(() => pyList([]), UNHASHABLE_LIST))(
    "unhashable list — $label",
    ({ run, msg }) => {
      it("raises TypeError", () => {
        expect(run).toThrow(PyTypeError);
        expect(run).toThrow(msg);
      });
    },
  );

  describe.each(casesForKey(badHashElement, INVALID_HASH))(
    "invalid __hash__ — $label",
    ({ run, msg }) => {
      it("raises TypeError", () => {
        expect(run).toThrow(PyTypeError);
        expect(run).toThrow(msg);
      });
    },
  );
});
