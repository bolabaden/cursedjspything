/**
 * CPython: dict/list/tuple/slice/set/frozenset cross-type binary and ordering (inplace in operator-inplace-cross-type).
 */
import { describe, it, expect } from "vitest";
import {
  add,
  eq,
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
import { registerCrossTypeOrderingRejects } from "./helpers/cross-type-ordering.js";

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

  it("mul rejects dict and list in both orders", () => {
    expect(() => mul(d(), l())).toThrow(PyTypeError);
    expect(() => mul(d(), l())).toThrow(
      /unsupported operand type\(s\) for \*: 'dict' and 'list'/,
    );
    expect(() => mul(l(), d())).toThrow(PyTypeError);
    expect(() => mul(l(), d())).toThrow(
      /unsupported operand type\(s\) for \*: 'list' and 'dict'/,
    );
  });

  registerCrossTypeOrderingRejects("dict", "list", d, l);
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

  registerCrossTypeOrderingRejects("dict", "tuple", d, t);
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

  registerCrossTypeOrderingRejects("dict", "frozenset", d, f);
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

  registerCrossTypeOrderingRejects("set", "slice", s, sl);
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

  registerCrossTypeOrderingRejects("set", "list", s, l);
});

describe("cpython-derived set/bytes cross-type", () => {
  const s = () => pySet([pyInt(1)]);
  const b = () => pyBytes([1, 2]);

  it("add rejects set and bytes in both orders", () => {
    expect(() => add(s(), b())).toThrow(PyTypeError);
    expect(() => add(s(), b())).toThrow(
      /unsupported operand type\(s\) for \+: 'set' and 'bytes'/,
    );
    expect(() => add(b(), s())).toThrow(PyTypeError);
    expect(() => add(b(), s())).toThrow(
      /unsupported operand type\(s\) for \+: 'bytes' and 'set'/,
    );
  });

  it("eq is false for set and bytes", () => {
    expect(eq(s(), b())).toBe(false);
    expect(eq(b(), s())).toBe(false);
    expect(ne(s(), b())).toBe(true);
    expect(ne(b(), s())).toBe(true);
  });

  it("mul rejects set and bytes in both orders", () => {
    expect(() => mul(s(), b())).toThrow(PyTypeError);
    expect(() => mul(s(), b())).toThrow(
      /unsupported operand type\(s\) for \*: 'set' and 'bytes'/,
    );
    expect(() => mul(b(), s())).toThrow(PyTypeError);
    expect(() => mul(b(), s())).toThrow(
      /unsupported operand type\(s\) for \*: 'bytes' and 'set'/,
    );
  });

  registerCrossTypeOrderingRejects("set", "bytes", s, b);
});

describe("cpython-derived frozenset/bytes cross-type", () => {
  const f = () => pyFrozenSet([pyInt(1)]);
  const b = () => pyBytes([1, 2]);

  it("add rejects frozenset and bytes in both orders", () => {
    expect(() => add(f(), b())).toThrow(PyTypeError);
    expect(() => add(f(), b())).toThrow(
      /unsupported operand type\(s\) for \+: 'frozenset' and 'bytes'/,
    );
    expect(() => add(b(), f())).toThrow(PyTypeError);
    expect(() => add(b(), f())).toThrow(
      /unsupported operand type\(s\) for \+: 'bytes' and 'frozenset'/,
    );
  });

  it("eq is false for frozenset and bytes", () => {
    expect(eq(f(), b())).toBe(false);
    expect(eq(b(), f())).toBe(false);
    expect(ne(f(), b())).toBe(true);
    expect(ne(b(), f())).toBe(true);
  });

  it("mul rejects frozenset and bytes in both orders", () => {
    expect(() => mul(f(), b())).toThrow(PyTypeError);
    expect(() => mul(f(), b())).toThrow(
      /unsupported operand type\(s\) for \*: 'frozenset' and 'bytes'/,
    );
    expect(() => mul(b(), f())).toThrow(PyTypeError);
    expect(() => mul(b(), f())).toThrow(
      /unsupported operand type\(s\) for \*: 'bytes' and 'frozenset'/,
    );
  });

  registerCrossTypeOrderingRejects("frozenset", "bytes", f, b);
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

  registerCrossTypeOrderingRejects("set", "tuple", s, t);
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

  registerCrossTypeOrderingRejects("dict", "set", d, s);
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

  const sl = () => pySlice(0, 1, 1);

  it("add rejects dict and slice in both orders", () => {
    expect(() => add(d(), sl())).toThrow(PyTypeError);
    expect(() => add(d(), sl())).toThrow(
      /unsupported operand type\(s\) for \+: 'dict' and 'slice'/,
    );
    expect(() => add(sl(), d())).toThrow(PyTypeError);
    expect(() => add(sl(), d())).toThrow(
      /unsupported operand type\(s\) for \+: 'slice' and 'dict'/,
    );
  });

  registerCrossTypeOrderingRejects("dict", "slice", d, sl);

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
  const t = () => pyTuple([pyInt(1)]);
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

  it("eq is false for slice and int", () => {
    expect(eq(s(), i())).toBe(false);
    expect(ne(s(), i())).toBe(true);
  });

  registerCrossTypeOrderingRejects("slice", "int", s, i);

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

  registerCrossTypeOrderingRejects("slice", "list", s, l);

  it("add rejects slice and tuple in both orders", () => {
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
    expect(eq(s(), t())).toBe(false);
    expect(ne(s(), t())).toBe(true);
  });

  registerCrossTypeOrderingRejects("slice", "tuple", s, t);
});
