/**
 * CPython: tuple is hashable; empty tuple uses fixed seed; order matters.
 */
import { describe, it, expect } from "vitest";
import { hash, pyInt, pyNone, pyTuple } from "../../src/index.js";

describe("tuple __hash__", () => {
  it("empty tuple hash is stable across instances", () => {
    const a = pyTuple([]);
    const b = pyTuple([]);
    expect(hash(a)).toBe(hash(b));
    expect(hash(a)).toBe(hash(a));
  });

  it("empty tuple hash matches None sentinel seed", () => {
    expect(hash(pyTuple([]))).toBe(hash(pyNone));
  });

  it("returns a stable hash for the same object", () => {
    const t = pyTuple([pyInt(1), pyInt(2)]);
    expect(hash(t)).toBe(hash(t));
  });

  it("matches for equal tuples built separately", () => {
    const a = pyTuple([pyInt(1), pyInt(2)]);
    const b = pyTuple([pyInt(1), pyInt(2)]);
    expect(hash(a)).toBe(hash(b));
  });

  it("differs for different tuples", () => {
    expect(hash(pyTuple([pyInt(1)]))).not.toBe(hash(pyTuple([pyInt(2)])));
  });

  it("is order-dependent", () => {
    const ab = pyTuple([pyInt(1), pyInt(2)]);
    const ba = pyTuple([pyInt(2), pyInt(1)]);
    expect(hash(ab)).not.toBe(hash(ba));
  });
});
