/**
 * CPython: complex is unhashable.
 */
import { describe, it, expect } from "vitest";
import { hash, pyComplex } from "../../src/index.js";
import { PyTypeError } from "../../src/runtime/core/errors.js";

describe("cpython-derived complex hash", () => {
  it("rejects hash on complex", () => {
    expect(() => hash(pyComplex(1, 2))).toThrow(PyTypeError);
    expect(() => hash(pyComplex(1, 2))).toThrow(/unhashable type: 'complex'/);
  });
});
