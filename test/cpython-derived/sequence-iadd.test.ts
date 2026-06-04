/**
 * CPython: list __iadd__ extends in place with same-type list (plan 636);
 * cross-type += rejects for str/bytes (plan 656), float/bool (plan 658), int (plan 686);
 * list += tuple extend (plan 672).
 */
import { describe, it, expect } from "vitest";
import {
  eq,
  getItem,
  iadd,
  instantiate,
  len,
  makeClass,
  NotImplemented,
  objectType,
  PyObject,
  pyBytes,
  pyFloat,
  pyInt,
  pyList,
  pyStr,
  pyTuple,
  pyTrue,
  unwrap,
} from "../../src/index.js";
import { PyTypeError } from "../../src/runtime/core/errors.js";
import { Slot } from "../../src/runtime/core/slots.js";

function equalKeyPair(): [PyObject, PyObject] {
  const Key = makeClass({
    name: "Key",
    bases: [objectType],
    dict: new Map<string | symbol, unknown>([
      [
        Slot.eq,
        (_self: PyObject, other: PyObject) => {
          if (other.type.name === "Key") return true;
          return NotImplemented;
        },
      ],
    ]),
  });
  return [instantiate(Key), instantiate(Key)];
}

describe("list __iadd__", () => {
  it("iadd extends list with list in place", () => {
    const lst = pyList([pyInt(1)]);
    const extra = pyList([pyInt(2), pyInt(3)]);
    iadd(lst, extra);
    expect(len(lst)).toBe(3);
    expect(unwrap(getItem(lst, 0) as ReturnType<typeof pyInt>)).toBe(1);
    expect(unwrap(getItem(lst, 1) as ReturnType<typeof pyInt>)).toBe(2);
    expect(unwrap(getItem(lst, 2) as ReturnType<typeof pyInt>)).toBe(3);
  });

  it("iadd returns same list instance", () => {
    const lst = pyList([pyInt(1)]);
    expect(iadd(lst, pyList([pyInt(2)]))).toBe(lst);
  });

  it("iadd extends list with tuple like CPython list += tuple", () => {
    const lst = pyList([pyInt(1)]);
    iadd(lst, pyTuple([pyInt(2), pyInt(3)]));
    expect(len(lst)).toBe(3);
    expect(unwrap(getItem(lst, 0) as ReturnType<typeof pyInt>)).toBe(1);
    expect(unwrap(getItem(lst, 1) as ReturnType<typeof pyInt>)).toBe(2);
    expect(unwrap(getItem(lst, 2) as ReturnType<typeof pyInt>)).toBe(3);
  });

  it("iadd with tuple returns same list instance", () => {
    const lst = pyList([pyInt(1)]);
    expect(iadd(lst, pyTuple([pyInt(2)]))).toBe(lst);
  });

  it("in-place extend does not dedupe equal-but-distinct elements", () => {
    const [k1, k2] = equalKeyPair();
    const lst = pyList([k1]);
    iadd(lst, pyList([k2]));
    expect(len(lst)).toBe(2);
    expect(eq(getItem(lst, 0) as PyObject, k1)).toBe(true);
    expect(eq(getItem(lst, 1) as PyObject, k2)).toBe(true);
  });

  it("iadd rejects list and int", () => {
    const lst = pyList([pyInt(1)]);
    expect(() => iadd(lst, pyInt(2))).toThrow(PyTypeError);
    expect(() => iadd(lst, pyInt(2))).toThrow(
      /unsupported operand type\(s\) for \+=: 'list' and 'int'/,
    );
    expect(len(lst)).toBe(1);
  });

  it("iadd rejects int and list", () => {
    const lst = pyList([pyInt(1)]);
    expect(() => iadd(pyInt(2), lst)).toThrow(PyTypeError);
    expect(() => iadd(pyInt(2), lst)).toThrow(
      /unsupported operand type\(s\) for \+=: 'int' and 'list'/,
    );
    expect(len(lst)).toBe(1);
  });

  it("iadd rejects list and str", () => {
    const lst = pyList([pyInt(1)]);
    expect(() => iadd(lst, pyStr("a"))).toThrow(PyTypeError);
    expect(() => iadd(lst, pyStr("a"))).toThrow(
      /unsupported operand type\(s\) for \+=: 'list' and 'str'/,
    );
    expect(len(lst)).toBe(1);
  });

  it("iadd rejects list and bytes", () => {
    const lst = pyList([pyInt(1)]);
    expect(() => iadd(lst, pyBytes(new Uint8Array([97])))).toThrow(PyTypeError);
    expect(() => iadd(lst, pyBytes(new Uint8Array([97])))).toThrow(
      /unsupported operand type\(s\) for \+=: 'list' and 'bytes'/,
    );
    expect(len(lst)).toBe(1);
  });

  it("iadd rejects list and float", () => {
    const lst = pyList([pyInt(1)]);
    expect(() => iadd(lst, pyFloat(2))).toThrow(PyTypeError);
    expect(() => iadd(lst, pyFloat(2))).toThrow(
      /unsupported operand type\(s\) for \+=: 'list' and 'float'/,
    );
    expect(len(lst)).toBe(1);
  });

  it("iadd rejects list and bool", () => {
    const lst = pyList([pyInt(1)]);
    expect(() => iadd(lst, pyTrue)).toThrow(PyTypeError);
    expect(() => iadd(lst, pyTrue)).toThrow(
      /unsupported operand type\(s\) for \+=: 'list' and 'bool'/,
    );
    expect(len(lst)).toBe(1);
  });
});
