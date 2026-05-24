import { describe, expect, it } from "vitest";
import { buildPyrtCases } from "../../scripts/golden/pyrt-cases.js";

describe("buildPyrtCases version gates", () => {
  it("3.9 profile keeps pre-3.10/3.12/3.14 gated values empty", () => {
    const cases = buildPyrtCases("3.9");
    expect(cases.match_args).toEqual([]);
    expect(cases.buffer_readonly).toBeNull();
    expect(cases.buffer_len).toBeNull();
    expect(cases.annotate_x).toBeNull();
  });

  it("3.10 profile enables match_args only", () => {
    const cases = buildPyrtCases("3.10");
    expect(cases.match_args).toEqual(["x", "y"]);
    expect(cases.buffer_readonly).toBeNull();
    expect(cases.buffer_len).toBeNull();
    expect(cases.annotate_x).toBeNull();
  });

  it("3.11 profile keeps buffer and annotate gated off", () => {
    const cases = buildPyrtCases("3.11");
    expect(cases.match_args).toEqual(["x", "y"]);
    expect(cases.buffer_readonly).toBeNull();
    expect(cases.buffer_len).toBeNull();
    expect(cases.annotate_x).toBeNull();
  });

  it("3.12 profile enables buffer fields", () => {
    const cases = buildPyrtCases("3.12");
    expect(cases.match_args).toEqual(["x", "y"]);
    expect(cases.buffer_readonly).toBe(true);
    expect(cases.buffer_len).toBe(4);
    expect(cases.annotate_x).toBeNull();
  });

  it("3.13 profile keeps annotate_x gated off", () => {
    const cases = buildPyrtCases("3.13");
    expect(cases.match_args).toEqual(["x", "y"]);
    expect(cases.buffer_readonly).toBe(true);
    expect(cases.buffer_len).toBe(4);
    expect(cases.annotate_x).toBeNull();
  });

  it("3.14 profile enables annotate_x", () => {
    const cases = buildPyrtCases("3.14");
    expect(cases.match_args).toEqual(["x", "y"]);
    expect(cases.buffer_readonly).toBe(true);
    expect(cases.buffer_len).toBe(4);
    expect(cases.annotate_x).toBe("int");
  });

  it("descriptor precedence keys stay stable across profiles", () => {
    const older = buildPyrtCases("3.9");
    const newer = buildPyrtCases("3.14");
    expect(older.descriptor_data_wins).toBe("descriptor-value");
    expect(older.descriptor_nodata_loses).toBe("instance-value");
    expect(newer.descriptor_data_wins).toBe("descriptor-value");
    expect(newer.descriptor_nodata_loses).toBe("instance-value");
  });
});
