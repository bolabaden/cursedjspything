/**
 * CPython: empty str is falsy; any non-empty str is truthy.
 */
import { describe, it, expect } from "vitest";
import { boolProtocol, pyStr } from "../../src/index.js";

describe("str __bool__", () => {
  it("empty str is falsy", () => {
    expect(boolProtocol(pyStr(""))).toBe(false);
  });

  it("non-empty str is truthy", () => {
    expect(boolProtocol(pyStr("ab"))).toBe(true);
  });

  it("str containing only space is truthy", () => {
    expect(boolProtocol(pyStr(" "))).toBe(true);
  });
});
