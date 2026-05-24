/**
 * Vitest ports of CPython bool↔float cross-type cases.
 */
import { describe, it, expect } from "vitest";
import {
  PyObject,
  add,
  eq,
  pyTrue,
  pyFalse,
  pyFloat,
  unwrap,
} from "../../src/index.js";
import { floatType } from "../../src/runtime/builtins/float.js";

describe("cpython-derived bool/float comparisons", () => {
  it("eq treats True as 1.0 and False as 0.0", () => {
    expect(eq(pyTrue, pyFloat(1.0))).toBe(true);
    expect(eq(pyFloat(1.0), pyTrue)).toBe(true);
    expect(eq(pyFalse, pyFloat(0.0))).toBe(true);
    expect(eq(pyFloat(0.0), pyFalse)).toBe(true);
    expect(eq(pyTrue, pyFloat(0.0))).toBe(false);
  });
});

describe("cpython-derived bool/float arithmetic", () => {
  it("add bool + float promotes to float", () => {
    const result = add(pyTrue, pyFloat(1.0)) as PyObject;
    expect(result.type).toBe(floatType);
    expect(unwrap<number>(result)).toBe(2);
  });

  it("add float + bool via forward float slot", () => {
    const result = add(pyFloat(1.0), pyTrue) as PyObject;
    expect(result.type).toBe(floatType);
    expect(unwrap<number>(result)).toBe(2);
  });
});
