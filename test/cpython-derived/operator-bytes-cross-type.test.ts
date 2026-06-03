/**
 * CPython: bytes add/mul happy paths (cross-type rejects → operator-bytes-remaining-cross-type).
 */
import { describe, it, expect } from "vitest";
import {
  add,
  bytes,
  bytesType,
  mul,
  pyBytes,
  pyInt,
  pyStr,
  unwrap,
} from "../../src/index.js";

describe("cpython-derived bytes cross-type operators", () => {
  it("add concatenates two bytes objects", () => {
    const left = pyBytes(new Uint8Array([97]));
    const right = pyBytes(new Uint8Array([98]));
    const result = add(left, right) as ReturnType<typeof pyBytes>;
    expect(result.type).toBe(bytesType);
    expect(Array.from(unwrap<Uint8Array>(result))).toEqual([97, 98]);
  });

  it("mul repeats bytes with int count", () => {
    const one = pyBytes(new Uint8Array([97]));
    const result = mul(one, pyInt(2)) as ReturnType<typeof pyBytes>;
    expect(Array.from(unwrap<Uint8Array>(result))).toEqual([97, 97]);
  });
});
