#!/usr/bin/env tsx
/**
 * Compare pyrt behavior to CPython golden expectations (per Python version).
 */
import { spawnSync } from "node:child_process";
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { assertGoldenKeyParity } from "./keys.js";
import { buildPyrtCases } from "./pyrt-cases.js";

const root = join(dirname(fileURLToPath(import.meta.url)), "../..");
const casesPy = join(root, "scripts/golden/cases.py");
const expectedDir = join(root, "scripts/golden/expected");
const legacyExpected = join(root, "scripts/golden/expected.json");

const PYTHON_CANDIDATES = [
  "python3.14",
  "python3.13",
  "python3.12",
  "python3.11",
  "python3.10",
  "python3.9",
  "python3",
  "python",
];

function findAvailablePythons(): string[] {
  const found: string[] = [];
  for (const bin of PYTHON_CANDIDATES) {
    const r = spawnSync(bin, ["--version"], { encoding: "utf8" });
    if (r.status !== 0) continue;
    const m = (r.stdout || r.stderr || "").match(/Python (\d+)\.(\d+)/);
    if (!m) continue;
    const key = `${bin}:${m[1]}.${m[2]}`;
    if (found.some((e) => e.endsWith(`:${m[1]}.${m[2]}`))) continue;
    found.push(key);
  }
  return found;
}

function parsePythonLabel(entry: string): { bin: string; version: string } {
  const [bin, version] = entry.split(":");
  return { bin, version };
}

function expectedPathFor(version: string): string {
  return join(expectedDir, `${version}.json`);
}

function runCasesPy(pythonBin: string): Record<string, unknown> {
  const r = spawnSync(pythonBin, [casesPy], { encoding: "utf8" });
  if (r.status !== 0) {
    console.error(r.stderr || r.stdout);
    throw new Error(`cases.py failed for ${pythonBin}`);
  }
  return JSON.parse(r.stdout) as Record<string, unknown>;
}

function ensureExpected(
  pythonBin: string,
  version: string,
  reference?: Record<string, unknown>,
): Record<string, unknown> {
  mkdirSync(expectedDir, { recursive: true });
  const path = expectedPathFor(version);
  if (!existsSync(path)) {
    const data = reference ?? runCasesPy(pythonBin);
    writeFileSync(path, JSON.stringify(data, null, 2) + "\n");
    console.log(`Wrote ${path} via ${pythonBin}`);
    return data;
  }
  return JSON.parse(readFileSync(path, "utf8")) as Record<string, unknown>;
}

function compareCases(
  label: string,
  expected: Record<string, unknown>,
  actual: Record<string, unknown>,
): string[] {
  const failures: string[] = [];
  for (const key of Object.keys(expected)) {
    if (key === "python") continue;
    const e = JSON.stringify(expected[key]);
    const a = JSON.stringify(actual[key]);
    if (e !== a) failures.push(`${label} ${key}: expected ${e} got ${a}`);
  }
  return failures;
}

function main(): void {
  const pythons = findAvailablePythons();
  if (pythons.length === 0) {
    throw new Error("No Python interpreter found for golden tests");
  }

  const failures: string[] = [];
  let caseCount = 0;

  for (const entry of pythons) {
    const { bin, version } = parsePythonLabel(entry);
    const reference = runCasesPy(bin);
    try {
      assertGoldenKeyParity(reference, version);
    } catch (err) {
      if (err instanceof Error) {
        failures.push(err.message);
      } else {
        failures.push(String(err));
      }
      continue;
    }

    const expected = ensureExpected(bin, version, reference);
    const actual = buildPyrtCases(version);
    const diff = compareCases(`py${version}`, expected, actual);
    failures.push(...diff);
    caseCount += Object.keys(expected).filter((k) => k !== "python").length;
  }

  if (existsSync(legacyExpected)) {
    const primary = parsePythonLabel(pythons[0]);
    const legacy = JSON.parse(readFileSync(legacyExpected, "utf8")) as Record<string, unknown>;
    const actual = buildPyrtCases(primary.version);
    failures.push(...compareCases("legacy", legacy, actual));
  }

  if (failures.length) {
    console.error("Golden failures:\n" + failures.join("\n"));
    process.exit(1);
  }
  console.log(
    `Golden OK (${pythons.length} Python(s), ~${caseCount} checks per version)`,
  );
}

main();
