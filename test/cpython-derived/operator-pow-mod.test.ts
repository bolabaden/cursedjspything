/**
 * Vitest ports of CPython three-arg pow() edge cases.
 */
import { describe, it, expect } from "vitest";
import { pow, pyInt, unwrap } from "../../src/index.js";
import { PyValueError } from "../../src/runtime/core/errors.js";

describe("cpython-derived int pow with mod", () => {
  it("two-arg pow still works", () => {
    expect(unwrap(pow(pyInt(2), pyInt(10)) as ReturnType<typeof pyInt>)).toBe(1024);
  });

  it("mod zero raises ValueError", () => {
    expect(() => pow(pyInt(2), pyInt(3), pyInt(0))).toThrow(PyValueError);
    expect(() => pow(pyInt(2), pyInt(3), pyInt(0))).toThrow(
      /pow\(\) 3rd argument cannot be 0/,
    );
  });
});
