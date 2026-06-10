/**
 * CPython: sequence repetition accepts __index__ repeat counts (sequence_repeat).
 */
import { describe, it, expect } from "vitest";
import {
  instantiate,
  len,
  makeClass,
  mul,
  objectType,
  pyBytes,
  pyInt,
  pyList,
  pyStr,
  pyTuple,
  unwrap,
} from "../../src/index.js";
import { PyTypeError } from "../../src/runtime/core/errors.js";
import { Slot } from "../../src/runtime/core/slots.js";

function indexTwo(pyIntReturn = false) {
  const IndexTwo = makeClass({
    name: "IndexTwo",
    bases: [objectType],
    dict: new Map<string | symbol, unknown>([
      [Slot.index, () => (pyIntReturn ? pyInt(2) : 2)],
    ]),
  });
  return instantiate(IndexTwo);
}

describe("cpython-derived sequence repeat __index__", () => {
  it("str mul accepts __index__ repeat count (forward and reflected)", () => {
    const idx = indexTwo();
    expect(unwrap(mul(pyStr("ab"), idx) as ReturnType<typeof pyStr>)).toBe(
      "abab",
    );
    expect(unwrap(mul(idx, pyStr("ab")) as ReturnType<typeof pyStr>)).toBe(
      "abab",
    );
  });

  it("str mul accepts __index__ returning pyInt", () => {
    const idx = indexTwo(true);
    expect(unwrap(mul(pyStr("x"), idx) as ReturnType<typeof pyStr>)).toBe("xx");
  });

  it("bytes mul accepts __index__ repeat count", () => {
    const ab = pyBytes(new Uint8Array([97, 98]));
    const idx = indexTwo();
    expect(
      Array.from(unwrap<Uint8Array>(mul(ab, idx) as ReturnType<typeof pyBytes>)),
    ).toEqual([97, 98, 97, 98]);
    expect(
      Array.from(unwrap<Uint8Array>(mul(idx, ab) as ReturnType<typeof pyBytes>)),
    ).toEqual([97, 98, 97, 98]);
  });

  it("list and tuple mul accept __index__ repeat count", () => {
    const one = pyList([pyInt(1)]);
    const tup = pyTuple([pyInt(1)]);
    const idx = indexTwo();
    expect(len(mul(one, idx) as ReturnType<typeof pyList>)).toBe(2);
    expect(len(mul(idx, one) as ReturnType<typeof pyList>)).toBe(2);
    expect(len(mul(tup, idx) as ReturnType<typeof pyTuple>)).toBe(2);
    expect(len(mul(idx, tup) as ReturnType<typeof pyTuple>)).toBe(2);
  });

  it("rejects __index__ returning non-int", () => {
    const BadIndex = makeClass({
      name: "BadIndex",
      bases: [objectType],
      dict: new Map<string | symbol, unknown>([
        [Slot.index, () => pyStr("2")],
      ]),
    });
    const bad = instantiate(BadIndex);
    expect(() => mul(pyStr("a"), bad)).toThrow(PyTypeError);
    expect(() => mul(pyStr("a"), bad)).toThrow(/__index__ returned non-int/);
  });
});
