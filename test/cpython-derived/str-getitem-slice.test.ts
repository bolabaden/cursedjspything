/**
 * CPython: str __getitem__ slice and integer/__index__ subscripts (plan 849).
 */
import { describe, it, expect } from "vitest";
import {
  getItem,
  instantiate,
  makeClass,
  objectType,
  pyInt,
  pySlice,
  pyStr,
  pyTrue,
  strType,
  unwrap,
} from "../../src/index.js";
import { PyIndexError, PyTypeError } from "../../src/runtime/core/errors.js";
import { Slot } from "../../src/runtime/core/slots.js";

function indexTwo() {
  const IndexTwo = makeClass({
    name: "IndexTwo",
    bases: [objectType],
    dict: new Map<string | symbol, unknown>([
      [Slot.index, () => pyInt(2)],
    ]),
  });
  return instantiate(IndexTwo);
}

describe("cpython-derived str getitem", () => {
  const abcd = () => pyStr("abcd");

  it("indexes with pyInt and negative pyInt", () => {
    expect(unwrap(getItem(abcd(), pyInt(0)) as ReturnType<typeof pyStr>)).toBe("a");
    expect(unwrap(getItem(abcd(), pyInt(-1)) as ReturnType<typeof pyStr>)).toBe("d");
  });

  it("indexes with __index__ and bool", () => {
    expect(unwrap(getItem(abcd(), indexTwo()) as ReturnType<typeof pyStr>)).toBe("c");
    expect(unwrap(getItem(abcd(), pyTrue) as ReturnType<typeof pyStr>)).toBe("b");
  });

  it("slice returns str subsequence", () => {
    const part = getItem(abcd(), pySlice(1, 3, null));
    expect((part as ReturnType<typeof pyStr>).type).toBe(strType);
    expect(unwrap(part as ReturnType<typeof pyStr>)).toBe("bc");
  });

  it("slice with step and reverse", () => {
    expect(unwrap(getItem(abcd(), pySlice(null, null, 2)) as ReturnType<typeof pyStr>)).toBe(
      "ac",
    );
    expect(unwrap(getItem(abcd(), pySlice(null, null, -1)) as ReturnType<typeof pyStr>)).toBe(
      "dcba",
    );
  });

  it("rejects out of range and invalid keys", () => {
    expect(() => getItem(abcd(), pyInt(9))).toThrow(PyIndexError);
    expect(() => getItem(abcd(), pyStr("a"))).toThrow(PyTypeError);
    expect(() => getItem(abcd(), pyStr("a"))).toThrow(/string indices must be integers/);
  });
});
