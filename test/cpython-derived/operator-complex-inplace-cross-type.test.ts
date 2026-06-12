/**
 * CPython: complex inplace cross-type TypeError evidence.
 */
import { describe, it, expect } from "vitest";
import {
  iadd,
  ifloordiv,
  imatmul,
  imod,
  ipow,
  isub,
  imul,
  itruediv,
  pyBytes,
  pyComplex,
  pyFloat,
  pyInt,
  pyList,
  pyStr,
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

describe("cpython-derived complex inplace cross-type ops", () => {
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
    it(`inplace +=,-=,*=,/=,**=,@= reject complex and ${otherName}`, () => {
      for (const [sym, fn] of [
        ["+=", iadd],
        ["-=", isub],
        ["*=", imul],
        ["/=", itruediv],
        ["**=", ipow],
        ["@=", imatmul],
      ] as const) {
        expectUnsupported(fn, sym, "complex", otherName, c(), otherFn());
        expectUnsupported(fn, sym, otherName, "complex", otherFn(), c());
      }
    });

    it(`inplace //= and %= reject complex-left with ${otherName}`, () => {
      expect(() => ifloordiv(c(), otherFn())).toThrow(PyTypeError);
      expect(() => ifloordiv(c(), otherFn())).toThrow(FLOOR);
      expect(() => imod(c(), otherFn())).toThrow(PyTypeError);
      expect(() => imod(c(), otherFn())).toThrow(FLOOR);
      expectUnsupported(ifloordiv, "//=", otherName, "complex", otherFn(), c());
      expectUnsupported(imod, "%=", otherName, "complex", otherFn(), c());
    });
  }

  it("scalar //= and %= with complex RHS are unsupported", () => {
    const complexRhs = pyComplex(1, 2);
    for (const left of [pyInt(1), pyFloat(1)]) {
      const typename = left.type.name;
      expect(() => ifloordiv(left, complexRhs)).toThrow(PyTypeError);
      expect(() => ifloordiv(left, complexRhs)).toThrow(
        new RegExp(
          `unsupported operand type\\(s\\) for //=: '${typename}' and 'complex'`,
        ),
      );
      expect(() => imod(left, complexRhs)).toThrow(PyTypeError);
      expect(() => imod(left, complexRhs)).toThrow(
        new RegExp(
          `unsupported operand type\\(s\\) for %=: '${typename}' and 'complex'`,
        ),
      );
    }
  });
});
