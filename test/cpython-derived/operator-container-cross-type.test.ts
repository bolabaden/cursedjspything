/**
 * CPython: dict/list/tuple/slice/set/frozenset cross-type binary and ordering (inplace in operator-inplace-cross-type).
 */
import { describe, it, expect } from "vitest";
import {
  add,
  eq,
  ge,
  gt,
  le,
  lt,
  mul,
  ne,
  pyBytes,
  pyDict,
  pyFrozenSet,
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
      expect(() => op(l(), d())).toThrow(PyTypeError);
      expect(() => op(l(), d())).toThrow(
        new RegExp(`'${name}' not supported between instances of 'list' and 'dict'`),
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
    expect(ne(d(), t())).toBe(true);
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

describe("cpython-derived dict/frozenset cross-type", () => {
  const d = () => pyDict([[pyStr("a"), pyInt(1)]]);
  const f = () => pyFrozenSet([pyInt(1)]);

  it("add rejects dict and frozenset in both orders", () => {
    expect(() => add(d(), f())).toThrow(PyTypeError);
    expect(() => add(d(), f())).toThrow(
      /unsupported operand type\(s\) for \+: 'dict' and 'frozenset'/,
    );
    expect(() => add(f(), d())).toThrow(PyTypeError);
    expect(() => add(f(), d())).toThrow(
      /unsupported operand type\(s\) for \+: 'frozenset' and 'dict'/,
    );
  });

  it("eq is false for dict and frozenset", () => {
    expect(eq(d(), f())).toBe(false);
    expect(ne(d(), f())).toBe(true);
  });

  for (const [name, op] of [
    ["lt", lt],
    ["le", le],
    ["gt", gt],
    ["ge", ge],
  ] as const) {
    it(`${name} raises TypeError for dict and frozenset`, () => {
      expect(() => op(d(), f())).toThrow(PyTypeError);
      expect(() => op(d(), f())).toThrow(
        new RegExp(`'${name}' not supported between instances of 'dict' and 'frozenset'`),
      );
      expect(() => op(f(), d())).toThrow(PyTypeError);
      expect(() => op(f(), d())).toThrow(
        new RegExp(`'${name}' not supported between instances of 'frozenset' and 'dict'`),
      );
    });
  }
});

describe("cpython-derived set/slice cross-type", () => {
  const s = () => pySet([pyInt(1)]);
  const sl = () => pySlice(0, 1, 1);

  it("add rejects set and slice in both orders", () => {
    expect(() => add(s(), sl())).toThrow(PyTypeError);
    expect(() => add(s(), sl())).toThrow(
      /unsupported operand type\(s\) for \+: 'set' and 'slice'/,
    );
    expect(() => add(sl(), s())).toThrow(PyTypeError);
    expect(() => add(sl(), s())).toThrow(
      /unsupported operand type\(s\) for \+: 'slice' and 'set'/,
    );
  });

  it("eq is false for set and slice", () => {
    expect(eq(s(), sl())).toBe(false);
    expect(ne(s(), sl())).toBe(true);
  });

  for (const [name, op] of [
    ["lt", lt],
    ["le", le],
    ["gt", gt],
    ["ge", ge],
  ] as const) {
    it(`${name} raises TypeError for set and slice`, () => {
      expect(() => op(s(), sl())).toThrow(PyTypeError);
      expect(() => op(s(), sl())).toThrow(
        new RegExp(`'${name}' not supported between instances of 'set' and 'slice'`),
      );
      expect(() => op(sl(), s())).toThrow(PyTypeError);
      expect(() => op(sl(), s())).toThrow(
        new RegExp(`'${name}' not supported between instances of 'slice' and 'set'`),
      );
    });
  }
});

describe("cpython-derived set/list cross-type", () => {
  const s = () => pySet([pyInt(1)]);
  const l = () => pyList([pyInt(1)]);

  it("add rejects set and list in both orders", () => {
    expect(() => add(s(), l())).toThrow(PyTypeError);
    expect(() => add(s(), l())).toThrow(
      /unsupported operand type\(s\) for \+: 'set' and 'list'/,
    );
    expect(() => add(l(), s())).toThrow(PyTypeError);
    expect(() => add(l(), s())).toThrow(
      /unsupported operand type\(s\) for \+: 'list' and 'set'/,
    );
  });

  it("eq is false for set and list", () => {
    expect(eq(s(), l())).toBe(false);
    expect(ne(s(), l())).toBe(true);
  });

  for (const [name, op] of [
    ["lt", lt],
    ["le", le],
    ["gt", gt],
    ["ge", ge],
  ] as const) {
    it(`${name} raises TypeError for set and list`, () => {
      expect(() => op(s(), l())).toThrow(PyTypeError);
      expect(() => op(s(), l())).toThrow(
        new RegExp(`'${name}' not supported between instances of 'set' and 'list'`),
      );
      expect(() => op(l(), s())).toThrow(PyTypeError);
      expect(() => op(l(), s())).toThrow(
        new RegExp(`'${name}' not supported between instances of 'list' and 'set'`),
      );
    });
  }
});

describe("cpython-derived set/tuple cross-type", () => {
  const s = () => pySet([pyInt(1)]);
  const t = () => pyTuple([pyInt(1)]);

  it("add rejects set and tuple in both orders", () => {
    expect(() => add(s(), t())).toThrow(PyTypeError);
    expect(() => add(s(), t())).toThrow(
      /unsupported operand type\(s\) for \+: 'set' and 'tuple'/,
    );
    expect(() => add(t(), s())).toThrow(PyTypeError);
    expect(() => add(t(), s())).toThrow(
      /unsupported operand type\(s\) for \+: 'tuple' and 'set'/,
    );
  });

  it("eq is false for set and tuple", () => {
    expect(eq(s(), t())).toBe(false);
    expect(ne(s(), t())).toBe(true);
  });

  for (const [name, op] of [
    ["lt", lt],
    ["le", le],
    ["gt", gt],
    ["ge", ge],
  ] as const) {
    it(`${name} raises TypeError for set and tuple`, () => {
      expect(() => op(s(), t())).toThrow(PyTypeError);
      expect(() => op(s(), t())).toThrow(
        new RegExp(`'${name}' not supported between instances of 'set' and 'tuple'`),
      );
      expect(() => op(t(), s())).toThrow(PyTypeError);
      expect(() => op(t(), s())).toThrow(
        new RegExp(`'${name}' not supported between instances of 'tuple' and 'set'`),
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
      expect(() => op(s(), d())).toThrow(PyTypeError);
      expect(() => op(s(), d())).toThrow(
        new RegExp(`'${name}' not supported between instances of 'set' and 'dict'`),
      );
    });
  }
});

describe("cpython-derived dict/scalar container cross-type", () => {
  const d = () => pyDict([[pyInt(1), pyInt(2)]]);

  it("mul rejects dict and int in both orders", () => {
    expect(() => mul(d(), pyInt(2))).toThrow(PyTypeError);
    expect(() => mul(d(), pyInt(2))).toThrow(
      /unsupported operand type\(s\) for \*: 'dict' and 'int'/,
    );
    expect(() => mul(pyInt(2), d())).toThrow(PyTypeError);
    expect(() => mul(pyInt(2), d())).toThrow(
      /unsupported operand type\(s\) for \*: 'int' and 'dict'/,
    );
  });

  it("add rejects dict and slice", () => {
    expect(() => add(d(), pySlice(0, 1, 1))).toThrow(PyTypeError);
    expect(() => add(d(), pySlice(0, 1, 1))).toThrow(
      /unsupported operand type\(s\) for \+: 'dict' and 'slice'/,
    );
    expect(() => add(pySlice(0, 1, 1), d())).toThrow(PyTypeError);
    expect(() => add(pySlice(0, 1, 1), d())).toThrow(
      /unsupported operand type\(s\) for \+: 'slice' and 'dict'/,
    );
  });

  it("add rejects dict and bytes", () => {
    expect(() => add(d(), pyBytes([1]))).toThrow(PyTypeError);
    expect(() => add(d(), pyBytes([1]))).toThrow(
      /unsupported operand type\(s\) for \+: 'dict' and 'bytes'/,
    );
    expect(() => add(pyBytes([1]), d())).toThrow(PyTypeError);
    expect(() => add(pyBytes([1]), d())).toThrow(
      /unsupported operand type\(s\) for \+: 'bytes' and 'dict'/,
    );
  });
});

describe("cpython-derived slice cross-type", () => {
  const s = () => pySlice(0, 1, 1);
  const l = () => pyList([pyInt(1)]);
  const i = () => pyInt(1);

  it("add rejects slice and int in both orders", () => {
    expect(() => add(s(), i())).toThrow(PyTypeError);
    expect(() => add(s(), i())).toThrow(
      /unsupported operand type\(s\) for \+: 'slice' and 'int'/,
    );
    expect(() => add(i(), s())).toThrow(PyTypeError);
    expect(() => add(i(), s())).toThrow(
      /unsupported operand type\(s\) for \+: 'int' and 'slice'/,
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
    expect(ne(s(), l())).toBe(true);
  });

  for (const [name, op] of [
    ["lt", lt],
    ["le", le],
    ["gt", gt],
    ["ge", ge],
  ] as const) {
    it(`${name} raises TypeError for slice and list`, () => {
      expect(() => op(s(), l())).toThrow(PyTypeError);
      expect(() => op(s(), l())).toThrow(
        new RegExp(`'${name}' not supported between instances of 'slice' and 'list'`),
      );
      expect(() => op(l(), s())).toThrow(PyTypeError);
      expect(() => op(l(), s())).toThrow(
        new RegExp(`'${name}' not supported between instances of 'list' and 'slice'`),
      );
    });
  }

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

  it("eq is false for slice and tuple", () => {
    const t = () => pyTuple([pyInt(1)]);
    expect(eq(s(), t())).toBe(false);
    expect(ne(s(), t())).toBe(true);
  });

  for (const [name, op] of [
    ["lt", lt],
    ["le", le],
    ["gt", gt],
    ["ge", ge],
  ] as const) {
    it(`${name} raises TypeError for slice and tuple`, () => {
      const t = () => pyTuple([pyInt(1)]);
      expect(() => op(s(), t())).toThrow(PyTypeError);
      expect(() => op(s(), t())).toThrow(
        new RegExp(`'${name}' not supported between instances of 'slice' and 'tuple'`),
      );
      expect(() => op(t(), s())).toThrow(PyTypeError);
      expect(() => op(t(), s())).toThrow(
        new RegExp(`'${name}' not supported between instances of 'tuple' and 'slice'`),
      );
    });
  }
});
