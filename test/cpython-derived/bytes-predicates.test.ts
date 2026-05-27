/**
 * CPython: bytes ASCII predicate methods.
 */
import { describe, it, expect } from "vitest";
import {
  PyObject,
  getAttr,
  pyBytes,
  pyFalse,
  pyTrue,
  unwrap,
} from "../../src/index.js";

type PredicateFn = (self: PyObject) => unknown;

describe("cpython-derived bytes predicates", () => {
  function call(data: Uint8Array, name: string): boolean {
    const self = pyBytes(data);
    const fn = getAttr(self, name) as PredicateFn;
    const result = fn(self);
    return unwrap<boolean>(result as PyObject);
  }

  const abc = new Uint8Array([97, 98, 99]);
  const ABC = new Uint8Array([65, 66, 67]);
  const digits = new Uint8Array([49, 50, 51]);
  const mixed = new Uint8Array([97, 49]);
  const helloWorld = new Uint8Array([
    72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100,
  ]);
  const ws = new Uint8Array([32, 9, 10, 13]);

  it("classifies alpha, digit, and alnum", () => {
    expect(call(abc, "isalpha")).toBe(true);
    expect(call(abc, "isdigit")).toBe(false);
    expect(call(abc, "isalnum")).toBe(true);
    expect(call(digits, "isdigit")).toBe(true);
    expect(call(digits, "isalpha")).toBe(false);
    expect(call(mixed, "isalpha")).toBe(false);
    expect(call(mixed, "isalnum")).toBe(true);
    expect(call(new Uint8Array([]), "isalpha")).toBe(false);
    expect(call(new Uint8Array([255]), "isalnum")).toBe(false);
  });

  it("classifies lower, upper, and title case", () => {
    expect(call(abc, "islower")).toBe(true);
    expect(call(abc, "isupper")).toBe(false);
    expect(call(ABC, "isupper")).toBe(true);
    expect(call(ABC, "islower")).toBe(false);
    expect(call(mixed, "islower")).toBe(true);
    expect(call(helloWorld, "istitle")).toBe(true);
    expect(call(new Uint8Array([104, 101, 108, 108, 111, 32, 119, 111, 114, 108, 100]), "istitle")).toBe(
      false,
    );
    expect(call(new Uint8Array([]), "islower")).toBe(false);
  });

  it("classifies whitespace", () => {
    expect(call(ws, "isspace")).toBe(true);
    expect(call(abc, "isspace")).toBe(false);
    expect(call(new Uint8Array([]), "isspace")).toBe(false);
  });

  it("returns bool singletons", () => {
    const self = pyBytes(abc);
    const isalpha = getAttr(self, "isalpha") as PredicateFn;
    const isdigit = getAttr(self, "isdigit") as PredicateFn;
    expect(isalpha(self)).toBe(pyTrue);
    expect(isdigit(self)).toBe(pyFalse);
  });
});
