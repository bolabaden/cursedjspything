/**
 * CPython: bool subclasses int — sequence repetition accepts bool repeat counts.
 */
import { describe, it, expect } from "vitest";
import {
  len,
  mul,
  pyFalse,
  pyInt,
  pyList,
  pyTrue,
  pyTuple,
} from "../../src/index.js";

describe("cpython-derived list/tuple repetition with bool", () => {
  it("list mul treats True as 1 and False as 0", () => {
    const one = pyList([pyInt(1)]);
    expect(len(mul(one, pyTrue) as ReturnType<typeof pyList>)).toBe(1);
    expect(len(mul(one, pyFalse) as ReturnType<typeof pyList>)).toBe(0);
  });

  it("tuple mul treats True as 1 and False as 0", () => {
    const one = pyTuple([pyInt(1)]);
    expect(len(mul(one, pyTrue) as ReturnType<typeof pyTuple>)).toBe(1);
    expect(len(mul(one, pyFalse) as ReturnType<typeof pyTuple>)).toBe(0);
  });
});
