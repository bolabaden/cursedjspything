import { describe, it, expect } from "vitest";
import {
  pyNone,
  pyBool,
  pyTrue,
  pyFalse,
  pyInt,
  pyFloat,
  pyStr,
  pyList,
  pyTuple,
  pyDict,
  pySet,
  unwrap,
} from "../../src/index.js";

describe("builtin factories from public barrel", () => {
  it("imports and constructs every shipped builtin", () => {
    expect(pyNone.type.name).toBe("NoneType");
    expect(pyBool(true).type.name).toBe("bool");
    expect(pyTrue).toBeDefined();
    expect(pyFalse).toBeDefined();
    expect(pyInt(1).type.name).toBe("int");
    expect(pyFloat(1.5).type.name).toBe("float");
    expect(pyStr("x").type.name).toBe("str");
    expect(pyList([]).type.name).toBe("list");
    expect(pyTuple([]).type.name).toBe("tuple");
    expect(pyDict([]).type.name).toBe("dict");
    expect(pySet([]).type.name).toBe("set");
    expect(unwrap(pyInt(42))).toBe(42);
  });
});
