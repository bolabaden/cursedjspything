/**
 * CPython: list __imul__ (plan 676 rejects; plan 717 int; plan 719 bool).
 */
import { describe, it, expect } from "vitest";
import { imul, len, pyFalse, pyFloat, pyInt, pyList, pyTrue, pyTuple } from "../../src/index.js";
import { PyTypeError } from "../../src/runtime/core/errors.js";

describe("list __imul__", () => {
  const oneList = () => pyList([pyInt(1)]);

  it("imul repeats list in place with int", () => {
    const lst = oneList();
    const out = imul(lst, pyInt(2)) as ReturnType<typeof pyList>;
    expect(out).toBe(lst);
    expect(len(out)).toBe(2);
  });

  it("imul repeats list in place with bool", () => {
    const lst = oneList();
    const outTrue = imul(lst, pyTrue) as ReturnType<typeof pyList>;
    expect(outTrue).toBe(lst);
    expect(len(outTrue)).toBe(1);
    const empty = pyList([pyInt(1)]);
    const outFalse = imul(empty, pyFalse) as ReturnType<typeof pyList>;
    expect(outFalse).toBe(empty);
    expect(len(outFalse)).toBe(0);
  });

  it("imul rejects list and float", () => {
    expect(() => imul(oneList(), pyFloat(2))).toThrow(PyTypeError);
    expect(() => imul(oneList(), pyFloat(2))).toThrow(
      /unsupported operand type\(s\) for \*=: 'list' and 'float'/,
    );
  });

  it("imul rejects list and list", () => {
    expect(() => imul(oneList(), pyList([pyInt(2)]))).toThrow(PyTypeError);
    expect(() => imul(oneList(), pyList([pyInt(2)]))).toThrow(
      /unsupported operand type\(s\) for \*=: 'list' and 'list'/,
    );
  });

  it("imul rejects list and tuple", () => {
    expect(() => imul(oneList(), pyTuple([pyInt(2)]))).toThrow(PyTypeError);
    expect(() => imul(oneList(), pyTuple([pyInt(2)]))).toThrow(
      /unsupported operand type\(s\) for \*=: 'list' and 'tuple'/,
    );
  });
});
