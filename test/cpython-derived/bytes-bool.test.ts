/**
 * CPython: empty bytes is falsy; any non-empty bytes is truthy.
 */
import { describe, it, expect } from "vitest";
import { boolProtocol, pyBytes } from "../../src/index.js";

describe("bytes __bool__", () => {
  it("empty bytes is falsy", () => {
    expect(boolProtocol(pyBytes(new Uint8Array([])))).toBe(false);
  });

  it("non-empty bytes is truthy", () => {
    expect(boolProtocol(pyBytes(new Uint8Array([97])))).toBe(true);
  });

  it("bytes containing only zero byte is truthy", () => {
    expect(boolProtocol(pyBytes(new Uint8Array([0])))).toBe(true);
  });
});
