/**
 * CPython: str↔bytes cross-type cases (no coercion).
 */
import { describe, it, expect } from "vitest";
import {
  add,
  bytes,
  divmod,
  eq,
  floordiv,
  ge,
  gt,
  le,
  lt,
  mod,
  mul,
  ne,
  pow,
  pyBytes,
  pyStr,
  sub,
  truediv,
} from "../../src/index.js";
import { PyTypeError } from "../../src/runtime/core/errors.js";

describe("cpython-derived str/bytes comparisons", () => {
  const s = () => pyStr("ab");
  const b = () => bytes(pyStr("ab")) as ReturnType<typeof pyBytes>;

  it("eq and ne do not coerce str and bytes", () => {
    expect(eq(s(), b())).toBe(false);
    expect(eq(b(), s())).toBe(false);
    expect(ne(s(), b())).toBe(true);
    expect(ne(b(), s())).toBe(true);
  });
});

describe("cpython-derived str/bytes binary ops", () => {
  const s = () => pyStr("a");
  const b = () => bytes(pyStr("ab")) as ReturnType<typeof pyBytes>;

  it("add rejects str and bytes in both orders", () => {
    expect(() => add(s(), b())).toThrow(PyTypeError);
    expect(() => add(s(), b())).toThrow(
      /unsupported operand type\(s\) for \+: 'str' and 'bytes'/,
    );
    expect(() => add(b(), s())).toThrow(PyTypeError);
    expect(() => add(b(), s())).toThrow(
      /unsupported operand type\(s\) for \+: 'bytes' and 'str'/,
    );
  });

  it("sub rejects str and bytes in both orders", () => {
    expect(() => sub(s(), b())).toThrow(PyTypeError);
    expect(() => sub(s(), b())).toThrow(
      /unsupported operand type\(s\) for -: 'str' and 'bytes'/,
    );
    expect(() => sub(b(), s())).toThrow(PyTypeError);
    expect(() => sub(b(), s())).toThrow(
      /unsupported operand type\(s\) for -: 'bytes' and 'str'/,
    );
  });

  it("mul rejects str and bytes in both orders", () => {
    expect(() => mul(s(), b())).toThrow(PyTypeError);
    expect(() => mul(s(), b())).toThrow(
      /unsupported operand type\(s\) for \*: 'str' and 'bytes'/,
    );
    expect(() => mul(b(), s())).toThrow(PyTypeError);
    expect(() => mul(b(), s())).toThrow(
      /unsupported operand type\(s\) for \*: 'bytes' and 'str'/,
    );
  });

  it("truediv rejects str and bytes", () => {
    expect(() => truediv(s(), b())).toThrow(PyTypeError);
    expect(() => truediv(s(), b())).toThrow(
      /unsupported operand type\(s\) for \/: 'str' and 'bytes'/,
    );
  });

  it("floordiv rejects str and bytes", () => {
    expect(() => floordiv(s(), b())).toThrow(PyTypeError);
    expect(() => floordiv(s(), b())).toThrow(
      /unsupported operand type\(s\) for \/\/: 'str' and 'bytes'/,
    );
  });

  it("mod rejects str and bytes", () => {
    expect(() => mod(s(), b())).toThrow(PyTypeError);
    expect(() => mod(s(), b())).toThrow(
      /unsupported operand type\(s\) for %: 'str' and 'bytes'/,
    );
  });

  it("divmod rejects str and bytes in both orders", () => {
    expect(() => divmod(s(), b())).toThrow(PyTypeError);
    expect(() => divmod(s(), b())).toThrow(
      /unsupported operand type\(s\) for divmod\(\): 'str' and 'bytes'/,
    );
    expect(() => divmod(b(), s())).toThrow(PyTypeError);
    expect(() => divmod(b(), s())).toThrow(
      /unsupported operand type\(s\) for divmod\(\): 'bytes' and 'str'/,
    );
  });

  it("pow rejects str and bytes in both orders", () => {
    expect(() => pow(s(), b())).toThrow(PyTypeError);
    expect(() => pow(s(), b())).toThrow(
      /unsupported operand type\(s\) for \*\*: 'str' and 'bytes'/,
    );
    expect(() => pow(b(), s())).toThrow(PyTypeError);
    expect(() => pow(b(), s())).toThrow(
      /unsupported operand type\(s\) for \*\*: 'bytes' and 'str'/,
    );
  });
});

describe("cpython-derived str/bytes ordering", () => {
  const s = () => pyStr("a");
  const b = () => bytes(pyStr("ab")) as ReturnType<typeof pyBytes>;

  for (const [name, op] of [
    ["lt", lt],
    ["le", le],
    ["gt", gt],
    ["ge", ge],
  ] as const) {
    it(`${name} raises TypeError for str and bytes in both orders`, () => {
      expect(() => op(s(), b())).toThrow(PyTypeError);
      expect(() => op(s(), b())).toThrow(
        new RegExp(`'${name}' not supported between instances of 'str' and 'bytes'`),
      );
      expect(() => op(b(), s())).toThrow(PyTypeError);
      expect(() => op(b(), s())).toThrow(
        new RegExp(`'${name}' not supported between instances of 'bytes' and 'str'`),
      );
    });
  }
});
