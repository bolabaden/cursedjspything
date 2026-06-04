/**
 * CPython: list __imul__ (plan 676 rejects; plan 717 in-place int repeat).
 */
import { describe, it, expect } from "vitest";
import { imul, len, pyFloat, pyInt, pyList, pyTuple } from "../../src/index.js";
import { PyTypeError } from "../../src/runtime/core/errors.js";

describe("list __imul__", () => {
  const oneList = () => pyList([pyInt(1)]);

  it("imul repeats list in place with int", () => {
    const lst = oneList();
    const out = imul(lst, pyInt(2)) as ReturnType<typeof pyList>;
    expect(out).toBe(lst);
    expect(len(out)).toBe(2);
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
