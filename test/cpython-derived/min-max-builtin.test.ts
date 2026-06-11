/**
 * CPython: builtin min / max.
 */
import { describe, it, expect } from "vitest";
import {
  instantiate,
  makeClass,
  max,
  min,
  objectType,
  pyInt,
  pyList,
  pyStr,
  pyTuple,
  unwrap,
} from "../../src/index.js";
import { PyTypeError, PyValueError } from "../../src/runtime/core/errors.js";
import { Slot } from "../../src/runtime/core/slots.js";

function negKey() {
  const NegKey = makeClass({
    name: "NegKey",
    bases: [objectType],
    dict: new Map<string | symbol, unknown>([
      [Slot.call, (_self: unknown, x: unknown) =>
        pyInt(-unwrap(x as ReturnType<typeof pyInt>))],
    ]),
  });
  return instantiate(NegKey);
}

describe("cpython-derived min / max builtins", () => {
  it("min and max compare multiple positional values", () => {
    expect(unwrap(min(pyInt(3), pyInt(1), pyInt(2)))).toBe(1);
    expect(unwrap(max(pyInt(3), pyInt(1), pyInt(2)))).toBe(3);
  });

  it("min and max compare exactly two positional values", () => {
    expect(unwrap(min(pyInt(1), pyInt(2)))).toBe(1);
    expect(unwrap(max(pyInt(1), pyInt(2)))).toBe(2);
    expect(unwrap(min(pyStr("b"), pyStr("a")))).toBe("a");
    expect(unwrap(max(pyStr("b"), pyStr("a")))).toBe("b");
  });

  it("min and max accept one iterable", () => {
    expect(unwrap(min(pyList([pyInt(5), pyInt(2), pyInt(8)])))).toBe(2);
    expect(unwrap(max(pyTuple([pyInt(5), pyInt(2), pyInt(8)])))).toBe(8);
  });

  it("min and max work on strings lexicographically", () => {
    expect(unwrap(min(pyStr("b"), pyStr("a"), pyStr("c")))).toBe("a");
    expect(unwrap(max(pyStr("b"), pyStr("a"), pyStr("c")))).toBe("c");
  });

  it("raises TypeError with zero arguments", () => {
    expect(() => min()).toThrow(PyTypeError);
    expect(() => max()).toThrow(PyTypeError);
  });

  it("raises ValueError for empty iterable", () => {
    expect(() => min(pyList([]))).toThrow(PyValueError);
    expect(() => max(pyTuple([]))).toThrow(PyValueError);
  });

  it("raises TypeError for non-iterable single argument", () => {
    expect(() => min(pyInt(1))).toThrow(PyTypeError);
  });

  it("raises TypeError when elements are not orderable", () => {
    expect(() => min(pyInt(1), pyStr("a"))).toThrow(PyTypeError);
    expect(() => max(pyList([pyInt(1), pyStr("a")]))).toThrow(PyTypeError);
  });

  it("min and max honor callable key", () => {
    const items = pyList([pyInt(1), pyInt(3), pyInt(2)]);
    const key = negKey();
    expect(unwrap(min(items, key))).toBe(3);
    expect(unwrap(max(items, key))).toBe(1);
    expect(unwrap(min(pyInt(1), pyInt(3), key))).toBe(3);
  });

  it("empty iterable returns default when provided", () => {
    expect(unwrap(min(pyList([]), pyInt(99)))).toBe(99);
    expect(unwrap(max(pyTuple([]), pyStr("fallback")))).toBe("fallback");
  });

  it("empty iterable with key and default returns default", () => {
    expect(unwrap(min(pyList([]), negKey(), pyInt(42)))).toBe(42);
  });

  it("raises TypeError when default is used with multiple positional values", () => {
    const key = negKey();
    expect(() => min(pyInt(1), pyInt(2), key, pyInt(99))).toThrow(PyTypeError);
    expect(() => min(pyInt(1), pyInt(2), key, pyInt(99))).toThrow(
      /Cannot specify a default/,
    );
  });

  it("non-empty iterable ignores default", () => {
    expect(unwrap(min(pyList([pyInt(1), pyInt(2)]), pyInt(99)))).toBe(1);
  });
});
