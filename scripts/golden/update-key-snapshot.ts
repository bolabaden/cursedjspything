#!/usr/bin/env tsx
/**
 * Regenerate scripts/golden/expected/key-sets.json from buildPyrtCases profiles.
 */
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { GOLDEN_PROFILE_VERSIONS, goldenKeysFromRecord } from "./keys.js";
import { buildPyrtCases } from "./run.js";

const root = join(dirname(fileURLToPath(import.meta.url)), "../..");
const outPath = join(root, "scripts/golden/expected/key-sets.json");

const profiles: Record<string, string[]> = {};
for (const version of GOLDEN_PROFILE_VERSIONS) {
  profiles[version] = goldenKeysFromRecord(buildPyrtCases(version));
}

mkdirSync(dirname(outPath), { recursive: true });
writeFileSync(
  outPath,
  JSON.stringify({ profiles }, null, 2) + "\n",
);
console.log(`Wrote ${outPath}`);
