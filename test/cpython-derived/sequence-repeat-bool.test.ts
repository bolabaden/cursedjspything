/**
 * CPython: bool subclasses int — sequence repetition accepts bool repeat counts.
 */
import { describe, it, expect } from "vitest";
import {
  len,
  mul,
  pyBytes,
  pyFalse,
  pyInt,
  pyList,
  pyStr,
  pyTrue,
  pyTuple,
  unwrap,
} from "../../src/index.js";

describe("cpython-derived list/tuple repetition with bool", () => {
  it("list mul treats True as 1 and False as 0", () => {
    const one = pyList([pyInt(1)]);
    expect(len(mul(one, pyTrue) as ReturnType<typeof pyList>)).toBe(1);
    expect(len(mul(one, pyFalse) as ReturnType<typeof pyList>)).toBe(0);
  });

  it("tuple mul treats True as 1 and False as 0", () => {
    const one = pyTuple([pyInt(1)]);
    expect(len(mul(one, pyTrue) as ReturnType<typeof pyTuple>)).toBe(1);
    expect(len(mul(one, pyFalse) as ReturnType<typeof pyTuple>)).toBe(0);
  });

  it("reflected mul (bool * sequence) matches forward", () => {
    const oneList = pyList([pyInt(1)]);
    expect(len(mul(pyTrue, oneList) as ReturnType<typeof pyList>)).toBe(1);
    expect(len(mul(pyFalse, oneList) as ReturnType<typeof pyList>)).toBe(0);

    const oneTuple = pyTuple([pyInt(1)]);
    expect(len(mul(pyTrue, oneTuple) as ReturnType<typeof pyTuple>)).toBe(1);
    expect(len(mul(pyFalse, oneTuple) as ReturnType<typeof pyTuple>)).toBe(0);
  });

  it("negative int repeat count yields empty sequence", () => {
    const oneList = pyList([pyInt(1)]);
    expect(len(mul(oneList, pyInt(-1)) as ReturnType<typeof pyList>)).toBe(0);

    const oneTuple = pyTuple([pyInt(1)]);
    expect(len(mul(oneTuple, pyInt(-1)) as ReturnType<typeof pyTuple>)).toBe(0);
  });

  it("repeats multi-element sequences (general path)", () => {
    const ab = pyList([pyInt(1), pyInt(2)]);
    expect(len(mul(ab, pyInt(3)) as ReturnType<typeof pyList>)).toBe(6);

    const tup = pyTuple([pyInt(1), pyInt(2)]);
    expect(len(mul(tup, pyInt(2)) as ReturnType<typeof pyTuple>)).toBe(4);
  });

  it("large repeat count builds expected length", () => {
    const one = pyList([pyInt(0)]);
    expect(len(mul(one, pyInt(150_000)) as ReturnType<typeof pyList>)).toBe(150_000);

    const tup = pyTuple([pyInt(0)]);
    expect(len(mul(tup, pyInt(150_000)) as ReturnType<typeof pyTuple>)).toBe(150_000);
  });

  it("wide source repeat avoids V8 spread-argument limit", () => {
    const zero = pyInt(0);
    const wide = pyList(Array.from({ length: 127_000 }, () => zero));
    expect(len(mul(wide, pyInt(1)) as ReturnType<typeof pyList>)).toBe(127_000);
  });
});

describe("cpython-derived bytes repetition with bool", () => {
  it("bytes mul treats True as 1 and False as 0", () => {
    const ab = pyBytes(new Uint8Array([97, 98]));
    expect(
      Array.from(unwrap<Uint8Array>(mul(ab, pyTrue) as ReturnType<typeof pyBytes>)),
    ).toEqual([97, 98]);
    expect(
      len(mul(ab, pyFalse) as ReturnType<typeof pyBytes>),
    ).toBe(0);
  });

  it("reflected mul (bool * bytes) matches forward", () => {
    const ab = pyBytes(new Uint8Array([97, 98]));
    expect(
      Array.from(unwrap<Uint8Array>(mul(pyTrue, ab) as ReturnType<typeof pyBytes>)),
    ).toEqual([97, 98]);
    expect(len(mul(pyFalse, ab) as ReturnType<typeof pyBytes>)).toBe(0);
  });

  it("negative int repeat count yields empty bytes", () => {
    const ab = pyBytes(new Uint8Array([97, 98]));
    expect(len(mul(ab, pyInt(-1)) as ReturnType<typeof pyBytes>)).toBe(0);
  });

  it("repeats multi-byte sequences (general path)", () => {
    const ab = pyBytes(new Uint8Array([1, 2]));
    const repeated = mul(ab, pyInt(3)) as ReturnType<typeof pyBytes>;
    expect(len(repeated)).toBe(6);
    expect(Array.from(unwrap<Uint8Array>(repeated))).toEqual([
      1, 2, 1, 2, 1, 2,
    ]);
  });
});

describe("cpython-derived str repetition with bool", () => {
  it("str mul treats True as 1 and False as 0", () => {
    expect(unwrap<string>(mul(pyStr("ab"), pyTrue) as ReturnType<typeof pyStr>)).toBe(
      "ab",
    );
    expect(unwrap<string>(mul(pyStr("ab"), pyFalse) as ReturnType<typeof pyStr>)).toBe(
      "",
    );
  });

  it("reflected mul (bool * str) matches forward", () => {
    expect(unwrap<string>(mul(pyTrue, pyStr("ab")) as ReturnType<typeof pyStr>)).toBe(
      "ab",
    );
    expect(unwrap<string>(mul(pyFalse, pyStr("ab")) as ReturnType<typeof pyStr>)).toBe(
      "",
    );
  });

  it("negative int repeat count yields empty string", () => {
    expect(unwrap<string>(mul(pyStr("ab"), pyInt(-1)) as ReturnType<typeof pyStr>)).toBe(
      "",
    );
  });

  it("repeats multi-character strings (general path)", () => {
    expect(unwrap<string>(mul(pyStr("ab"), pyInt(3)) as ReturnType<typeof pyStr>)).toBe(
      "ababab",
    );
  });
});
