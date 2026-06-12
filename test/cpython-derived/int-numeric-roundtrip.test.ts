/**
 * CPython: int to_bytes / from_bytes / as_integer_ratio roundtrip.
 */
import { describe, it, expect } from "vitest";
import {
  PyObject,
  getAttr,
  getItem,
  intType,
  pyFalse,
  pyInt,
  pyStr,
  pyTrue,
  tupleType,
  unwrap,
} from "../../src/index.js";
import { pyIntFromSafeInteger } from "../../src/runtime/builtins/int.js";

describe("cpython-derived int numeric roundtrip", () => {
  type ToBytesFn = (
    self: PyObject,
    length: unknown,
    byteorder: unknown,
    signed?: unknown,
  ) => PyObject;
  type FromBytesFn = (
    cls: unknown,
    bytesArg: unknown,
    byteorder: unknown,
    signed?: unknown,
  ) => PyObject;
  type AsRatioFn = (self: PyObject) => PyObject;

  function roundtripRatio(
    value: PyObject,
    length: number,
    byteorder: "big" | "little",
    signed = false,
  ): [number, number] {
    const toBytes = getAttr(value, "to_bytes") as ToBytesFn;
    const fromBytes = intType.typeDict.get("from_bytes") as FromBytesFn;
    const encoded = toBytes(
      value,
      pyInt(length),
      pyStr(byteorder),
      signed ? pyTrue : pyFalse,
    );
    const decoded = fromBytes(
      intType,
      encoded,
      pyStr(byteorder),
      signed ? pyTrue : pyFalse,
    );
    const asRatio = getAttr(decoded, "as_integer_ratio") as AsRatioFn;
    const tup = asRatio(decoded);
    expect(tup.type).toBe(tupleType);
    return [unwrap(getItem(tup, 0)), unwrap(getItem(tup, 1))];
  }

  it("small signed int roundtrips through bytes to (n, 1) ratio", () => {
    const n = -1024;
    const self = pyInt(n);
    const [num, den] = roundtripRatio(self, 2, "big", true);
    expect(num).toBe(n);
    expect(den).toBe(1);
  });

  it("positive int roundtrips through big-endian bytes", () => {
    const n = 42;
    const self = pyInt(n);
    const [num, den] = roundtripRatio(self, 2, "big");
    expect(num).toBe(n);
    expect(den).toBe(1);
  });

  it("MAX_SAFE_INTEGER roundtrips via eight-byte little-endian encoding", () => {
    const max = Number.MAX_SAFE_INTEGER;
    const self = pyIntFromSafeInteger(max);
    const [num, den] = roundtripRatio(self, 8, "little");
    expect(num).toBe(max);
    expect(den).toBe(1);
  });
});
