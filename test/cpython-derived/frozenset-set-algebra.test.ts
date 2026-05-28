/**
 * CPython: frozenset and set support &, |, -, ^ with set-like operands.
 */
import { describe, it, expect } from "vitest";
import {
  PyObject,
  bitwiseAnd,
  bitwiseOr,
  bitwiseXor,
  eq,
  sub,
  pyFrozenSet,
  pyInt,
  pySet,
} from "../../src/index.js";
import { PyTypeError } from "../../src/runtime/core/errors.js";

describe("frozenset and set algebra", () => {
  it("frozenset & frozenset returns frozenset intersection", () => {
    const one = pyInt(1);
    const two = pyInt(2);
    const three = pyInt(3);
    const result = bitwiseAnd(
      pyFrozenSet([one, two]),
      pyFrozenSet([two, three]),
    ) as PyObject;
    expect(result.type.name).toBe("frozenset");
    expect(eq(result, pyFrozenSet([two]))).toBe(true);
  });

  it("frozenset | set returns frozenset union", () => {
    const one = pyInt(1);
    const two = pyInt(2);
    const result = bitwiseOr(pyFrozenSet([one]), pySet([two])) as PyObject;
    expect(result.type.name).toBe("frozenset");
    expect(eq(result, pyFrozenSet([one, two]))).toBe(true);
  });

  it("set | frozenset returns set union", () => {
    const one = pyInt(1);
    const two = pyInt(2);
    const result = bitwiseOr(pySet([one]), pyFrozenSet([two])) as PyObject;
    expect(result.type.name).toBe("set");
    expect(eq(result, pySet([one, two]))).toBe(true);
  });

  it("frozenset - set and frozenset ^ set", () => {
    const one = pyInt(1);
    const two = pyInt(2);
    const diff = sub(pyFrozenSet([one, two]), pySet([two])) as PyObject;
    expect(diff.type.name).toBe("frozenset");
    expect(eq(diff, pyFrozenSet([one]))).toBe(true);

    const sym = bitwiseXor(pyFrozenSet([one]), pySet([two])) as PyObject;
    expect(sym.type.name).toBe("frozenset");
    expect(eq(sym, pyFrozenSet([one, two]))).toBe(true);
  });

  it("rejects non-set-like rhs", () => {
    expect(() => bitwiseOr(pyFrozenSet([pyInt(1)]), pyInt(2))).toThrow(
      PyTypeError,
    );
  });
});
