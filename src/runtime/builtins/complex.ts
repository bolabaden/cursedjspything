import { PyObject, NotImplemented } from "../core/object.js";
import { Slot, Hook } from "../core/slots.js";
import { makeClass } from "../class/class.js";
import { nativeVal, setNative } from "./native.js";
import { PyZeroDivisionError } from "../core/errors.js";
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
  ]),
});

export function pyComplex(real: number, imag: number): PyObject {
  const obj = new PyObject(complexType);
  setNative(obj, { real, imag });
  return obj;
}
