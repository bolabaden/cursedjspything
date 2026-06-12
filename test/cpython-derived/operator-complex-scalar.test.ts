/**
 * CPython: complex scalar arithmetic (add / sub / mul).
 */
import { describe, it, expect } from "vitest";
import {
  add,
  sub,
  mul,
  pyComplex,
  pyInt,
  pyFloat,
  pyList,
  pyTrue,
  repr,
} from "../../src/index.js";
import { PyTypeError } from "../../src/runtime/core/errors.js";

describe("cpython-derived complex scalar arithmetic", () => {
  it("complex + complex", () => {
    expect(repr(add(pyComplex(1, 2), pyComplex(3, 4)))).toBe("(4+6j)");
  });

  it("complex + int and int + complex", () => {
    expect(repr(add(pyComplex(1, 2), pyInt(5)))).toBe("(6+2j)");
    expect(repr(add(pyInt(5), pyComplex(1, 2)))).toBe("(6+2j)");
  });

  it("complex - scalar and scalar - complex", () => {
    expect(repr(sub(pyComplex(1, 2), pyInt(1)))).toBe("2j");
    expect(repr(sub(pyInt(3), pyComplex(1, 2)))).toBe("(2-2j)");
  });

  it("complex * scalar and scalar * complex", () => {
    expect(repr(mul(pyComplex(1, 2), pyInt(2)))).toBe("(2+4j)");
    expect(repr(mul(pyInt(2), pyComplex(1, 2)))).toBe("(2+4j)");
    expect(repr(mul(pyComplex(1, 2), pyFloat(2)))).toBe("(2+4j)");
  });

  it("complex +/-/* bool follows int subclass semantics", () => {
    const c = pyComplex(1, 2);
    expect(repr(add(c, pyTrue))).toBe("(2+2j)");
    expect(repr(add(pyTrue, c))).toBe("(2+2j)");
    expect(repr(sub(c, pyTrue))).toBe("2j");
    expect(repr(sub(pyTrue, c))).toBe("-2j");
    expect(repr(mul(c, pyTrue))).toBe("(1+2j)");
    expect(repr(mul(pyTrue, c))).toBe("(1+2j)");
  });

  it("complex * complex", () => {
    expect(repr(mul(pyComplex(1, 2), pyComplex(3, 4)))).toBe("(-5+10j)");
  });

  it("rejects non-numeric operands", () => {
    expect(() => add(pyList([]), pyComplex(1, 2))).toThrow(PyTypeError);
    expect(() => add(pyList([]), pyComplex(1, 2))).toThrow(
      /unsupported operand type\(s\) for \+/,
    );
  });
});
