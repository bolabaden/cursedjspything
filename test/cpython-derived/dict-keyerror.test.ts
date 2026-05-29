/**
 * CPython: dict missing-key subscript raises KeyError with repr-shaped key text.
 */
import { describe, it, expect } from "vitest";
import {
  delItem,
  getItem,
  pyDict,
  pyInt,
  pyStr,
} from "../../src/index.js";
import { PyKeyError } from "../../src/runtime/core/errors.js";

describe("cpython-derived dict KeyError messages", () => {
  const d = () => pyDict([[pyStr("present"), pyInt(1)]]);

  it("getitem missing str key uses repr", () => {
    expect(() => getItem(d(), pyStr("missing"))).toThrow(PyKeyError);
    expect(() => getItem(d(), pyStr("missing"))).toThrow(/'missing'/);
  });

  it("getitem missing int key uses repr", () => {
    expect(() => getItem(pyDict([]), pyInt(2))).toThrow(PyKeyError);
    expect(() => getItem(pyDict([]), pyInt(2))).toThrow(/^2$/);
  });

  it("delitem missing str key uses repr", () => {
    expect(() => delItem(d(), pyStr("missing"))).toThrow(PyKeyError);
    expect(() => delItem(d(), pyStr("missing"))).toThrow(/'missing'/);
  });
});
