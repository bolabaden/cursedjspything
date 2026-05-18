import { describe, it, expect } from "vitest";
import {
  makeClass,
  objectType,
  getMatchArgs,
  getAnnotations,
  wrapBuffer,
  getBuffer,
  releaseBuffer,
  PyObject,
} from "../../src/index.js";
import { Hook, Slot } from "../../src/runtime/core/slots.js";

describe("version gates", () => {
  it("stores __match_args__", () => {
    const P = makeClass({
      name: "P",
      bases: [objectType],
      dict: new Map([[Hook.matchArgs, ["a", "b"]]]),
    });
    expect(getMatchArgs(P)).toEqual(["a", "b"]);
  });

  it("runs __annotate__ via getAnnotations", () => {
    const T = makeClass({
      name: "T",
      bases: [objectType],
      dict: new Map([
        [
          Hook.annotate,
          () => ({ x: "int" }),
        ],
      ]),
    });
    const ann = getAnnotations(T);
    expect(ann.get("x")).toBe("int");
  });

  it("buffer export attaches view", () => {
    const data = new ArrayBuffer(4);
    const Exporter = makeClass({
      name: "Exporter",
      bases: [objectType],
      dict: new Map([
        [Slot.buffer, () => wrapBuffer(data, true)],
        [Slot.releaseBuffer, () => {}],
      ]),
    });
    const obj = new PyObject(Exporter);
    const view = getBuffer(obj, 0);
    expect(view).toBeDefined();
    releaseBuffer(obj, view);
  });
});
