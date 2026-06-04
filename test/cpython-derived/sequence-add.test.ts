/**
 * CPython: list and tuple __add__ concatenate same-type sequences (plan 634);
 * tuple cross-type + rejects for str/bytes (plan 660), float/bool (plan 662);
 * list cross-type + rejects (plan 674); tuple+int (plan 678).
 */
import { describe, it, expect } from "vitest";
import {
  add,
  eq,
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
  pyTrue,
  pyTuple,
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

describe("list and tuple __add__", () => {
  it("list + list returns concatenated list", () => {
    const a = pyList([pyInt(1)]);
    const b = pyList([pyInt(2), pyInt(3)]);
    const result = add(a, b) as PyObject;
    expect(len(result)).toBe(3);
    expect(eq(result, pyList([pyInt(1), pyInt(2), pyInt(3)]))).toBe(true);
    expect(result).not.toBe(a);
    expect(result).not.toBe(b);
  });

  it("tuple + tuple returns concatenated tuple", () => {
    const a = pyTuple([pyInt(1)]);
    const b = pyTuple([pyInt(2)]);
    const result = add(a, b) as PyObject;
    expect(eq(result, pyTuple([pyInt(1), pyInt(2)]))).toBe(true);
    expect(result).not.toBe(a);
  });

  it("concatenation does not dedupe equal-but-distinct elements", () => {
    const [k1, k2] = equalKeyPair();
    const left = pyList([k1]);
    const right = pyList([k2]);
    const merged = add(left, right) as PyObject;
    expect(len(merged)).toBe(2);

    const tLeft = pyTuple([k1]);
    const tRight = pyTuple([k2]);
    const tMerged = add(tLeft, tRight) as PyObject;
    expect(len(tMerged)).toBe(2);
  });

  it("add rejects list and tuple in both orders", () => {
    const l = () => pyList([pyInt(1)]);
    const t = () => pyTuple([pyInt(2)]);
    expect(() => add(l(), t())).toThrow(PyTypeError);
    expect(() => add(l(), t())).toThrow(
      /unsupported operand type\(s\) for \+: 'list' and 'tuple'/,
    );
    expect(() => add(t(), l())).toThrow(PyTypeError);
    expect(() => add(t(), l())).toThrow(
      /unsupported operand type\(s\) for \+: 'tuple' and 'list'/,
    );
  });

  it("add rejects list and int in both orders", () => {
    const l = () => pyList([pyInt(1)]);
    expect(() => add(l(), pyInt(2))).toThrow(PyTypeError);
    expect(() => add(l(), pyInt(2))).toThrow(
      /unsupported operand type\(s\) for \+: 'list' and 'int'/,
    );
    expect(() => add(pyInt(2), l())).toThrow(PyTypeError);
    expect(() => add(pyInt(2), l())).toThrow(
      /unsupported operand type\(s\) for \+: 'int' and 'list'/,
    );
  });

  it("add rejects list and str in both orders", () => {
    const l = () => pyList([pyInt(1)]);
    expect(() => add(l(), pyStr("a"))).toThrow(PyTypeError);
    expect(() => add(l(), pyStr("a"))).toThrow(
      /unsupported operand type\(s\) for \+: 'list' and 'str'/,
    );
    expect(() => add(pyStr("a"), l())).toThrow(PyTypeError);
    expect(() => add(pyStr("a"), l())).toThrow(
      /unsupported operand type\(s\) for \+: 'str' and 'list'/,
    );
  });

  it("add rejects list and bytes in both orders", () => {
    const l = () => pyList([pyInt(1)]);
    const b = () => pyBytes(new Uint8Array([1]));
    expect(() => add(l(), b())).toThrow(PyTypeError);
    expect(() => add(l(), b())).toThrow(
      /unsupported operand type\(s\) for \+: 'list' and 'bytes'/,
    );
    expect(() => add(b(), l())).toThrow(PyTypeError);
    expect(() => add(b(), l())).toThrow(
      /unsupported operand type\(s\) for \+: 'bytes' and 'list'/,
    );
  });

  it("add rejects list and float in both orders", () => {
    const l = () => pyList([pyInt(1)]);
    expect(() => add(l(), pyFloat(2))).toThrow(PyTypeError);
    expect(() => add(l(), pyFloat(2))).toThrow(
      /unsupported operand type\(s\) for \+: 'list' and 'float'/,
    );
    expect(() => add(pyFloat(2), l())).toThrow(PyTypeError);
    expect(() => add(pyFloat(2), l())).toThrow(
      /unsupported operand type\(s\) for \+: 'float' and 'list'/,
    );
  });

  it("add rejects list and bool in both orders", () => {
    const l = () => pyList([pyInt(1)]);
    expect(() => add(l(), pyTrue)).toThrow(PyTypeError);
    expect(() => add(l(), pyTrue)).toThrow(
      /unsupported operand type\(s\) for \+: 'list' and 'bool'/,
    );
    expect(() => add(pyTrue, l())).toThrow(PyTypeError);
    expect(() => add(pyTrue, l())).toThrow(
      /unsupported operand type\(s\) for \+: 'bool' and 'list'/,
    );
  });

  it("add rejects tuple and int in both orders", () => {
    const t = () => pyTuple([pyInt(1)]);
    expect(() => add(t(), pyInt(2))).toThrow(PyTypeError);
    expect(() => add(t(), pyInt(2))).toThrow(
      /unsupported operand type\(s\) for \+: 'tuple' and 'int'/,
    );
    expect(() => add(pyInt(2), t())).toThrow(PyTypeError);
    expect(() => add(pyInt(2), t())).toThrow(
      /unsupported operand type\(s\) for \+: 'int' and 'tuple'/,
    );
  });

  it("add rejects tuple and str in both orders", () => {
    const t = () => pyTuple([pyInt(1)]);
    expect(() => add(t(), pyStr("a"))).toThrow(PyTypeError);
    expect(() => add(t(), pyStr("a"))).toThrow(
      /unsupported operand type\(s\) for \+: 'tuple' and 'str'/,
    );
    expect(() => add(pyStr("a"), t())).toThrow(PyTypeError);
    expect(() => add(pyStr("a"), t())).toThrow(
      /unsupported operand type\(s\) for \+: 'str' and 'tuple'/,
    );
  });

  it("add rejects tuple and bytes in both orders", () => {
    const t = () => pyTuple([pyInt(1)]);
    const b = () => pyBytes(new Uint8Array([1]));
    expect(() => add(t(), b())).toThrow(PyTypeError);
    expect(() => add(t(), b())).toThrow(
      /unsupported operand type\(s\) for \+: 'tuple' and 'bytes'/,
    );
    expect(() => add(b(), t())).toThrow(PyTypeError);
    expect(() => add(b(), t())).toThrow(
      /unsupported operand type\(s\) for \+: 'bytes' and 'tuple'/,
    );
  });

  it("add rejects tuple and float in both orders", () => {
    const t = () => pyTuple([pyInt(1)]);
    expect(() => add(t(), pyFloat(2))).toThrow(PyTypeError);
    expect(() => add(t(), pyFloat(2))).toThrow(
      /unsupported operand type\(s\) for \+: 'tuple' and 'float'/,
    );
    expect(() => add(pyFloat(2), t())).toThrow(PyTypeError);
    expect(() => add(pyFloat(2), t())).toThrow(
      /unsupported operand type\(s\) for \+: 'float' and 'tuple'/,
    );
  });

  it("add rejects tuple and bool in both orders", () => {
    const t = () => pyTuple([pyInt(1)]);
    expect(() => add(t(), pyTrue)).toThrow(PyTypeError);
    expect(() => add(t(), pyTrue)).toThrow(
      /unsupported operand type\(s\) for \+: 'tuple' and 'bool'/,
    );
    expect(() => add(pyTrue, t())).toThrow(PyTypeError);
    expect(() => add(pyTrue, t())).toThrow(
      /unsupported operand type\(s\) for \+: 'bool' and 'tuple'/,
    );
  });
});
