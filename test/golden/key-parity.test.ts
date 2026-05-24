import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  GOLDEN_PROFILE_VERSIONS,
  diffGoldenKeySets,
  goldenKeysForVersion,
  goldenKeysFromRecord,
} from "../../scripts/golden/keys.js";
import { buildPyrtCases } from "../../scripts/golden/pyrt-cases.js";

const snapshotPath = join(
  import.meta.dirname,
  "../../scripts/golden/expected/key-sets.json",
);
const snapshot = JSON.parse(readFileSync(snapshotPath, "utf8")) as Record<
  string,
  string[]
>;

describe("golden key parity (offline)", () => {
  for (const version of GOLDEN_PROFILE_VERSIONS) {
    it(`goldenKeysForVersion(${version}) matches key-sets.json`, () => {
      const keys = goldenKeysForVersion(version);
      expect(keys).toEqual(snapshot[version]);
      expect(keys).not.toContain("python");
    });
  }

  it("goldenKeysFromRecord excludes python metadata", () => {
    const keys = goldenKeysFromRecord({
      python: "3.14",
      mro_D: [],
      slice_list: [1, 2],
    });
    expect(keys).toEqual(["mro_D", "slice_list"]);
  });

  it("buildPyrtCases keys stay symmetric across profiles today", () => {
    expect(goldenKeysForVersion("3.9")).toEqual(goldenKeysForVersion("3.14"));
  });

  it("diffGoldenKeySets reports missing and extra keys", () => {
    const diff = diffGoldenKeySets(["a", "b"], ["b", "c"]);
    expect(diff.missingFromPyrt).toEqual(["a"]);
    expect(diff.extraOnPyrt).toEqual(["c"]);
  });

  it("3.14 profile includes rich_lt_both_not_impl_raises", () => {
    expect(goldenKeysForVersion("3.14")).toContain("rich_lt_both_not_impl_raises");
    expect(buildPyrtCases("3.14").rich_lt_both_not_impl_raises).toBe(true);
  });
});
