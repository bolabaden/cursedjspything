#!/usr/bin/env tsx
/**
 * Compare pyrt behavior to CPython golden expectations (per Python version).
 */
import { spawnSync } from "node:child_process";
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { Hook } from "../../src/runtime/core/slots.js";
import {
  makeClass,
  instantiate,
  objectType,
  isinstance,
  issubclass,
  eq,
  lt,
  pyInt,
  getMatchArgs,
  getAnnotations,
  pyList,
  getItem,
  pySlice,
  unwrap,
  wrapBuffer,
  getBuffer,
  releaseBuffer,
  PyObject,
} from "../../src/index.js";
import { Slot } from "../../src/runtime/core/slots.js";

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

function ensureExpected(pythonBin: string, version: string): Record<string, unknown> {
  mkdirSync(expectedDir, { recursive: true });
  const path = expectedPathFor(version);
  if (!existsSync(path)) {
    const data = runCasesPy(pythonBin);
    writeFileSync(path, JSON.stringify(data, null, 2) + "\n");
    console.log(`Wrote ${path} via ${pythonBin}`);
    return data;
  }
  return JSON.parse(readFileSync(path, "utf8")) as Record<string, unknown>;
}

function parseVersion(version: string): [number, number] {
  const [a, b] = version.split(".").map(Number);
  return [a, b];
}

function buildPyrtCases(pythonVersion: string): Record<string, unknown> {
  const [major, minor] = parseVersion(pythonVersion);

  const A = makeClass({ name: "A", bases: [objectType], dict: {} });
  const B = makeClass({ name: "B", bases: [A], dict: {} });
  const C = makeClass({ name: "C", bases: [A], dict: {} });
  const D = makeClass({ name: "D", bases: [B, C], dict: {} });

  const Point = makeClass({
    name: "Point",
    bases: [objectType],
    dict: new Map([[Hook.matchArgs, ["x", "y"]]]),
  });

  const Annotated = makeClass({
    name: "Annotated",
    bases: [objectType],
    dict: new Map([
      [Hook.annotate, () => ({ x: "int" })],
    ]),
  });

  // golden:rich_lt_reflected — keep Rev/__gt__ in sync with scripts/golden/cases.py
  const Rev = makeClass({
    name: "Rev",
    bases: [objectType],
    dict: new Map([
      [Slot.gt, () => true],
    ]),
  });

  const dInst = instantiate(D);
  const revInst = instantiate(Rev);
  const list = pyList([pyInt(0), pyInt(1), pyInt(2)]);
  const sliced = getItem(list, pySlice(1, 3, null)) as PyObject;
  const slicedItems = unwrap<PyObject[]>(sliced);

  const cases: Record<string, unknown> = {
    python: pythonVersion,
    mro_D: D.mro.map((t) => t.name),
    isinstance_D: isinstance(dInst, A),
    issubclass_DC: issubclass(D, C),
    rich_eq_int: eq(pyInt(1), pyInt(1)) === true,
    rich_lt_reflected: lt(pyInt(1), revInst) === true,
    slice_list: slicedItems.map((v) => unwrap<number>(v)),
  };

  if (major > 3 || (major === 3 && minor >= 10)) {
    cases.match_args = getMatchArgs(Point) ?? [];
  } else {
    cases.match_args = [];
  }

  if (major > 3 || (major === 3 && minor >= 12)) {
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
    const view = getBuffer(obj, 0) as { readonly: boolean; byteLength: number };
    cases.buffer_readonly = view.readonly;
    cases.buffer_len = view.byteLength;
  } else {
    cases.buffer_readonly = null;
    cases.buffer_len = null;
  }

  if (major > 3 || (major === 3 && minor >= 14)) {
    cases.annotate_x = getAnnotations(Annotated).get("x");
  } else {
    cases.annotate_x = null;
  }

  return cases;
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
    const expected = ensureExpected(bin, version);
    const actual = buildPyrtCases(version);
    const diff = compareCases(`py${version}`, expected, actual);
    failures.push(...diff);
    caseCount += Object.keys(expected).filter((k) => k !== "python").length;
  }

  // Legacy single-file expected.json: validate primary interpreter if present
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
