/**
 * CPython: bytes.partition / bytes.rpartition split once into three parts.
 */
import { describe, it, expect } from "vitest";
import {
  PyObject,
  getAttr,
  pyBytes,
  pyStr,
  unwrap,
} from "../../src/index.js";
import { PyTypeError, PyValueError } from "../../src/runtime/core/errors.js";

type PartitionFn = (self: PyObject, sep: unknown) => unknown;

describe("cpython-derived bytes partition", () => {
  function partition(data: Uint8Array, sep: unknown): unknown {
    const self = pyBytes(data);
    const fn = getAttr(self, "partition") as PartitionFn;
    return fn(self, sep);
  }

  function rpartition(data: Uint8Array, sep: unknown): unknown {
    const self = pyBytes(data);
    const fn = getAttr(self, "rpartition") as PartitionFn;
    return fn(self, sep);
  }

  function asTriple(v: unknown): Uint8Array[] {
    const items = unwrap<PyObject[]>(v as PyObject);
    return items.map((item) => unwrap<Uint8Array>(item));
  }

  function bytesList(parts: Uint8Array[]): number[][] {
    return parts.map((part) => Array.from(part));
  }

  const abc = new Uint8Array([97, 44, 98, 44, 99]);
  const comma = pyBytes(new Uint8Array([44]));

  it("partitions on first separator", () => {
    expect(bytesList(asTriple(partition(abc, comma)))).toEqual([
      [97],
      [44],
      [98, 44, 99],
    ]);
  });

  it("rpartitions on last separator", () => {
    expect(bytesList(asTriple(rpartition(abc, comma)))).toEqual([
      [97, 44, 98],
      [44],
      [99],
    ]);
  });

  it("returns self and empty parts when separator missing (partition)", () => {
    expect(bytesList(asTriple(partition(abc, pyBytes(new Uint8Array([124])))))).toEqual([
      Array.from(abc),
      [],
      [],
    ]);
  });

  it("returns empty parts and self when separator missing (rpartition)", () => {
    expect(bytesList(asTriple(rpartition(abc, pyBytes(new Uint8Array([124])))))).toEqual([
      [],
      [],
      Array.from(abc),
    ]);
  });

  it("handles overlapping separator at start (partition)", () => {
    expect(
      bytesList(asTriple(partition(new Uint8Array([97, 97, 97]), pyBytes(new Uint8Array([97, 97]))))),
    ).toEqual([[], [97, 97], [97]]);
  });

  it("handles overlapping separator at end (rpartition)", () => {
    expect(
      bytesList(asTriple(rpartition(new Uint8Array([97, 97, 97]), pyBytes(new Uint8Array([97, 97]))))),
    ).toEqual([[97], [97, 97], []]);
  });

  it("partitions exact match", () => {
    expect(
      bytesList(asTriple(partition(new Uint8Array([120]), pyBytes(new Uint8Array([120]))))),
    ).toEqual([[], [120], []]);
  });

  it("rpartitions exact match", () => {
    expect(
      bytesList(asTriple(rpartition(new Uint8Array([120]), pyBytes(new Uint8Array([120]))))),
    ).toEqual([[], [120], []]);
  });

  it("handles empty bytes (partition and rpartition)", () => {
    const empty = new Uint8Array([]);
    const sep = pyBytes(new Uint8Array([44]));
    expect(bytesList(asTriple(partition(empty, sep)))).toEqual([[], [], []]);
    expect(bytesList(asTriple(rpartition(empty, sep)))).toEqual([[], [], []]);
  });

  it("rejects empty separator", () => {
    expect(() => partition(new Uint8Array([120]), pyBytes(new Uint8Array([])))).toThrow(
      PyValueError,
    );
    expect(() => rpartition(new Uint8Array([120]), pyBytes(new Uint8Array([])))).toThrow(
      /empty separator/,
    );
  });

  it("rejects non-bytes separator", () => {
    expect(() => partition(new Uint8Array([120]), pyStr(","))).toThrow(PyTypeError);
    expect(() => partition(new Uint8Array([120]), pyStr(","))).toThrow(
      /a bytes-like object is required, not 'str'/,
    );
  });
});
