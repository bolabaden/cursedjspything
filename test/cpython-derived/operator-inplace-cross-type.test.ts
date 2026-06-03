/**
 * CPython: in-place ops fall back to binary dispatch and reject incompatible types.
 */
import { describe, it, expect } from "vitest";
import {
  bytes,
  iadd,
  ifloordiv,
  imatmul,
  imod,
  imul,
  ipow,
  isub,
  itruediv,
  pyBytes,
  pyDict,
  pyFloat,
  pyInt,
  pyList,
  pySet,
  pyStr,
  pyTrue,
  pyTuple,
} from "../../src/index.js";
import { PyTypeError } from "../../src/runtime/core/errors.js";

describe("cpython-derived inplace cross-type TypeError", () => {
  it("iadd rejects int and str", () => {
    expect(() => iadd(pyInt(1), pyStr("a"))).toThrow(PyTypeError);
    expect(() => iadd(pyInt(1), pyStr("a"))).toThrow(
      /unsupported operand type\(s\) for \+=: 'int' and 'str'/,
    );
  });

  it("isub rejects int and str", () => {
    expect(() => isub(pyInt(1), pyStr("a"))).toThrow(PyTypeError);
    expect(() => isub(pyInt(1), pyStr("a"))).toThrow(
      /unsupported operand type\(s\) for -=: 'int' and 'str'/,
    );
  });

  it("isub rejects str and int", () => {
    expect(() => isub(pyStr("a"), pyInt(1))).toThrow(PyTypeError);
    expect(() => isub(pyStr("a"), pyInt(1))).toThrow(
      /unsupported operand type\(s\) for -=: 'str' and 'int'/,
    );
  });

  it("iadd rejects str and int", () => {
    expect(() => iadd(pyStr("a"), pyInt(1))).toThrow(PyTypeError);
    expect(() => iadd(pyStr("a"), pyInt(1))).toThrow(
      /unsupported operand type\(s\) for \+=: 'str' and 'int'/,
    );
  });

  it("iadd rejects list and int", () => {
    expect(() => iadd(pyList([pyInt(1)]), pyInt(2))).toThrow(PyTypeError);
    expect(() => iadd(pyList([pyInt(1)]), pyInt(2))).toThrow(
      /unsupported operand type\(s\) for \+=: 'list' and 'int'/,
    );
  });

  it("iadd rejects int and list", () => {
    expect(() => iadd(pyInt(2), pyList([pyInt(1)]))).toThrow(PyTypeError);
    expect(() => iadd(pyInt(2), pyList([pyInt(1)]))).toThrow(
      /unsupported operand type\(s\) for \+=: 'int' and 'list'/,
    );
  });

  it("iadd rejects str and bool", () => {
    expect(() => iadd(pyStr("a"), pyTrue)).toThrow(PyTypeError);
    expect(() => iadd(pyStr("a"), pyTrue)).toThrow(
      /unsupported operand type\(s\) for \+=: 'str' and 'bool'/,
    );
  });

  it("iadd rejects bool and str", () => {
    expect(() => iadd(pyTrue, pyStr("a"))).toThrow(PyTypeError);
    expect(() => iadd(pyTrue, pyStr("a"))).toThrow(
      /unsupported operand type\(s\) for \+=: 'bool' and 'str'/,
    );
  });
});

describe("cpython-derived inplace container cross-type rejects", () => {
  it("iadd rejects dict and list", () => {
    expect(() => iadd(pyDict([]), pyList([pyInt(1)]))).toThrow(PyTypeError);
    expect(() => iadd(pyDict([]), pyList([pyInt(1)]))).toThrow(
      /unsupported operand type\(s\) for \+=: 'dict' and 'list'/,
    );
  });

  it("iadd rejects dict and tuple", () => {
    expect(() => iadd(pyDict([]), pyTuple([pyInt(1)]))).toThrow(PyTypeError);
    expect(() => iadd(pyDict([]), pyTuple([pyInt(1)]))).toThrow(
      /unsupported operand type\(s\) for \+=: 'dict' and 'tuple'/,
    );
  });

  it("iadd rejects list and dict", () => {
    expect(() => iadd(pyList([pyInt(1)]), pyDict([]))).toThrow(PyTypeError);
    expect(() => iadd(pyList([pyInt(1)]), pyDict([]))).toThrow(
      /unsupported operand type\(s\) for \+=: 'list' and 'dict'/,
    );
  });

  it("iadd rejects set and dict", () => {
    expect(() => iadd(pySet([pyInt(1)]), pyDict([]))).toThrow(PyTypeError);
    expect(() => iadd(pySet([pyInt(1)]), pyDict([]))).toThrow(
      /unsupported operand type\(s\) for \+=: 'set' and 'dict'/,
    );
  });

  it("iadd rejects dict and set", () => {
    expect(() => iadd(pyDict([]), pySet([pyInt(1)]))).toThrow(PyTypeError);
    expect(() => iadd(pyDict([]), pySet([pyInt(1)]))).toThrow(
      /unsupported operand type\(s\) for \+=: 'dict' and 'set'/,
    );
  });
});

describe("cpython-derived inplace int/str remaining ops", () => {
  const i = () => pyInt(1);
  const s = () => pyStr("a");

  it("imatmul rejects int and str in both orders", () => {
    expect(() => imatmul(i(), s())).toThrow(PyTypeError);
    expect(() => imatmul(i(), s())).toThrow(
      /unsupported operand type\(s\) for @=: 'int' and 'str'/,
    );
    expect(() => imatmul(s(), i())).toThrow(PyTypeError);
    expect(() => imatmul(s(), i())).toThrow(
      /unsupported operand type\(s\) for @=: 'str' and 'int'/,
    );
  });

  it("itruediv rejects int and str in both orders", () => {
    expect(() => itruediv(i(), s())).toThrow(PyTypeError);
    expect(() => itruediv(i(), s())).toThrow(
      /unsupported operand type\(s\) for \/=: 'int' and 'str'/,
    );
    expect(() => itruediv(s(), i())).toThrow(PyTypeError);
    expect(() => itruediv(s(), i())).toThrow(
      /unsupported operand type\(s\) for \/=: 'str' and 'int'/,
    );
  });

  it("ifloordiv rejects int and str in both orders", () => {
    expect(() => ifloordiv(i(), s())).toThrow(PyTypeError);
    expect(() => ifloordiv(i(), s())).toThrow(
      /unsupported operand type\(s\) for \/\/=: 'int' and 'str'/,
    );
    expect(() => ifloordiv(s(), i())).toThrow(PyTypeError);
    expect(() => ifloordiv(s(), i())).toThrow(
      /unsupported operand type\(s\) for \/\/=: 'str' and 'int'/,
    );
  });

  it("imod rejects int and str in both orders", () => {
    expect(() => imod(i(), s())).toThrow(PyTypeError);
    expect(() => imod(i(), s())).toThrow(
      /unsupported operand type\(s\) for %=: 'int' and 'str'/,
    );
    expect(() => imod(s(), i())).toThrow(PyTypeError);
    expect(() => imod(s(), i())).toThrow(
      /unsupported operand type\(s\) for %=: 'str' and 'int'/,
    );
  });

  it("ipow rejects int and str in both orders", () => {
    expect(() => ipow(i(), s())).toThrow(PyTypeError);
    expect(() => ipow(i(), s())).toThrow(
      /unsupported operand type\(s\) for \*\*=: 'int' and 'str'/,
    );
    expect(() => ipow(s(), i())).toThrow(PyTypeError);
    expect(() => ipow(s(), i())).toThrow(
      /unsupported operand type\(s\) for \*\*=: 'str' and 'int'/,
    );
  });
});

describe("cpython-derived inplace float/str remaining ops", () => {
  const f = () => pyFloat(1.0);
  const s = () => pyStr("a");

  it("isub rejects float and str in both orders", () => {
    expect(() => isub(f(), s())).toThrow(PyTypeError);
    expect(() => isub(f(), s())).toThrow(
      /unsupported operand type\(s\) for -=: 'float' and 'str'/,
    );
    expect(() => isub(s(), f())).toThrow(PyTypeError);
    expect(() => isub(s(), f())).toThrow(
      /unsupported operand type\(s\) for -=: 'str' and 'float'/,
    );
  });

  it("imatmul rejects float and str in both orders", () => {
    expect(() => imatmul(f(), s())).toThrow(PyTypeError);
    expect(() => imatmul(f(), s())).toThrow(
      /unsupported operand type\(s\) for @=: 'float' and 'str'/,
    );
    expect(() => imatmul(s(), f())).toThrow(PyTypeError);
    expect(() => imatmul(s(), f())).toThrow(
      /unsupported operand type\(s\) for @=: 'str' and 'float'/,
    );
  });

  it("itruediv rejects float and str in both orders", () => {
    expect(() => itruediv(f(), s())).toThrow(PyTypeError);
    expect(() => itruediv(f(), s())).toThrow(
      /unsupported operand type\(s\) for \/=: 'float' and 'str'/,
    );
    expect(() => itruediv(s(), f())).toThrow(PyTypeError);
    expect(() => itruediv(s(), f())).toThrow(
      /unsupported operand type\(s\) for \/=: 'str' and 'float'/,
    );
  });

  it("ifloordiv rejects float and str in both orders", () => {
    expect(() => ifloordiv(f(), s())).toThrow(PyTypeError);
    expect(() => ifloordiv(f(), s())).toThrow(
      /unsupported operand type\(s\) for \/\/=: 'float' and 'str'/,
    );
    expect(() => ifloordiv(s(), f())).toThrow(PyTypeError);
    expect(() => ifloordiv(s(), f())).toThrow(
      /unsupported operand type\(s\) for \/\/=: 'str' and 'float'/,
    );
  });

  it("imod rejects float and str in both orders", () => {
    expect(() => imod(f(), s())).toThrow(PyTypeError);
    expect(() => imod(f(), s())).toThrow(
      /unsupported operand type\(s\) for %=: 'float' and 'str'/,
    );
    expect(() => imod(s(), f())).toThrow(PyTypeError);
    expect(() => imod(s(), f())).toThrow(
      /unsupported operand type\(s\) for %=: 'str' and 'float'/,
    );
  });

  it("ipow rejects float and str in both orders", () => {
    expect(() => ipow(f(), s())).toThrow(PyTypeError);
    expect(() => ipow(f(), s())).toThrow(
      /unsupported operand type\(s\) for \*\*=: 'float' and 'str'/,
    );
    expect(() => ipow(s(), f())).toThrow(PyTypeError);
    expect(() => ipow(s(), f())).toThrow(
      /unsupported operand type\(s\) for \*\*=: 'str' and 'float'/,
    );
  });
});

describe("cpython-derived inplace bool/str remaining ops", () => {
  const t = () => pyTrue;
  const s = () => pyStr("a");

  it("isub rejects bool and str in both orders", () => {
    expect(() => isub(t(), s())).toThrow(PyTypeError);
    expect(() => isub(t(), s())).toThrow(
      /unsupported operand type\(s\) for -=: 'bool' and 'str'/,
    );
    expect(() => isub(s(), t())).toThrow(PyTypeError);
    expect(() => isub(s(), t())).toThrow(
      /unsupported operand type\(s\) for -=: 'str' and 'bool'/,
    );
  });

  it("imatmul rejects bool and str in both orders", () => {
    expect(() => imatmul(t(), s())).toThrow(PyTypeError);
    expect(() => imatmul(t(), s())).toThrow(
      /unsupported operand type\(s\) for @=: 'bool' and 'str'/,
    );
    expect(() => imatmul(s(), t())).toThrow(PyTypeError);
    expect(() => imatmul(s(), t())).toThrow(
      /unsupported operand type\(s\) for @=: 'str' and 'bool'/,
    );
  });

  it("itruediv rejects bool and str in both orders", () => {
    expect(() => itruediv(t(), s())).toThrow(PyTypeError);
    expect(() => itruediv(t(), s())).toThrow(
      /unsupported operand type\(s\) for \/=: 'bool' and 'str'/,
    );
    expect(() => itruediv(s(), t())).toThrow(PyTypeError);
    expect(() => itruediv(s(), t())).toThrow(
      /unsupported operand type\(s\) for \/=: 'str' and 'bool'/,
    );
  });

  it("ifloordiv rejects bool and str in both orders", () => {
    expect(() => ifloordiv(t(), s())).toThrow(PyTypeError);
    expect(() => ifloordiv(t(), s())).toThrow(
      /unsupported operand type\(s\) for \/\/=: 'bool' and 'str'/,
    );
    expect(() => ifloordiv(s(), t())).toThrow(PyTypeError);
    expect(() => ifloordiv(s(), t())).toThrow(
      /unsupported operand type\(s\) for \/\/=: 'str' and 'bool'/,
    );
  });

  it("imod rejects bool and str in both orders", () => {
    expect(() => imod(t(), s())).toThrow(PyTypeError);
    expect(() => imod(t(), s())).toThrow(
      /unsupported operand type\(s\) for %=: 'bool' and 'str'/,
    );
    expect(() => imod(s(), t())).toThrow(PyTypeError);
    expect(() => imod(s(), t())).toThrow(
      /unsupported operand type\(s\) for %=: 'str' and 'bool'/,
    );
  });

  it("ipow rejects bool and str in both orders", () => {
    expect(() => ipow(t(), s())).toThrow(PyTypeError);
    expect(() => ipow(t(), s())).toThrow(
      /unsupported operand type\(s\) for \*\*=: 'bool' and 'str'/,
    );
    expect(() => ipow(s(), t())).toThrow(PyTypeError);
    expect(() => ipow(s(), t())).toThrow(
      /unsupported operand type\(s\) for \*\*=: 'str' and 'bool'/,
    );
  });
});

describe("cpython-derived inplace bytes/str remaining ops", () => {
  const b = () => bytes(pyStr("ab")) as ReturnType<typeof pyBytes>;
  const s = () => pyStr("a");

  it("iadd rejects bytes and str in both orders", () => {
    expect(() => iadd(b(), s())).toThrow(PyTypeError);
    expect(() => iadd(b(), s())).toThrow(
      /unsupported operand type\(s\) for \+=: 'bytes' and 'str'/,
    );
    expect(() => iadd(s(), b())).toThrow(PyTypeError);
    expect(() => iadd(s(), b())).toThrow(
      /unsupported operand type\(s\) for \+=: 'str' and 'bytes'/,
    );
  });

  it("isub rejects bytes and str in both orders", () => {
    expect(() => isub(b(), s())).toThrow(PyTypeError);
    expect(() => isub(b(), s())).toThrow(
      /unsupported operand type\(s\) for -=: 'bytes' and 'str'/,
    );
    expect(() => isub(s(), b())).toThrow(PyTypeError);
    expect(() => isub(s(), b())).toThrow(
      /unsupported operand type\(s\) for -=: 'str' and 'bytes'/,
    );
  });

  it("imul rejects bytes and str in both orders", () => {
    expect(() => imul(b(), s())).toThrow(PyTypeError);
    expect(() => imul(b(), s())).toThrow(
      /unsupported operand type\(s\) for \*=: 'bytes' and 'str'/,
    );
    expect(() => imul(s(), b())).toThrow(PyTypeError);
    expect(() => imul(s(), b())).toThrow(
      /unsupported operand type\(s\) for \*=: 'str' and 'bytes'/,
    );
  });

  it("imatmul rejects bytes and str in both orders", () => {
    expect(() => imatmul(b(), s())).toThrow(PyTypeError);
    expect(() => imatmul(b(), s())).toThrow(
      /unsupported operand type\(s\) for @=: 'bytes' and 'str'/,
    );
    expect(() => imatmul(s(), b())).toThrow(PyTypeError);
    expect(() => imatmul(s(), b())).toThrow(
      /unsupported operand type\(s\) for @=: 'str' and 'bytes'/,
    );
  });

  it("itruediv rejects bytes and str in both orders", () => {
    expect(() => itruediv(b(), s())).toThrow(PyTypeError);
    expect(() => itruediv(b(), s())).toThrow(
      /unsupported operand type\(s\) for \/=: 'bytes' and 'str'/,
    );
    expect(() => itruediv(s(), b())).toThrow(PyTypeError);
    expect(() => itruediv(s(), b())).toThrow(
      /unsupported operand type\(s\) for \/=: 'str' and 'bytes'/,
    );
  });

  it("ifloordiv rejects bytes and str in both orders", () => {
    expect(() => ifloordiv(b(), s())).toThrow(PyTypeError);
    expect(() => ifloordiv(b(), s())).toThrow(
      /unsupported operand type\(s\) for \/\/=: 'bytes' and 'str'/,
    );
    expect(() => ifloordiv(s(), b())).toThrow(PyTypeError);
    expect(() => ifloordiv(s(), b())).toThrow(
      /unsupported operand type\(s\) for \/\/=: 'str' and 'bytes'/,
    );
  });

  it("imod rejects bytes and str in both orders", () => {
    expect(() => imod(b(), s())).toThrow(PyTypeError);
    expect(() => imod(b(), s())).toThrow(
      /unsupported operand type\(s\) for %=: 'bytes' and 'str'/,
    );
    expect(() => imod(s(), b())).toThrow(PyTypeError);
    expect(() => imod(s(), b())).toThrow(
      /unsupported operand type\(s\) for %=: 'str' and 'bytes'/,
    );
  });

  it("ipow rejects bytes and str in both orders", () => {
    expect(() => ipow(b(), s())).toThrow(PyTypeError);
    expect(() => ipow(b(), s())).toThrow(
      /unsupported operand type\(s\) for \*\*=: 'bytes' and 'str'/,
    );
    expect(() => ipow(s(), b())).toThrow(PyTypeError);
    expect(() => ipow(s(), b())).toThrow(
      /unsupported operand type\(s\) for \*\*=: 'str' and 'bytes'/,
    );
  });
});

describe("cpython-derived inplace int/bytes remaining ops", () => {
  const b = () => bytes(pyStr("ab")) as ReturnType<typeof pyBytes>;
  const i = () => pyInt(1);

  it("iadd rejects int and bytes in both orders", () => {
    expect(() => iadd(i(), b())).toThrow(PyTypeError);
    expect(() => iadd(i(), b())).toThrow(
      /unsupported operand type\(s\) for \+=: 'int' and 'bytes'/,
    );
    expect(() => iadd(b(), i())).toThrow(PyTypeError);
    expect(() => iadd(b(), i())).toThrow(
      /unsupported operand type\(s\) for \+=: 'bytes' and 'int'/,
    );
  });

  it("isub rejects int and bytes in both orders", () => {
    expect(() => isub(i(), b())).toThrow(PyTypeError);
    expect(() => isub(i(), b())).toThrow(
      /unsupported operand type\(s\) for -=: 'int' and 'bytes'/,
    );
    expect(() => isub(b(), i())).toThrow(PyTypeError);
    expect(() => isub(b(), i())).toThrow(
      /unsupported operand type\(s\) for -=: 'bytes' and 'int'/,
    );
  });

  // imul omitted: bytes*int may succeed via mul fallback (plan 410 int/str pattern).

  it("imatmul rejects int and bytes in both orders", () => {
    expect(() => imatmul(i(), b())).toThrow(PyTypeError);
    expect(() => imatmul(i(), b())).toThrow(
      /unsupported operand type\(s\) for @=: 'int' and 'bytes'/,
    );
    expect(() => imatmul(b(), i())).toThrow(PyTypeError);
    expect(() => imatmul(b(), i())).toThrow(
      /unsupported operand type\(s\) for @=: 'bytes' and 'int'/,
    );
  });

  it("itruediv rejects int and bytes in both orders", () => {
    expect(() => itruediv(i(), b())).toThrow(PyTypeError);
    expect(() => itruediv(i(), b())).toThrow(
      /unsupported operand type\(s\) for \/=: 'int' and 'bytes'/,
    );
    expect(() => itruediv(b(), i())).toThrow(PyTypeError);
    expect(() => itruediv(b(), i())).toThrow(
      /unsupported operand type\(s\) for \/=: 'bytes' and 'int'/,
    );
  });

  it("ifloordiv rejects int and bytes in both orders", () => {
    expect(() => ifloordiv(i(), b())).toThrow(PyTypeError);
    expect(() => ifloordiv(i(), b())).toThrow(
      /unsupported operand type\(s\) for \/\/=: 'int' and 'bytes'/,
    );
    expect(() => ifloordiv(b(), i())).toThrow(PyTypeError);
    expect(() => ifloordiv(b(), i())).toThrow(
      /unsupported operand type\(s\) for \/\/=: 'bytes' and 'int'/,
    );
  });

  it("imod rejects int and bytes in both orders", () => {
    expect(() => imod(i(), b())).toThrow(PyTypeError);
    expect(() => imod(i(), b())).toThrow(
      /unsupported operand type\(s\) for %=: 'int' and 'bytes'/,
    );
    expect(() => imod(b(), i())).toThrow(PyTypeError);
    expect(() => imod(b(), i())).toThrow(
      /unsupported operand type\(s\) for %=: 'bytes' and 'int'/,
    );
  });

  it("ipow rejects int and bytes in both orders", () => {
    expect(() => ipow(i(), b())).toThrow(PyTypeError);
    expect(() => ipow(i(), b())).toThrow(
      /unsupported operand type\(s\) for \*\*=: 'int' and 'bytes'/,
    );
    expect(() => ipow(b(), i())).toThrow(PyTypeError);
    expect(() => ipow(b(), i())).toThrow(
      /unsupported operand type\(s\) for \*\*=: 'bytes' and 'int'/,
    );
  });
});

describe("cpython-derived inplace float/bytes remaining ops", () => {
  const b = () => bytes(pyStr("ab")) as ReturnType<typeof pyBytes>;
  const f = () => pyFloat(1.0);

  it("iadd rejects float and bytes in both orders", () => {
    expect(() => iadd(f(), b())).toThrow(PyTypeError);
    expect(() => iadd(f(), b())).toThrow(
      /unsupported operand type\(s\) for \+=: 'float' and 'bytes'/,
    );
    expect(() => iadd(b(), f())).toThrow(PyTypeError);
    expect(() => iadd(b(), f())).toThrow(
      /unsupported operand type\(s\) for \+=: 'bytes' and 'float'/,
    );
  });

  it("isub rejects float and bytes in both orders", () => {
    expect(() => isub(f(), b())).toThrow(PyTypeError);
    expect(() => isub(f(), b())).toThrow(
      /unsupported operand type\(s\) for -=: 'float' and 'bytes'/,
    );
    expect(() => isub(b(), f())).toThrow(PyTypeError);
    expect(() => isub(b(), f())).toThrow(
      /unsupported operand type\(s\) for -=: 'bytes' and 'float'/,
    );
  });

  it("imul rejects float and bytes in both orders", () => {
    expect(() => imul(f(), b())).toThrow(PyTypeError);
    expect(() => imul(f(), b())).toThrow(
      /unsupported operand type\(s\) for \*=: 'float' and 'bytes'/,
    );
    expect(() => imul(b(), f())).toThrow(PyTypeError);
    expect(() => imul(b(), f())).toThrow(
      /unsupported operand type\(s\) for \*=: 'bytes' and 'float'/,
    );
  });

  it("imatmul rejects float and bytes in both orders", () => {
    expect(() => imatmul(f(), b())).toThrow(PyTypeError);
    expect(() => imatmul(f(), b())).toThrow(
      /unsupported operand type\(s\) for @=: 'float' and 'bytes'/,
    );
    expect(() => imatmul(b(), f())).toThrow(PyTypeError);
    expect(() => imatmul(b(), f())).toThrow(
      /unsupported operand type\(s\) for @=: 'bytes' and 'float'/,
    );
  });

  it("itruediv rejects float and bytes in both orders", () => {
    expect(() => itruediv(f(), b())).toThrow(PyTypeError);
    expect(() => itruediv(f(), b())).toThrow(
      /unsupported operand type\(s\) for \/=: 'float' and 'bytes'/,
    );
    expect(() => itruediv(b(), f())).toThrow(PyTypeError);
    expect(() => itruediv(b(), f())).toThrow(
      /unsupported operand type\(s\) for \/=: 'bytes' and 'float'/,
    );
  });

  it("ifloordiv rejects float and bytes in both orders", () => {
    expect(() => ifloordiv(f(), b())).toThrow(PyTypeError);
    expect(() => ifloordiv(f(), b())).toThrow(
      /unsupported operand type\(s\) for \/\/=: 'float' and 'bytes'/,
    );
    expect(() => ifloordiv(b(), f())).toThrow(PyTypeError);
    expect(() => ifloordiv(b(), f())).toThrow(
      /unsupported operand type\(s\) for \/\/=: 'bytes' and 'float'/,
    );
  });

  it("imod rejects float and bytes in both orders", () => {
    expect(() => imod(f(), b())).toThrow(PyTypeError);
    expect(() => imod(f(), b())).toThrow(
      /unsupported operand type\(s\) for %=: 'float' and 'bytes'/,
    );
    expect(() => imod(b(), f())).toThrow(PyTypeError);
    expect(() => imod(b(), f())).toThrow(
      /unsupported operand type\(s\) for %=: 'bytes' and 'float'/,
    );
  });

  it("ipow rejects float and bytes in both orders", () => {
    expect(() => ipow(f(), b())).toThrow(PyTypeError);
    expect(() => ipow(f(), b())).toThrow(
      /unsupported operand type\(s\) for \*\*=: 'float' and 'bytes'/,
    );
    expect(() => ipow(b(), f())).toThrow(PyTypeError);
    expect(() => ipow(b(), f())).toThrow(
      /unsupported operand type\(s\) for \*\*=: 'bytes' and 'float'/,
    );
  });
});

describe("cpython-derived inplace bool/bytes remaining ops", () => {
  const b = () => bytes(pyStr("ab")) as ReturnType<typeof pyBytes>;
  const t = () => pyTrue;

  it("iadd rejects bool and bytes in both orders", () => {
    expect(() => iadd(t(), b())).toThrow(PyTypeError);
    expect(() => iadd(t(), b())).toThrow(
      /unsupported operand type\(s\) for \+=: 'bool' and 'bytes'/,
    );
    expect(() => iadd(b(), t())).toThrow(PyTypeError);
    expect(() => iadd(b(), t())).toThrow(
      /unsupported operand type\(s\) for \+=: 'bytes' and 'bool'/,
    );
  });

  it("isub rejects bool and bytes in both orders", () => {
    expect(() => isub(t(), b())).toThrow(PyTypeError);
    expect(() => isub(t(), b())).toThrow(
      /unsupported operand type\(s\) for -=: 'bool' and 'bytes'/,
    );
    expect(() => isub(b(), t())).toThrow(PyTypeError);
    expect(() => isub(b(), t())).toThrow(
      /unsupported operand type\(s\) for -=: 'bytes' and 'bool'/,
    );
  });

  // imul omitted: bool/bytes may succeed via mul fallback (plan 420 int/bytes pattern).

  it("imatmul rejects bool and bytes in both orders", () => {
    expect(() => imatmul(t(), b())).toThrow(PyTypeError);
    expect(() => imatmul(t(), b())).toThrow(
      /unsupported operand type\(s\) for @=: 'bool' and 'bytes'/,
    );
    expect(() => imatmul(b(), t())).toThrow(PyTypeError);
    expect(() => imatmul(b(), t())).toThrow(
      /unsupported operand type\(s\) for @=: 'bytes' and 'bool'/,
    );
  });

  it("itruediv rejects bool and bytes in both orders", () => {
    expect(() => itruediv(t(), b())).toThrow(PyTypeError);
    expect(() => itruediv(t(), b())).toThrow(
      /unsupported operand type\(s\) for \/=: 'bool' and 'bytes'/,
    );
    expect(() => itruediv(b(), t())).toThrow(PyTypeError);
    expect(() => itruediv(b(), t())).toThrow(
      /unsupported operand type\(s\) for \/=: 'bytes' and 'bool'/,
    );
  });

  it("ifloordiv rejects bool and bytes in both orders", () => {
    expect(() => ifloordiv(t(), b())).toThrow(PyTypeError);
    expect(() => ifloordiv(t(), b())).toThrow(
      /unsupported operand type\(s\) for \/\/=: 'bool' and 'bytes'/,
    );
    expect(() => ifloordiv(b(), t())).toThrow(PyTypeError);
    expect(() => ifloordiv(b(), t())).toThrow(
      /unsupported operand type\(s\) for \/\/=: 'bytes' and 'bool'/,
    );
  });

  it("imod rejects bool and bytes in both orders", () => {
    expect(() => imod(t(), b())).toThrow(PyTypeError);
    expect(() => imod(t(), b())).toThrow(
      /unsupported operand type\(s\) for %=: 'bool' and 'bytes'/,
    );
    expect(() => imod(b(), t())).toThrow(PyTypeError);
    expect(() => imod(b(), t())).toThrow(
      /unsupported operand type\(s\) for %=: 'bytes' and 'bool'/,
    );
  });

  it("ipow rejects bool and bytes in both orders", () => {
    expect(() => ipow(t(), b())).toThrow(PyTypeError);
    expect(() => ipow(t(), b())).toThrow(
      /unsupported operand type\(s\) for \*\*=: 'bool' and 'bytes'/,
    );
    expect(() => ipow(b(), t())).toThrow(PyTypeError);
    expect(() => ipow(b(), t())).toThrow(
      /unsupported operand type\(s\) for \*\*=: 'bytes' and 'bool'/,
    );
  });
});
