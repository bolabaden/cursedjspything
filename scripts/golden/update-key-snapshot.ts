#!/usr/bin/env tsx
/**
 * Regenerate committed golden key snapshots for no-Python Vitest checks.
 */
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { GOLDEN_PROFILE_VERSIONS, goldenKeysForVersion } from "./keys.js";

const root = join(dirname(fileURLToPath(import.meta.url)), "../..");
const snapshotPath = join(root, "scripts/golden/expected/key-sets.json");

const snapshot: Record<string, string[]> = {};
for (const version of GOLDEN_PROFILE_VERSIONS) {
  snapshot[version] = goldenKeysForVersion(version);
}

writeFileSync(snapshotPath, JSON.stringify(snapshot, null, 2) + "\n");
console.log(`Wrote ${snapshotPath}`);
