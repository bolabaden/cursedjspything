/**
 * Golden harness key-set parity (structural guard; values compared elsewhere).
 */

export const GOLDEN_PROFILE_VERSIONS = [
  "3.9",
  "3.10",
  "3.11",
  "3.12",
  "3.13",
  "3.14",
] as const;

export function goldenKeysFromRecord(record: Record<string, unknown>): string[] {
  return Object.keys(record)
    .filter((k) => k !== "python")
    .sort();
}

export interface GoldenKeyDiff {
  missingOnPyrt: string[];
  extraOnPyrt: string[];
}

export function diffGoldenKeySets(
  referenceKeys: string[],
  pyrtKeys: string[],
): GoldenKeyDiff {
  const ref = new Set(referenceKeys);
  const pyrt = new Set(pyrtKeys);
  const missingOnPyrt: string[] = [];
  const extraOnPyrt: string[] = [];
  for (const k of referenceKeys) {
    if (!pyrt.has(k)) missingOnPyrt.push(k);
  }
  for (const k of pyrtKeys) {
    if (!ref.has(k)) extraOnPyrt.push(k);
  }
  return { missingOnPyrt, extraOnPyrt };
}

export function formatGoldenKeyParityError(
  label: string,
  diff: GoldenKeyDiff,
): string {
  const parts: string[] = [`Golden key parity failed (${label})`];
  if (diff.missingOnPyrt.length) {
    parts.push(`  missing on pyrt: ${diff.missingOnPyrt.join(", ")}`);
  }
  if (diff.extraOnPyrt.length) {
    parts.push(`  extra on pyrt: ${diff.extraOnPyrt.join(", ")}`);
  }
  return parts.join("\n");
}

export function assertGoldenKeyParity(
  label: string,
  reference: Record<string, unknown>,
  pyrt: Record<string, unknown>,
): void {
  const diff = diffGoldenKeySets(
    goldenKeysFromRecord(reference),
    goldenKeysFromRecord(pyrt),
  );
  if (diff.missingOnPyrt.length || diff.extraOnPyrt.length) {
    throw new Error(formatGoldenKeyParityError(label, diff));
  }
}
