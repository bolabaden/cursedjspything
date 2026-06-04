/**
 * CPython: frozenset and set support &, |, -, ^ with set-like operands.
 */
import { describe, it, expect } from "vitest";
import {
  bitwiseAnd,
  bitwiseOr,
  bitwiseXor,
  eq,
  instantiate,
  len,
  makeClass,
  NotImplemented,
  objectType,
  PyObject,
  pyFrozenSet,
  pyInt,
  pySet,
  sub,
} from "../../src/index.js";
import { Slot } from "../../src/runtime/core/slots.js";
import { PyTypeError } from "../../src/runtime/core/errors.js";

function equalKeyPair(): [PyObject, PyObject] {
  const Key = makeClass({
    name: "Key",
    bases: [objectType],
    dict: new Map<string | symbol, unknown>([
      [Slot.hash, () => 65],
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

  it("operator algebra uses hash+eq with cross-type lhs types", () => {
    const [k1, k2] = equalKeyPair();
    const three = pyInt(3);

    const froUnion = bitwiseOr(pyFrozenSet([k1]), pySet([k2, three])) as PyObject;
    expect(froUnion.type.name).toBe("frozenset");
    expect(len(froUnion)).toBe(2);
    expect(eq(froUnion, pyFrozenSet([k1, three]))).toBe(true);

    const setUnion = bitwiseOr(pySet([k1]), pyFrozenSet([k2])) as PyObject;
    expect(setUnion.type.name).toBe("set");
    expect(len(setUnion)).toBe(1);

    const inter = bitwiseAnd(
      pyFrozenSet([k1, three]),
      pySet([k2]),
    ) as PyObject;
    expect(inter.type.name).toBe("frozenset");
    expect(eq(inter, pyFrozenSet([k1]))).toBe(true);

    const diff = sub(pySet([k1, three]), pyFrozenSet([k2])) as PyObject;
    expect(diff.type.name).toBe("set");
    expect(eq(diff, pySet([three]))).toBe(true);

    const sym = bitwiseXor(pyFrozenSet([k1]), pySet([k2, three])) as PyObject;
    expect(sym.type.name).toBe("frozenset");
    expect(eq(sym, pyFrozenSet([three]))).toBe(true);
  });
});
