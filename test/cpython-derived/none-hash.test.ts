/**
 * CPython: None is hashable with a fixed sentinel hash in pyrt.
 */
import { describe, it, expect } from "vitest";
import { hash, pyNone } from "../../src/index.js";

/** pyrt NoneType and empty tuple hashing share this seed (see none.ts, tuple.ts). */
const NONE_HASH = 0x345678;

describe("NoneType __hash__", () => {
  it("None hashes to the fixed sentinel", () => {
    expect(hash(pyNone)).toBe(NONE_HASH);
  });

  it("returns a stable hash on repeated calls", () => {
    expect(hash(pyNone)).toBe(hash(pyNone));
  });

  it("singleton pyNone always yields the same hash", () => {
    const again = pyNone;
    expect(hash(again)).toBe(NONE_HASH);
  });
});
