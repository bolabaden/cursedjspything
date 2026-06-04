/**
 * CPython: dict.keys / values / items views (plan 606).
 */
import { describe, it, expect } from "vitest";
import {
  contains,
  eq,
  getAttr,
  instantiate,
  iter,
  len,
  makeClass,
  next,
  NotImplemented,
  objectType,
  PyObject,
  pyDict,
  pyInt,
  pyStr,
  pyTuple,
  unwrap,
} from "../../src/index.js";
import { Slot } from "../../src/runtime/core/slots.js";
import { PyStopIteration } from "../../src/runtime/core/lookup.js";

function equalKeyPair(): [PyObject, PyObject] {
  const Key = makeClass({
    name: "Key",
    bases: [objectType],
    dict: new Map<string | symbol, unknown>([
      [Slot.hash, () => 77],
      [
        Slot.eq,
        (_self: PyObject, other: PyObject) => {
          if (other.type.name === "Key") return true;
          return NotImplemented;
        },
      ],
    ]),
  });
  return [instantiate(Key), instantiate(Key)];
}

function collectIter(view: PyObject): PyObject[] {
  const out: PyObject[] = [];
  const it = iter(view);
  while (true) {
    try {
      out.push(next(it) as PyObject);
    } catch (e) {
      if (e instanceof PyStopIteration) break;
      throw e;
    }
  }
  return out;
}

describe("dict keys values items views", () => {
  it("keys view len and iteration order", () => {
    const a = pyStr("a");
    const b = pyStr("b");
    const d = pyDict([
      [a, pyInt(1)],
      [b, pyInt(2)],
    ]);
    const keys = getAttr(d, "keys") as (self: PyObject) => PyObject;
    const kv = keys(d);
    expect(len(kv)).toBe(2);
    const seen = collectIter(kv);
    expect(seen[0]).toBe(a);
    expect(seen[1]).toBe(b);
  });

  it("keys view reflects live dict size", () => {
    const d = pyDict([]);
    const keys = getAttr(d, "keys") as (self: PyObject) => PyObject;
    const kv = keys(d);
    expect(len(kv)).toBe(0);
    const setdefault = getAttr(d, "setdefault") as (
      self: PyObject,
      key: unknown,
      defaultArg?: unknown,
    ) => unknown;
    setdefault(d, pyStr("x"), pyInt(1));
    expect(len(kv)).toBe(1);
  });

  it("keys view contains uses hash+eq", () => {
    const [k1, k2] = equalKeyPair();
    const d = pyDict([[k1, pyInt(1)]]);
    const kv = (getAttr(d, "keys") as (self: PyObject) => PyObject)(d);
    expect(contains(kv, k2)).toBe(true);
  });

  it("values view iterates values", () => {
    const d = pyDict([
      [pyStr("a"), pyInt(10)],
      [pyStr("b"), pyInt(20)],
    ]);
    const values = getAttr(d, "values") as (self: PyObject) => PyObject;
    const vv = values(d);
    expect(len(vv)).toBe(2);
    const nums = collectIter(vv).map((o) => unwrap(o) as number);
    expect(nums).toEqual([10, 20]);
    expect(contains(vv, pyInt(10))).toBe(true);
  });

  it("items view yields key-value tuples", () => {
    const a = pyStr("a");
    const d = pyDict([[a, pyInt(5)]]);
    const items = getAttr(d, "items") as (self: PyObject) => PyObject;
    const iv = items(d);
    const pairs = collectIter(iv);
    expect(eq(pairs[0], pyTuple([a, pyInt(5)]))).toBe(true);
    expect(contains(iv, pyTuple([a, pyInt(5)]))).toBe(true);
  });
});
