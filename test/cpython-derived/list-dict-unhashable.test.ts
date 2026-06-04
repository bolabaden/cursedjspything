/**
 * CPython: list and dict are not hashable.
 */
import { describe, it, expect } from "vitest";
import { hash, pyDict, pyInt, pyList, pyStr } from "../../src/index.js";
import { PyTypeError } from "../../src/runtime/core/errors.js";

describe("cpython-derived list/dict unhashable", () => {
  it("list is unhashable when empty or non-empty", () => {
    expect(() => hash(pyList([]))).toThrow(PyTypeError);
    expect(() => hash(pyList([]))).toThrow(/unhashable type: 'list'/);
    expect(() => hash(pyList([pyInt(1)]))).toThrow(PyTypeError);
    expect(() => hash(pyList([pyInt(1)]))).toThrow(/unhashable type: 'list'/);
  });

  it("dict is unhashable when empty or non-empty", () => {
    expect(() => hash(pyDict([]))).toThrow(PyTypeError);
    expect(() => hash(pyDict([]))).toThrow(/unhashable type: 'dict'/);
    expect(() =>
      hash(
        pyDict([
          [pyStr("a"), pyInt(1)],
        ]),
      ),
    ).toThrow(PyTypeError);
    expect(() =>
      hash(
        pyDict([
          [pyStr("a"), pyInt(1)],
        ]),
      ),
    ).toThrow(/unhashable type: 'dict'/);
  });
});
