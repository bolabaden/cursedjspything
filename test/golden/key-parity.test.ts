import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  assertGoldenKeyParity,
  diffGoldenKeySets,
  goldenKeysFromRecord,
  GOLDEN_PROFILE_VERSIONS,
} from "../../scripts/golden/keys.js";
import { buildPyrtCases } from "../../scripts/golden/run.js";

const keySetsPath = join(
  process.cwd(),
  "scripts/golden/expected/key-sets.json",
);

describe("golden key parity", () => {
  const snapshot = JSON.parse(readFileSync(keySetsPath, "utf8")) as {
    profiles: Record<string, string[]>;
  };

  it.each(GOLDEN_PROFILE_VERSIONS)(
    "buildPyrtCases keys match snapshot for %s",
    (version) => {
      const actual = goldenKeysFromRecord(buildPyrtCases(version));
      expect(actual).toEqual(snapshot.profiles[version]);
    },
  );

  it("reports missing and extra keys", () => {
    const diff = diffGoldenKeySets(["a", "b"], ["b", "c"]);
    expect(diff.missingOnPyrt).toEqual(["a"]);
    expect(diff.extraOnPyrt).toEqual(["c"]);
  });

  it("throws on mismatch", () => {
    expect(() =>
      assertGoldenKeyParity(
        "test",
        { python: "3.14", only_ref: true },
        { python: "3.14", only_pyrt: true },
      ),
    ).toThrow(/missing on pyrt: only_ref/);
  });
});
