/**
 * CPython: bytes.title ASCII title case.
 */
import { describe, it, expect } from "vitest";
import { PyObject, getAttr, pyBytes, unwrap } from "../../src/index.js";

type TitleFn = (self: PyObject) => unknown;

describe("cpython-derived bytes title", () => {
  function title(data: Uint8Array): unknown {
    const self = pyBytes(data);
    const fn = getAttr(self, "title") as TitleFn;
    return fn(self);
  }

  function asBytes(v: unknown): Uint8Array {
    return unwrap<Uint8Array>(v as PyObject);
  }

  it("title-cases space- and hyphen-delimited words", () => {
    expect(
      asBytes(title(new Uint8Array([104, 101, 108, 108, 111, 32, 119, 111, 114, 108, 100]))),
    ).toEqual(new Uint8Array([72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100]));
    expect(
      asBytes(title(new Uint8Array([104, 101, 108, 108, 111, 45, 119, 111, 114, 108, 100]))),
    ).toEqual(new Uint8Array([72, 101, 108, 108, 111, 45, 87, 111, 114, 108, 100]));
    expect(
      asBytes(title(new Uint8Array([104, 101, 108, 108, 111, 32, 87, 79, 82, 76, 68]))),
    ).toEqual(new Uint8Array([72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100]));
  });

  it("starts a new word after digits and other non-letters", () => {
    expect(asBytes(title(new Uint8Array([52, 57, 97, 98, 99])))).toEqual(
      new Uint8Array([52, 57, 65, 98, 99]),
    );
    expect(asBytes(title(new Uint8Array([97, 49, 98])))).toEqual(
      new Uint8Array([65, 49, 66]),
    );
  });

  it("handles empty bytes and non-ASCII prefixes", () => {
    expect(asBytes(title(new Uint8Array([])))).toEqual(new Uint8Array([]));
    expect(asBytes(title(new Uint8Array([255, 97, 66])))).toEqual(
      new Uint8Array([255, 65, 98]),
    );
  });
});
