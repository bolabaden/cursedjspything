import { describe, it, expect } from "vitest";
import {
  PyObject, PyType, makeClass, Slot, Hook, NotImplemented,
  is, isNot, eq, ne, lt, le, gt, ge,
  add, sub, mul, truediv, floordiv, mod, pow, divmod,
  lshift, rshift, bitwiseAnd, bitwiseOr, bitwiseXor,
  iadd, neg, pos, abs, invert,
  hash, bool, toInt, toFloat, index,
  repr, str, format,
  round, trunc, floor, ceil,
  pyInt, pyFloat, pyStr, pyBool, pyNone, pyList, pyTuple,
  unwrap,
  PyTypeError,
} from "../../src/index.js";

describe("identity", () => {
  const A = makeClass({ name: "A", dict: new Map() });
  const a = new PyObject(A);
  const b = new PyObject(A);

  it("is() returns true for same object", () => { expect(is(a, a)).toBe(true); });
  it("is() returns false for different objects", () => { expect(is(a, b)).toBe(false); });
  it("isNot() is the inverse", () => { expect(isNot(a, b)).toBe(true); });
});

describe("rich comparison", () => {
  it("eq dispatches __eq__ on type", () => {
    expect(eq(pyInt(1), pyInt(1))).toBe(true);
    expect(eq(pyInt(1), pyInt(2))).toBe(false);
  });

  it("eq falls back to identity for objects without __eq__", () => {
    const A = makeClass({ name: "A", dict: new Map() });
    const a = new PyObject(A);
    const b = new PyObject(A);
    expect(eq(a, a)).toBe(true);
    expect(eq(a, b)).toBe(false);
  });

  it("subclass reflected method is tried first", () => {
    const Base = makeClass({
      name: "Base",
      dict: new Map<string | symbol, unknown>([
        [Slot.eq, () => "base-eq"],
      ]),
    });
    const Sub = makeClass({
      name: "Sub",
      bases: [Base],
      dict: new Map<string | symbol, unknown>([
        [Slot.eq, () => "sub-eq"],
      ]),
    });
    const base = new PyObject(Base);
    const sub = new PyObject(Sub);
    // When RHS is subclass, its __eq__ (reflected) is tried first.
    expect(eq(base, sub)).toBe("sub-eq");
  });

  it("lt/le/gt/ge work on ints", () => {
    expect(lt(pyInt(1), pyInt(2))).toBe(true);
    expect(le(pyInt(2), pyInt(2))).toBe(true);
    expect(gt(pyInt(3), pyInt(2))).toBe(true);
    expect(ge(pyInt(2), pyInt(2))).toBe(true);
  });

  it("ne works", () => {
    expect(ne(pyInt(1), pyInt(2))).toBe(true);
    expect(ne(pyInt(1), pyInt(1))).toBe(false);
  });
});

describe("numeric binary ops", () => {
  it("add ints", () => { expect(unwrap(add(pyInt(3), pyInt(4)) as PyObject)).toBe(7); });
  it("sub ints", () => { expect(unwrap(sub(pyInt(10), pyInt(3)) as PyObject)).toBe(7); });
  it("mul ints", () => { expect(unwrap(mul(pyInt(3), pyInt(4)) as PyObject)).toBe(12); });
  it("truediv ints → float", () => { expect(unwrap(truediv(pyInt(7), pyInt(2)) as PyObject)).toBe(3.5); });
  it("floordiv ints", () => { expect(unwrap(floordiv(pyInt(7), pyInt(2)) as PyObject)).toBe(3); });
  it("mod ints (Python-style)", () => { expect(unwrap(mod(pyInt(-7), pyInt(3)) as PyObject)).toBe(2); });
  it("pow ints", () => { expect(unwrap(pow(pyInt(2), pyInt(10)) as PyObject)).toBe(1024); });
  it("divmod ints", () => {
    const result = divmod(pyInt(7), pyInt(3)) as PyObject;
    expect(unwrap(result)).toHaveLength(2);
  });
  it("lshift/rshift", () => {
    expect(unwrap(lshift(pyInt(1), pyInt(3)) as PyObject)).toBe(8);
    expect(unwrap(rshift(pyInt(8), pyInt(3)) as PyObject)).toBe(1);
  });
  it("bitwise and/or/xor", () => {
    expect(unwrap(bitwiseAnd(pyInt(0b1100), pyInt(0b1010)) as PyObject)).toBe(0b1000);
    expect(unwrap(bitwiseOr(pyInt(0b1100), pyInt(0b1010)) as PyObject)).toBe(0b1110);
    expect(unwrap(bitwiseXor(pyInt(0b1100), pyInt(0b1010)) as PyObject)).toBe(0b0110);
  });
});

describe("in-place ops", () => {
  it("iadd falls back to add when no __iadd__", () => {
    const result = iadd(pyInt(3), pyInt(4)) as PyObject;
    expect(unwrap(result)).toBe(7);
  });

  it("iadd uses __iadd__ when defined (list extend)", () => {
    const a = pyList([pyInt(1)]);
    const b = pyList([pyInt(2)]);
    const result = iadd(a, b) as PyObject;
    expect(is(result, a)).toBe(true);
    expect(unwrap<PyObject[]>(result)).toHaveLength(2);
  });
});

describe("unary ops", () => {
  it("neg", () => { expect(unwrap(neg(pyInt(5)) as PyObject)).toBe(-5); });
  it("pos", () => { expect(unwrap(pos(pyInt(-3)) as PyObject)).toBe(-3); });
  it("abs", () => { expect(unwrap(abs(pyInt(-7)) as PyObject)).toBe(7); });
  it("invert", () => { expect(unwrap(invert(pyInt(0)) as PyObject)).toBe(-1); });
});

describe("hashing", () => {
  it("hash(int) returns the int value", () => {
    expect(hash(pyInt(42))).toBe(42);
  });
  it("hash(str) returns a consistent value", () => {
    const h1 = hash(pyStr("hello"));
    const h2 = hash(pyStr("hello"));
    expect(h1).toBe(h2);
  });
});

describe("truthiness", () => {
  it("bool(0) is false, bool(1) is true", () => {
    expect(bool(pyInt(0))).toBe(false);
    expect(bool(pyInt(1))).toBe(true);
  });
  it("bool(empty str) is false", () => {
    expect(bool(pyStr(""))).toBe(false);
    expect(bool(pyStr("x"))).toBe(true);
  });
  it("bool(None) is false", () => {
    expect(bool(pyNone)).toBe(false);
  });
  it("bool falls back to __len__", () => {
    expect(bool(pyList([]))).toBe(false);
    expect(bool(pyList([pyInt(1)]))).toBe(true);
  });
});

describe("conversions", () => {
  it("toInt from float", () => { expect(toInt(pyFloat(3.7))).toBe(3); });
  it("toFloat from int", () => { expect(toFloat(pyInt(5))).toBe(5); });
  it("index from int", () => { expect(index(pyInt(7))).toBe(7); });
  it("index from bool", () => { expect(index(pyBool(true))).toBe(1); });
});

describe("rounding", () => {
  it("round float", () => { expect(unwrap(round(pyFloat(3.7)) as PyObject)).toBe(4); });
  it("trunc float", () => { expect(unwrap(trunc(pyFloat(3.7)) as PyObject)).toBe(3); });
  it("floor float", () => { expect(unwrap(floor(pyFloat(3.7)) as PyObject)).toBe(3); });
  it("ceil float", () => { expect(unwrap(ceil(pyFloat(3.2)) as PyObject)).toBe(4); });
});

describe("representation", () => {
  it("repr(int)", () => { expect(repr(pyInt(42))).toBe("42"); });
  it("repr(str)", () => { expect(repr(pyStr("hi"))).toBe("'hi'"); });
  it("str(int)", () => { expect(str(pyInt(42))).toBe("42"); });
  it("str falls back to repr", () => {
    const Cls = makeClass({
      name: "Cls",
      dict: new Map<string | symbol, unknown>([
        [Slot.repr, () => "<Cls>"],
      ]),
    });
    expect(str(new PyObject(Cls))).toBe("<Cls>");
  });
  it("format(int)", () => { expect(format(pyInt(255), "x")).toBe("ff"); });
});

describe("hash and bool strictness", () => {
  it("__hash__ must return a number", () => {
    const BadHash = makeClass({
      name: "BadHash",
      dict: new Map<string | symbol, unknown>([
        [Slot.hash, () => "nope"],
      ]),
    });
    expect(() => hash(new PyObject(BadHash))).toThrow(PyTypeError);
  });

  it("__bool__ must return a boolean", () => {
    const BadBool = makeClass({
      name: "BadBool",
      dict: new Map<string | symbol, unknown>([
        [Slot.bool, () => 1],
      ]),
    });
    expect(() => bool(new PyObject(BadBool))).toThrow(PyTypeError);
  });

  it("hash coerces with | 0 for large integers", () => {
    const Big = makeClass({
      name: "Big",
      dict: new Map<string | symbol, unknown>([
        [Slot.hash, () => 2 ** 40],
      ]),
    });
    expect(hash(new PyObject(Big))).toBe((2 ** 40) | 0);
  });
});

describe("reflected ops with NotImplemented", () => {
  it("int + str raises TypeError", () => {
    expect(() => add(pyInt(1), pyStr("a"))).toThrow();
  });

  it("lt raises TypeError when both sides return NotImplemented", () => {
    const Incomparable = makeClass({
      name: "Incomparable",
      dict: new Map<string | symbol, unknown>([
        [Slot.lt, () => NotImplemented],
        [Slot.gt, () => NotImplemented],
      ]),
    });
    const a = new PyObject(Incomparable);
    const b = new PyObject(Incomparable);
    expect(() => lt(a, b)).toThrow(PyTypeError);
  });

  it("eq(pyList, pyInt) is false (list __eq__ returns NotImplemented, identity fallback)", () => {
    expect(eq(pyList([]), pyInt(1))).toBe(false);
  });

  it("custom reflected op is used", () => {
    const Vec = makeClass({
      name: "Vec",
      dict: new Map<string | symbol, unknown>([
        [Slot.rmul, (_self: PyObject, _other: PyObject) => pyStr("vec-scaled")],
      ]),
    });
    const v = new PyObject(Vec);
    const result = mul(pyInt(3), v);
    expect(unwrap(result as PyObject)).toBe("vec-scaled");
  });
});
