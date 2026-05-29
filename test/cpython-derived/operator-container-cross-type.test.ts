/**
 * CPython: dict/list/tuple/slice cross-type binary and ordering rejects.
 */
import { describe, it, expect } from "vitest";
import {
  add,
  eq,
  ge,
  gt,
  iadd,
  imul,
  le,
  lt,
  mul,
  ne,
  pyBytes,
  pyDict,
  pyInt,
  pyList,
  pySet,
  pySlice,
  pyStr,
  pyTuple,
} from "../../src/index.js";
import { PyTypeError } from "../../src/runtime/core/errors.js";

describe("cpython-derived dict/list cross-type", () => {
  const d = () => pyDict([[pyStr("a"), pyInt(1)]]);
  const l = () => pyList([pyInt(1)]);

  it("add rejects dict and list in both orders", () => {
    expect(() => add(d(), l())).toThrow(PyTypeError);
    expect(() => add(d(), l())).toThrow(
      /unsupported operand type\(s\) for \+: 'dict' and 'list'/,
    );
    expect(() => add(l(), d())).toThrow(PyTypeError);
    expect(() => add(l(), d())).toThrow(
      /unsupported operand type\(s\) for \+: 'list' and 'dict'/,
    );
  });

  it("eq is false for dict and list", () => {
    expect(eq(d(), l())).toBe(false);
    expect(ne(d(), l())).toBe(true);
  });

  for (const [name, op] of [
    ["lt", lt],
    ["le", le],
    ["gt", gt],
    ["ge", ge],
  ] as const) {
    it(`${name} raises TypeError for dict and list`, () => {
      expect(() => op(d(), l())).toThrow(PyTypeError);
      expect(() => op(d(), l())).toThrow(
        new RegExp(`'${name}' not supported between instances of 'dict' and 'list'`),
      );
    });
  }
});

describe("cpython-derived dict/tuple cross-type", () => {
  const d = () => pyDict([[pyInt(1), pyInt(2)]]);
  const t = () => pyTuple([pyInt(1)]);

  it("add rejects dict and tuple in both orders", () => {
    expect(() => add(d(), t())).toThrow(PyTypeError);
    expect(() => add(d(), t())).toThrow(
      /unsupported operand type\(s\) for \+: 'dict' and 'tuple'/,
    );
    expect(() => add(t(), d())).toThrow(PyTypeError);
    expect(() => add(t(), d())).toThrow(
      /unsupported operand type\(s\) for \+: 'tuple' and 'dict'/,
    );
  });

  it("eq is false for dict and tuple", () => {
    expect(eq(d(), t())).toBe(false);
  });

  for (const [name, op] of [
    ["lt", lt],
    ["le", le],
    ["gt", gt],
    ["ge", ge],
  ] as const) {
    it(`${name} raises TypeError for dict and tuple`, () => {
      expect(() => op(d(), t())).toThrow(PyTypeError);
      expect(() => op(d(), t())).toThrow(
        new RegExp(`'${name}' not supported between instances of 'dict' and 'tuple'`),
      );
      expect(() => op(t(), d())).toThrow(PyTypeError);
      expect(() => op(t(), d())).toThrow(
        new RegExp(`'${name}' not supported between instances of 'tuple' and 'dict'`),
      );
    });
  }
});

describe("cpython-derived dict/set cross-type", () => {
  const d = () => pyDict([[pyStr("a"), pyInt(1)]]);
  const s = () => pySet([pyInt(1)]);

  it("add rejects dict and set in both orders", () => {
    expect(() => add(d(), s())).toThrow(PyTypeError);
    expect(() => add(d(), s())).toThrow(
      /unsupported operand type\(s\) for \+: 'dict' and 'set'/,
    );
    expect(() => add(s(), d())).toThrow(PyTypeError);
    expect(() => add(s(), d())).toThrow(
      /unsupported operand type\(s\) for \+: 'set' and 'dict'/,
    );
  });

  it("eq is false for dict and set", () => {
    expect(eq(d(), s())).toBe(false);
    expect(ne(d(), s())).toBe(true);
  });

  for (const [name, op] of [
    ["lt", lt],
    ["le", le],
    ["gt", gt],
    ["ge", ge],
  ] as const) {
    it(`${name} raises TypeError for dict and set`, () => {
      expect(() => op(d(), s())).toThrow(PyTypeError);
      expect(() => op(d(), s())).toThrow(
        new RegExp(`'${name}' not supported between instances of 'dict' and 'set'`),
      );
    });
  }
});

describe("cpython-derived dict/scalar container cross-type", () => {
  const d = () => pyDict([[pyInt(1), pyInt(2)]]);

  it("mul rejects dict and int", () => {
    expect(() => mul(d(), pyInt(2))).toThrow(PyTypeError);
    expect(() => mul(d(), pyInt(2))).toThrow(
      /unsupported operand type\(s\) for \*: 'dict' and 'int'/,
    );
  });

  it("add rejects dict and slice", () => {
    expect(() => add(d(), pySlice(0, 1, 1))).toThrow(PyTypeError);
    expect(() => add(d(), pySlice(0, 1, 1))).toThrow(
      /unsupported operand type\(s\) for \+: 'dict' and 'slice'/,
    );
  });

  it("add rejects dict and bytes", () => {
    expect(() => add(d(), pyBytes([1]))).toThrow(PyTypeError);
    expect(() => add(d(), pyBytes([1]))).toThrow(
      /unsupported operand type\(s\) for \+: 'dict' and 'bytes'/,
    );
  });
});

describe("cpython-derived container in-place rejects", () => {
  it("iadd rejects dict and list", () => {
    expect(() => iadd(pyDict([]), pyList([pyInt(1)]))).toThrow(PyTypeError);
    expect(() => iadd(pyDict([]), pyList([pyInt(1)]))).toThrow(
      /unsupported operand type\(s\) for \+=: 'dict' and 'list'/,
    );
  });

  it("imul rejects list and tuple", () => {
    expect(() => imul(pyList([pyInt(1)]), pyTuple([pyInt(2)]))).toThrow(PyTypeError);
    expect(() => imul(pyList([pyInt(1)]), pyTuple([pyInt(2)]))).toThrow(
      /unsupported operand type\(s\) for \*=: 'list' and 'tuple'/,
    );
  });
});

describe("cpython-derived slice cross-type", () => {
  const s = () => pySlice(0, 1, 1);
  const l = () => pyList([pyInt(1)]);
  const i = () => pyInt(1);

  it("add rejects slice and int", () => {
    expect(() => add(s(), i())).toThrow(PyTypeError);
    expect(() => add(s(), i())).toThrow(
      /unsupported operand type\(s\) for \+: 'slice' and 'int'/,
    );
  });

  it("add rejects slice and list in both orders", () => {
    expect(() => add(s(), l())).toThrow(PyTypeError);
    expect(() => add(s(), l())).toThrow(
      /unsupported operand type\(s\) for \+: 'slice' and 'list'/,
    );
    expect(() => add(l(), s())).toThrow(PyTypeError);
    expect(() => add(l(), s())).toThrow(
      /unsupported operand type\(s\) for \+: 'list' and 'slice'/,
    );
  });

  it("eq is false for slice and list", () => {
    expect(eq(s(), l())).toBe(false);
  });

  it("lt raises TypeError for slice and list", () => {
    expect(() => lt(s(), l())).toThrow(PyTypeError);
    expect(() => lt(s(), l())).toThrow(
      /'lt' not supported between instances of 'slice' and 'list'/,
    );
  });

  it("add rejects slice and tuple in both orders", () => {
    const t = () => pyTuple([pyInt(1)]);
    expect(() => add(s(), t())).toThrow(PyTypeError);
    expect(() => add(s(), t())).toThrow(
      /unsupported operand type\(s\) for \+: 'slice' and 'tuple'/,
    );
    expect(() => add(t(), s())).toThrow(PyTypeError);
    expect(() => add(t(), s())).toThrow(
      /unsupported operand type\(s\) for \+: 'tuple' and 'slice'/,
    );
  });
});

describe("cpython-derived tuple/scalar cross-type add", () => {
  it("add rejects tuple and int", () => {
    expect(() => add(pyTuple([pyInt(1)]), pyInt(2))).toThrow(PyTypeError);
    expect(() => add(pyTuple([pyInt(1)]), pyInt(2))).toThrow(
      /unsupported operand type\(s\) for \+: 'tuple' and 'int'/,
    );
    expect(() => add(pyInt(2), pyTuple([pyInt(1)]))).toThrow(PyTypeError);
    expect(() => add(pyInt(2), pyTuple([pyInt(1)]))).toThrow(
      /unsupported operand type\(s\) for \+: 'int' and 'tuple'/,
    );
  });
});
