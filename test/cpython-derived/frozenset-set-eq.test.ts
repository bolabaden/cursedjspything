/**
 * CPython: frozenset and set compare equal when contents match.
 */
import { describe, it, expect } from "vitest";
import { eq, pyFrozenSet, pyInt, pySet } from "../../src/index.js";

describe("frozenset and set cross-type __eq__", () => {
  it("frozenset equals set with same elements", () => {
    expect(eq(pyFrozenSet([pyInt(1)]), pySet([pyInt(1)]))).toBe(true);
    expect(
      eq(pyFrozenSet([pyInt(1), pyInt(2)]), pySet([pyInt(2), pyInt(1)])),
    ).toBe(true);
  });

  it("set equals frozenset with same elements", () => {
    expect(eq(pySet([pyInt(1)]), pyFrozenSet([pyInt(1)]))).toBe(true);
    expect(
      eq(pySet([pyInt(1), pyInt(2)]), pyFrozenSet([pyInt(2), pyInt(1)])),
    ).toBe(true);
  });

  it("returns false when contents differ", () => {
    expect(eq(pyFrozenSet([]), pySet([pyInt(1)]))).toBe(false);
    expect(eq(pySet([pyInt(1)]), pyFrozenSet([pyInt(2)]))).toBe(false);
  });

  it("returns false for non-set-like rhs", () => {
    expect(eq(pyFrozenSet([pyInt(1)]), pyInt(1))).toBe(false);
    expect(eq(pySet([pyInt(1)]), pyInt(1))).toBe(false);
  });
});
