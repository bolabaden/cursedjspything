/**
 * CPython: slice objects are not hashable.
 */
import { describe, it, expect } from "vitest";
import { hash, pySlice } from "../../src/index.js";
import { PyTypeError } from "../../src/runtime/core/errors.js";

describe("cpython-derived slice unhashable", () => {
  it("slice is unhashable for full, empty-range, and bounded slices", () => {
    for (const s of [pySlice(), pySlice(0, 0), pySlice(1, 2, 3)]) {
      expect(() => hash(s)).toThrow(PyTypeError);
      expect(() => hash(s)).toThrow(/unhashable type: 'slice'/);
    }
  });
});
