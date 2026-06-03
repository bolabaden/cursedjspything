/**
 * CPython: list↔tuple cross-type equality, ordering, and binary/in-place rejects.
 */
import { describe, it, expect } from "vitest";
import {
  add,
  eq,
  ge,
  getItem,
  gt,
  iadd,
  imul,
  le,
  len,
  lt,
  mul,
  ne,
  pyBytes,
  pyFloat,
  pyInt,
  pyList,
  pyStr,
  pyTuple,
  sub,
  unwrap,
} from "../../src/index.js";
import { PyTypeError } from "../../src/runtime/core/errors.js";

describe("cpython-derived list/tuple equality", () => {
  const l = () => pyList([pyInt(1)]);
  const t = () => pyTuple([pyInt(1)]);

  it("eq rejects cross-type even with equal elements", () => {
    expect(eq(l(), t())).toBe(false);
    expect(ne(l(), t())).toBe(true);
  });
});

describe("cpython-derived list/bytes comparisons", () => {
  const l = () => pyList([pyInt(1)]);
  const b = () => pyBytes([1, 2]);

  it("eq and ne do not coerce list and bytes", () => {
    expect(eq(l(), b())).toBe(false);
    expect(eq(b(), l())).toBe(false);
    expect(ne(l(), b())).toBe(true);
    expect(ne(b(), l())).toBe(true);
  });
});

describe("cpython-derived list/tuple ordering", () => {
  const l = () => pyList([pyInt(1)]);
  const t = () => pyTuple([pyInt(1)]);

  for (const [name, op] of [
    ["lt", lt],
    ["le", le],
    ["gt", gt],
    ["ge", ge],
  ] as const) {
    it(`${name} raises TypeError for list and tuple`, () => {
      expect(() => op(l(), t())).toThrow(PyTypeError);
      expect(() => op(l(), t())).toThrow(
        new RegExp(`'${name}' not supported between instances of 'list' and 'tuple'`),
      );
      expect(() => op(t(), l())).toThrow(PyTypeError);
      expect(() => op(t(), l())).toThrow(
        new RegExp(`'${name}' not supported between instances of 'tuple' and 'list'`),
      );
    });
  }
});

describe("cpython-derived list/tuple binary ops", () => {
  const l = () => pyList([pyInt(1)]);
  const t = () => pyTuple([pyInt(2)]);

  it("add rejects list and tuple in both orders", () => {
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
    expect(() => add(l(), pyStr("a"))).toThrow(PyTypeError);
    expect(() => add(l(), pyStr("a"))).toThrow(
      /unsupported operand type\(s\) for \+: 'list' and 'str'/,
    );
    expect(() => add(pyStr("a"), l())).toThrow(PyTypeError);
    expect(() => add(pyStr("a"), l())).toThrow(
      /unsupported operand type\(s\) for \+: 'str' and 'list'/,
    );
  });

  it("add rejects tuple and int in both orders", () => {
    expect(() => add(t(), pyInt(2))).toThrow(PyTypeError);
    expect(() => add(t(), pyInt(2))).toThrow(
      /unsupported operand type\(s\) for \+: 'tuple' and 'int'/,
    );
    expect(() => add(pyInt(2), t())).toThrow(PyTypeError);
    expect(() => add(pyInt(2), t())).toThrow(
      /unsupported operand type\(s\) for \+: 'int' and 'tuple'/,
    );
  });

  it("mul rejects list and tuple in both orders", () => {
    expect(() => mul(l(), t())).toThrow(PyTypeError);
    expect(() => mul(l(), t())).toThrow(
      /unsupported operand type\(s\) for \*: 'list' and 'tuple'/,
    );
    expect(() => mul(t(), l())).toThrow(PyTypeError);
    expect(() => mul(t(), l())).toThrow(
      /unsupported operand type\(s\) for \*: 'tuple' and 'list'/,
    );
  });

  it("mul rejects list and list", () => {
    expect(() => mul(l(), l())).toThrow(PyTypeError);
    expect(() => mul(l(), l())).toThrow(
      /unsupported operand type\(s\) for \*: 'list' and 'list'/,
    );
  });

  it("mul rejects list and str in both orders", () => {
    expect(() => mul(l(), pyStr("a"))).toThrow(PyTypeError);
    expect(() => mul(l(), pyStr("a"))).toThrow(
      /unsupported operand type\(s\) for \*: 'list' and 'str'/,
    );
    expect(() => mul(pyStr("a"), l())).toThrow(PyTypeError);
    expect(() => mul(pyStr("a"), l())).toThrow(
      /unsupported operand type\(s\) for \*: 'str' and 'list'/,
    );
  });

  it("mul rejects list and bytes in both orders", () => {
    const b = () => pyBytes([1, 2]);
    expect(() => mul(l(), b())).toThrow(PyTypeError);
    expect(() => mul(l(), b())).toThrow(
      /unsupported operand type\(s\) for \*: 'list' and 'bytes'/,
    );
    expect(() => mul(b(), l())).toThrow(PyTypeError);
    expect(() => mul(b(), l())).toThrow(
      /unsupported operand type\(s\) for \*: 'bytes' and 'list'/,
    );
  });

  it("mul rejects tuple and bytes in both orders", () => {
    const b = () => pyBytes([1, 2]);
    expect(() => mul(t(), b())).toThrow(PyTypeError);
    expect(() => mul(t(), b())).toThrow(
      /unsupported operand type\(s\) for \*: 'tuple' and 'bytes'/,
    );
    expect(() => mul(b(), t())).toThrow(PyTypeError);
    expect(() => mul(b(), t())).toThrow(
      /unsupported operand type\(s\) for \*: 'bytes' and 'tuple'/,
    );
  });

  it("mul rejects float repeat count for list and tuple", () => {
    expect(() => mul(l(), pyFloat(2))).toThrow(PyTypeError);
    expect(() => mul(l(), pyFloat(2))).toThrow(
      /unsupported operand type\(s\) for \*: 'list' and 'float'/,
    );
    expect(() => mul(t(), pyFloat(2))).toThrow(PyTypeError);
    expect(() => mul(t(), pyFloat(2))).toThrow(
      /unsupported operand type\(s\) for \*: 'tuple' and 'float'/,
    );
  });

  it("sub rejects list and list", () => {
    expect(() => sub(l(), l())).toThrow(PyTypeError);
    expect(() => sub(l(), l())).toThrow(
      /unsupported operand type\(s\) for -: 'list' and 'list'/,
    );
  });
});

describe("cpython-derived list/tuple in-place ops", () => {
  it("iadd extends list with tuple like CPython list += tuple", () => {
    const lst = pyList([pyInt(1)]);
    iadd(lst, pyTuple([pyInt(2), pyInt(3)]));
    expect(len(lst)).toBe(3);
    expect(unwrap(getItem(lst, 0) as ReturnType<typeof pyInt>)).toBe(1);
    expect(unwrap(getItem(lst, 1) as ReturnType<typeof pyInt>)).toBe(2);
    expect(unwrap(getItem(lst, 2) as ReturnType<typeof pyInt>)).toBe(3);
  });

  it("iadd returns same list instance", () => {
    const lst = pyList([pyInt(1)]);
    expect(iadd(lst, pyTuple([pyInt(2)]))).toBe(lst);
  });

  it("imul rejects list and float", () => {
    expect(() => imul(pyList([pyInt(1)]), pyFloat(2))).toThrow(PyTypeError);
    expect(() => imul(pyList([pyInt(1)]), pyFloat(2))).toThrow(
      /unsupported operand type\(s\) for \*=: 'list' and 'float'/,
    );
  });

  it("imul rejects list and list", () => {
    expect(() => imul(pyList([pyInt(1)]), pyList([pyInt(2)]))).toThrow(PyTypeError);
    expect(() => imul(pyList([pyInt(1)]), pyList([pyInt(2)]))).toThrow(
      /unsupported operand type\(s\) for \*=: 'list' and 'list'/,
    );
  });

  it("imul rejects list and tuple", () => {
    expect(() => imul(pyList([pyInt(1)]), pyTuple([pyInt(2)]))).toThrow(PyTypeError);
    expect(() => imul(pyList([pyInt(1)]), pyTuple([pyInt(2)]))).toThrow(
      /unsupported operand type\(s\) for \*=: 'list' and 'tuple'/,
    );
  });
});
