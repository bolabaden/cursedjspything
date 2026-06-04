import { expect, it } from "vitest";
import { ge, gt, le, lt, type PyObject } from "../../../src/index.js";
import { PyTypeError } from "../../../src/runtime/core/errors.js";

type CompareOp = (a: PyObject, b: PyObject) => unknown;

const ORDERING_OPS: readonly [string, CompareOp][] = [
  ["lt", lt],
  ["le", le],
  ["gt", gt],
  ["ge", ge],
];

/** Register Vitest cases: cross-type ordering raises TypeError in both operand orders. */
export function registerCrossTypeOrderingRejects(
  leftType: string,
  rightType: string,
  left: () => PyObject,
  right: () => PyObject,
): void {
  for (const [name, op] of ORDERING_OPS) {
    it(`${name} raises TypeError for ${leftType} and ${rightType}`, () => {
      expect(() => op(left(), right())).toThrow(PyTypeError);
      expect(() => op(left(), right())).toThrow(
        new RegExp(`'${name}' not supported between instances of '${leftType}' and '${rightType}'`),
      );
      expect(() => op(right(), left())).toThrow(PyTypeError);
      expect(() => op(right(), left())).toThrow(
        new RegExp(`'${name}' not supported between instances of '${rightType}' and '${leftType}'`),
      );
    });
  }
}
