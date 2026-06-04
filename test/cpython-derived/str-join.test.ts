/**
 * CPython: str.join concatenates str iterables with a separator.
 */
import { describe, it, expect } from "vitest";
import {
  PyObject,
  getAttr,
  pyBytes,
  pyInt,
  pyList,
  pyStr,
  pyTuple,
  unwrap,
} from "../../src/index.js";
import { PyTypeError } from "../../src/runtime/core/errors.js";

type JoinFn = (self: PyObject, iterable: unknown) => unknown;

describe("cpython-derived str join", () => {
  function join(sep: string, iterable: unknown): unknown {
    const sepObj = pyStr(sep);
    const joinFn = getAttr(sepObj, "join") as JoinFn;
    return joinFn(sepObj, iterable);
  }

  function asStr(v: unknown): string {
    return unwrap<string>(v as PyObject);
  }

  it("joins str list with separator", () => {
    const parts = pyList([pyStr("a"), pyStr("b"), pyStr("c")]);
    expect(asStr(join(" ", parts))).toBe("a b c");
    expect(asStr(join(",", parts))).toBe("a,b,c");
  });

  it("joins tuple iterable", () => {
    const parts = pyTuple([pyStr("x"), pyStr("y")]);
    expect(asStr(join("-", parts))).toBe("x-y");
  });

  it("joins Unicode strings", () => {
    const parts = pyList([pyStr("café"), pyStr("naïve")]);
    expect(asStr(join(" / ", parts))).toBe("café / naïve");
  });

  it("empty iterable returns empty str", () => {
    expect(asStr(join("-", pyList([])))).toBe("");
  });

  it("single element has no separator", () => {
    expect(asStr(join("|", pyList([pyStr("only")])))).toBe("only");
  });

  it("empty separator concatenates without intervening text", () => {
    const parts = pyList([pyStr("a"), pyStr("b"), pyStr("c")]);
    expect(asStr(join("", parts))).toBe("abc");
    expect(asStr(join("", pyList([])))).toBe("");
  });

  it("rejects non-str sequence items", () => {
    const parts = pyList([pyStr("a"), pyBytes(new Uint8Array([98]))]);
    expect(() => join(",", parts)).toThrow(PyTypeError);
    expect(() => join(",", parts)).toThrow(
      /sequence item 1: expected str instance, bytes found/,
    );
  });

  it("rejects non-iterable", () => {
    expect(() => join(",", pyInt(1))).toThrow(PyTypeError);
    expect(() => join(",", pyInt(1))).toThrow(/can only join an iterable/);
  });
});
