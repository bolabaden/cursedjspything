/**
 * CPython: int↔str divmod and pow reject incompatible types.
 */
import { describe, it, expect } from "vitest";
import { divmod, pow, pyInt, pyStr } from "../../src/index.js";
import { PyTypeError } from "../../src/runtime/core/errors.js";

describe("cpython-derived int/str divmod and pow", () => {
  const i2 = () => pyInt(2);
  const sa = () => pyStr("a");

  it("divmod rejects int and str in both orders", () => {
    expect(() => divmod(i2(), sa())).toThrow(PyTypeError);
    expect(() => divmod(i2(), sa())).toThrow(
      /unsupported operand type\(s\) for divmod\(\): 'int' and 'str'/,
    );
    expect(() => divmod(sa(), i2())).toThrow(PyTypeError);
    expect(() => divmod(sa(), i2())).toThrow(
      /unsupported operand type\(s\) for divmod\(\): 'str' and 'int'/,
    );
  });

  it("pow rejects int and str in both orders", () => {
    expect(() => pow(i2(), sa())).toThrow(PyTypeError);
    expect(() => pow(i2(), sa())).toThrow(
      /unsupported operand type\(s\) for \*\*: 'int' and 'str'/,
    );
    expect(() => pow(sa(), i2())).toThrow(PyTypeError);
    expect(() => pow(sa(), i2())).toThrow(
      /unsupported operand type\(s\) for \*\*: 'str' and 'int'/,
    );
  });
});
