import { describe, it, expect } from "vitest";
import { Hook } from "../../src/runtime/core/slots.js";
import {
  makeClass,
  prepareNamespace,
  objectType,
  typeType,
} from "../../src/index.js";

describe("class pipeline", () => {
  it("merges __prepare__ namespace with class body dict", () => {
    const Meta = makeClass({
      name: "Meta",
      bases: [typeType],
      dict: new Map([
        [
          Hook.prepare,
          () => new Map<string | symbol, unknown>([["from_prepare", 1]]),
        ],
      ]),
    });
    const prepared = prepareNamespace(Meta, "X", [objectType]);
    expect(prepared.get("from_prepare")).toBe(1);

    const X = makeClass({
      name: "X",
      bases: [objectType],
      metaclass: Meta,
      dict: new Map([["from_body", 2]]),
    });
    expect(X.typeDict.get("from_prepare")).toBe(1);
    expect(X.typeDict.get("from_body")).toBe(2);
  });
});
