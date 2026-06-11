import { PyObject, NotImplemented } from "../core/object.js";
import { Slot, Hook } from "../core/slots.js";
import { makeClass } from "../class/class.js";
import { nativeVal, setNative } from "./native.js";
import { PyZeroDivisionError, PyTypeError } from "../core/errors.js";
import { pyFloat } from "./float.js";

function isScalarNumeric(other: PyObject): boolean {
  const name = other.type.name;
  return name === "int" || name === "float" || name === "bool";
}

function scalarReal(other: PyObject): number {
  if (other.type.name === "bool") {
    return nativeVal<boolean>(other) ? 1 : 0;
  }
  return nativeVal<number>(other);
}

function addComponents(
  a: ComplexNative,
  b: ComplexNative,
): ComplexNative {
  return { real: a.real + b.real, imag: a.imag + b.imag };
}

function subComponents(
  a: ComplexNative,
  b: ComplexNative,
): ComplexNative {
  return { real: a.real - b.real, imag: a.imag - b.imag };
}

function mulComponents(
  a: ComplexNative,
  b: ComplexNative,
): ComplexNative {
  return {
    real: a.real * b.real - a.imag * b.imag,
    imag: a.real * b.imag + a.imag * b.real,
  };
}

function mulByScalar(c: ComplexNative, s: number): ComplexNative {
  return { real: c.real * s, imag: c.imag * s };
}

function divByScalar(c: ComplexNative, s: number): ComplexNative {
  if (s === 0) {
    throw new PyZeroDivisionError("division by zero");
  }
  return { real: c.real / s, imag: c.imag / s };
}

function divComponents(a: ComplexNative, b: ComplexNative): ComplexNative {
  const denom = b.real * b.real + b.imag * b.imag;
  if (denom === 0) {
    throw new PyZeroDivisionError("division by zero");
  }
  return {
    real: (a.real * b.real + a.imag * b.imag) / denom,
    imag: (a.imag * b.real - a.real * b.imag) / denom,
  };
}

function divScalarByComplex(s: number, c: ComplexNative): ComplexNative {
  const denom = c.real * c.real + c.imag * c.imag;
  if (denom === 0) {
    throw new PyZeroDivisionError("division by zero");
  }
  return {
    real: (s * c.real) / denom,
    imag: (-s * c.imag) / denom,
  };
}

function eqComponents(a: ComplexNative, b: ComplexNative): boolean {
  return a.real === b.real && a.imag === b.imag;
}

function eqScalar(c: ComplexNative, other: PyObject): boolean {
  return c.imag === 0 && c.real === scalarReal(other);
}

function powComplexPositiveInt(c: ComplexNative, exp: number): ComplexNative {
  let result: ComplexNative = { real: 1, imag: 0 };
  let base = c;
  let e = exp;
  while (e > 0) {
    if (e & 1) {
      result = mulComponents(result, base);
    }
    base = mulComponents(base, base);
    e >>= 1;
  }
  return result;
}

function powComplexInt(c: ComplexNative, exp: number): ComplexNative {
  if (exp === 0) {
    return { real: 1, imag: 0 };
  }
  if (exp < 0) {
    if (c.real === 0 && c.imag === 0) {
      throw new PyZeroDivisionError("0.0 cannot be raised to a negative power");
    }
    const pos = powComplexPositiveInt(c, -exp);
    return divComponents({ real: 1, imag: 0 }, pos);
  }
  return powComplexPositiveInt(c, exp);
}

function powComplexFloat(c: ComplexNative, exp: number): ComplexNative {
  if (exp === 0) {
    return { real: 1, imag: 0 };
  }
  const r = Math.hypot(c.real, c.imag);
  if (r === 0 && exp < 0) {
    throw new PyZeroDivisionError("0.0 cannot be raised to a negative power");
  }
  const theta = Math.atan2(c.imag, c.real);
  const rn = Math.pow(r, exp);
  const angle = theta * exp;
  return { real: rn * Math.cos(angle), imag: rn * Math.sin(angle) };
}

function logComplex(c: ComplexNative): ComplexNative {
  const r = Math.hypot(c.real, c.imag);
  return { real: Math.log(r), imag: Math.atan2(c.imag, c.real) };
}

function expComplex(c: ComplexNative): ComplexNative {
  const scale = Math.exp(c.real);
  return { real: scale * Math.cos(c.imag), imag: scale * Math.sin(c.imag) };
}

function powComplexComplex(
  base: ComplexNative,
  exp: ComplexNative,
): ComplexNative {
  if (base.real === 0 && base.imag === 0) {
    if (exp.real === 0 && exp.imag === 0) {
      return { real: 1, imag: 0 };
    }
    if (exp.real > 0) {
      return { real: 0, imag: 0 };
    }
    throw new PyZeroDivisionError("0.0 cannot be raised to a negative power");
  }
  return expComplex(mulComponents(logComplex(base), exp));
}

function powRealComplex(base: number, exp: ComplexNative): ComplexNative {
  if (base === 0) {
    if (exp.real === 0 && exp.imag === 0) {
      return { real: 1, imag: 0 };
    }
    if (exp.imag !== 0 || exp.real < 0) {
      throw new PyZeroDivisionError("zero to a negative or complex power");
    }
    return { real: 0, imag: 0 };
  }
  const logBase: ComplexNative = base > 0
    ? { real: Math.log(base), imag: 0 }
    : { real: Math.log(-base), imag: Math.PI };
  return expComplex(mulComponents(logBase, exp));
}

const COMPLEX_FLOOR_ERROR = "can't take floor of complex number.";

function formatComplexSpec(self: PyObject, spec: string): string {
  if (spec === "") {
    const { real, imag } = complexNative(self);
    return complexReprValue(real, imag);
  }
  throw new PyTypeError("unsupported format string passed to complex.__format__");
}

export interface ComplexNative {
  real: number;
  imag: number;
}

export function complexNative(obj: PyObject): ComplexNative {
  return nativeVal<ComplexNative>(obj);
}

export function complexReprValue(real: number, imag: number): string {
  if (real === 0 && imag === 0) {
    return "0j";
  }
  if (real === 0 && imag !== 0) {
    if (imag === 1) return "1j";
    if (imag === -1) return "-1j";
    return `${imag}j`;
  }
  const imagPart =
    imag === 0
      ? "+0j"
      : imag === 1
        ? "+1j"
        : imag === -1
          ? "-1j"
          : imag > 0
            ? `+${imag}j`
            : `${imag}j`;
  return `(${real}${imagPart})`;
}

export const complexType = makeClass({
  name: "complex",
  dict: new Map<string | symbol, unknown>([
    [Slot.repr, (self: PyObject) => {
      const { real, imag } = complexNative(self);
      return complexReprValue(real, imag);
    }],
    [Slot.str, (self: PyObject) => {
      const { real, imag } = complexNative(self);
      return complexReprValue(real, imag);
    }],
    [Slot.bool, (self: PyObject) => {
      const { real, imag } = complexNative(self);
      return real !== 0 || imag !== 0;
    }],
    [Hook.complex, (self: PyObject) => self],
    [Slot.eq, (self: PyObject, other: PyObject) => {
      const left = complexNative(self);
      if (other.type === complexType) {
        return eqComponents(left, complexNative(other));
      }
      if (isScalarNumeric(other)) {
        return eqScalar(left, other);
      }
      return NotImplemented;
    }],
    [Slot.ne, (self: PyObject, other: PyObject) => {
      const left = complexNative(self);
      if (other.type === complexType) {
        return !eqComponents(left, complexNative(other));
      }
      if (isScalarNumeric(other)) {
        return !eqScalar(left, other);
      }
      return NotImplemented;
    }],
    [Slot.pow, (self: PyObject, other: PyObject) => {
      const base = complexNative(self);
      if (other.type === complexType) {
        const out = powComplexComplex(base, complexNative(other));
        return pyComplex(out.real, out.imag);
      }
      if (!isScalarNumeric(other)) {
        return NotImplemented;
      }
      const exp = scalarReal(other);
      const out = Number.isInteger(exp)
        ? powComplexInt(base, exp)
        : powComplexFloat(base, exp);
      return pyComplex(out.real, out.imag);
    }],
    [Slot.rpow, (self: PyObject, other: PyObject) => {
      if (!isScalarNumeric(other)) {
        return NotImplemented;
      }
      const out = powRealComplex(scalarReal(other), complexNative(self));
      return pyComplex(out.real, out.imag);
    }],
    [Slot.floordiv, () => {
      throw new PyTypeError(COMPLEX_FLOOR_ERROR);
    }],
    [Slot.mod, () => {
      throw new PyTypeError(COMPLEX_FLOOR_ERROR);
    }],
    [Slot.add, (self: PyObject, other: PyObject) => {
      const left = complexNative(self);
      if (other.type === complexType) {
        const out = addComponents(left, complexNative(other));
        return pyComplex(out.real, out.imag);
      }
      if (isScalarNumeric(other)) {
        const s = scalarReal(other);
        return pyComplex(left.real + s, left.imag);
      }
      return NotImplemented;
    }],
    [Slot.radd, (self: PyObject, other: PyObject) => {
      const right = complexNative(self);
      if (isScalarNumeric(other)) {
        const s = scalarReal(other);
        return pyComplex(s + right.real, right.imag);
      }
      return NotImplemented;
    }],
    [Slot.sub, (self: PyObject, other: PyObject) => {
      const left = complexNative(self);
      if (other.type === complexType) {
        const out = subComponents(left, complexNative(other));
        return pyComplex(out.real, out.imag);
      }
      if (isScalarNumeric(other)) {
        const s = scalarReal(other);
        return pyComplex(left.real - s, left.imag);
      }
      return NotImplemented;
    }],
    [Slot.rsub, (self: PyObject, other: PyObject) => {
      const right = complexNative(self);
      if (isScalarNumeric(other)) {
        const s = scalarReal(other);
        return pyComplex(s - right.real, -right.imag);
      }
      return NotImplemented;
    }],
    [Slot.mul, (self: PyObject, other: PyObject) => {
      const left = complexNative(self);
      if (other.type === complexType) {
        const out = mulComponents(left, complexNative(other));
        return pyComplex(out.real, out.imag);
      }
      if (isScalarNumeric(other)) {
        const out = mulByScalar(left, scalarReal(other));
        return pyComplex(out.real, out.imag);
      }
      return NotImplemented;
    }],
    [Slot.rmul, (self: PyObject, other: PyObject) => {
      const right = complexNative(self);
      if (isScalarNumeric(other)) {
        const out = mulByScalar(right, scalarReal(other));
        return pyComplex(out.real, out.imag);
      }
      return NotImplemented;
    }],
    [Slot.truediv, (self: PyObject, other: PyObject) => {
      const left = complexNative(self);
      if (other.type === complexType) {
        const out = divComponents(left, complexNative(other));
        return pyComplex(out.real, out.imag);
      }
      if (isScalarNumeric(other)) {
        const out = divByScalar(left, scalarReal(other));
        return pyComplex(out.real, out.imag);
      }
      return NotImplemented;
    }],
    [Slot.rtruediv, (self: PyObject, other: PyObject) => {
      const right = complexNative(self);
      if (isScalarNumeric(other)) {
        const out = divScalarByComplex(scalarReal(other), right);
        return pyComplex(out.real, out.imag);
      }
      return NotImplemented;
    }],
    [Slot.neg, (self: PyObject) => {
      const { real, imag } = complexNative(self);
      return pyComplex(-real, -imag);
    }],
    [Slot.pos, (self: PyObject) => {
      const { real, imag } = complexNative(self);
      return pyComplex(real, imag);
    }],
    [Slot.abs, (self: PyObject) => {
      const { real, imag } = complexNative(self);
      return pyFloat(Math.hypot(real, imag));
    }],
    [Hook.format, (self: PyObject, spec: string) => formatComplexSpec(self, spec)],
  ]),
});

export function pyComplex(real: number, imag: number): PyObject {
  const obj = new PyObject(complexType);
  setNative(obj, { real, imag });
  return obj;
}
