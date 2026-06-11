/**
 * CPython: numeric conversion helpers reject types without __int__/__float__/__index__/__complex__.
 */
import { describe, it, expect } from "vitest";
import {
  index,
  pyList,
  complexProtocol,
  floatProtocol,
  intProtocol,
} from "../../src/index.js";
import { PyTypeError } from "../../src/runtime/core/errors.js";

describe("cpython-derived numeric conversion on list", () => {
  const lst = () => pyList([]);

  it("intProtocol rejects list", () => {
    expect(() => intProtocol(lst())).toThrow(PyTypeError);
    expect(() => intProtocol(lst())).toThrow(
      /int\(\) argument must be a string or a real number, not 'list'/,
    );
  });

  it("floatProtocol rejects list", () => {
    expect(() => floatProtocol(lst())).toThrow(PyTypeError);
    expect(() => floatProtocol(lst())).toThrow(
      /float\(\) argument must be a string or a real number, not 'list'/,
    );
  });

  it("index rejects list", () => {
    expect(() => index(lst())).toThrow(PyTypeError);
    expect(() => index(lst())).toThrow(
      /'list' object cannot be interpreted as an integer/,
    );
  });

  it("complexProtocol rejects list", () => {
    expect(() => complexProtocol(lst())).toThrow(PyTypeError);
    expect(() => complexProtocol(lst())).toThrow(
      /complex\(\) argument must be a string or a number, not 'list'/,
    );
  });
});
