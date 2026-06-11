/**
 * CPython: complex↔str/list/bytes binary op TypeError evidence.
 */
import { describe, it, expect } from "vitest";
import {
  add,
  floordiv,
  mod,
  mul,
  pow,
  pyBytes,
  pyComplex,
  pyList,
  pyStr,
  sub,
  truediv,
} from "../../src/index.js";
import { PyTypeError } from "../../src/runtime/core/errors.js";

const FLOOR = /can't take floor of complex number\./;

function escapeRegex(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function expectUnsupported(
  fn: (a: unknown, b: unknown) => unknown,
  symbol: string,
  leftName: string,
  rightName: string,
  left: unknown,
  right: unknown,
): void {
  expect(() => fn(left, right)).toThrow(PyTypeError);
  expect(() => fn(left, right)).toThrow(
    new RegExp(
      `unsupported operand type\\(s\\) for ${escapeRegex(symbol)}: '${leftName}' and '${rightName}'`,
    ),
  );
}

describe("cpython-derived complex cross-type binary ops", () => {
  const c = () => pyComplex(1, 2);
  const s = () => pyStr("a");
  const lst = () => pyList([pyComplex(1, 2)]);
  const b = () => pyBytes("a");

  const pairs = [
    ["str", s],
    ["list", lst],
    ["bytes", b],
  ] as const;

  for (const [otherName, otherFn] of pairs) {
    it(`add/sub/mul/truediv/pow reject complex and ${otherName}`, () => {
      for (const [sym, fn] of [
        ["+", add],
        ["-", sub],
        ["*", mul],
        ["/", truediv],
        ["**", pow],
      ] as const) {
        expectUnsupported(fn, sym, "complex", otherName, c(), otherFn());
        expectUnsupported(fn, sym, otherName, "complex", otherFn(), c());
      }
    });

    it(`floordiv/mod reject complex and ${otherName}`, () => {
      expect(() => floordiv(c(), otherFn())).toThrow(PyTypeError);
      expect(() => floordiv(c(), otherFn())).toThrow(FLOOR);
      expect(() => mod(c(), otherFn())).toThrow(PyTypeError);
      expect(() => mod(c(), otherFn())).toThrow(FLOOR);
      expectUnsupported(floordiv, "//", otherName, "complex", otherFn(), c());
      expectUnsupported(mod, "%", otherName, "complex", otherFn(), c());
    });
  }
});
