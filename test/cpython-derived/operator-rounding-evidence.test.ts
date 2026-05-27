/**
 * CPython: round/trunc/floor/ceil reject types without numeric hooks.
 */
import { describe, it, expect } from "vitest";
import { ceil, floor, pyList, round, trunc } from "../../src/index.js";
import { PyTypeError } from "../../src/runtime/core/errors.js";

describe("cpython-derived rounding on list", () => {
  const lst = () => pyList([]);

  it("round rejects list", () => {
    expect(() => round(lst())).toThrow(PyTypeError);
    expect(() => round(lst())).toThrow(
      /type list doesn't define __round__ method/,
    );
  });

  it("trunc rejects list", () => {
    expect(() => trunc(lst())).toThrow(PyTypeError);
    expect(() => trunc(lst())).toThrow(
      /type list doesn't define __trunc__ method/,
    );
  });

  it("floor rejects list", () => {
    expect(() => floor(lst())).toThrow(PyTypeError);
    expect(() => floor(lst())).toThrow(
      /type list doesn't define __floor__ method/,
    );
  });

  it("ceil rejects list", () => {
    expect(() => ceil(lst())).toThrow(PyTypeError);
    expect(() => ceil(lst())).toThrow(
      /type list doesn't define __ceil__ method/,
    );
  });
});
