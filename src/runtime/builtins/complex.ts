import { PyObject } from "../core/object.js";
import { Slot, Hook } from "../core/slots.js";
import { makeClass } from "../class/class.js";
import { nativeVal, setNative } from "./native.js";

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
  ]),
});

export function pyComplex(real: number, imag: number): PyObject {
  const obj = new PyObject(complexType);
  setNative(obj, { real, imag });
  return obj;
}
