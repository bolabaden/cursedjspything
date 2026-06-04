/**
 * CPython: list/tuple cross-type eq/ne without coercion (plan 682).
 */
import { describe, it, expect } from "vitest";
import { eq, ne, pyBytes, pyInt, pyList, pyTuple } from "../../src/index.js";

describe("sequence cross-type equality", () => {
  const oneList = () => pyList([pyInt(1)]);
  const oneTuple = () => pyTuple([pyInt(1)]);
  const oneBytes = () => pyBytes(new Uint8Array([1, 2]));

  it("eq rejects cross-type list and tuple even with equal elements", () => {
    expect(eq(oneList(), oneTuple())).toBe(false);
    expect(ne(oneList(), oneTuple())).toBe(true);
  });

  it("eq and ne do not coerce list and bytes", () => {
    expect(eq(oneList(), oneBytes())).toBe(false);
    expect(eq(oneBytes(), oneList())).toBe(false);
    expect(ne(oneList(), oneBytes())).toBe(true);
    expect(ne(oneBytes(), oneList())).toBe(true);
  });

  it("eq and ne do not coerce tuple and bytes", () => {
    expect(eq(oneTuple(), oneBytes())).toBe(false);
    expect(eq(oneBytes(), oneTuple())).toBe(false);
    expect(ne(oneTuple(), oneBytes())).toBe(true);
    expect(ne(oneBytes(), oneTuple())).toBe(true);
  });
});
