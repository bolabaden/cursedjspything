/**
 * Golden harness key-set parity utilities.
 */
import { buildPyrtCases } from "./pyrt-cases.js";

export const GOLDEN_PROFILE_VERSIONS = ["3.9", "3.10", "3.12", "3.14"] as const;

export type GoldenKeyDiff = {
  missingFromPyrt: string[];
  extraOnPyrt: string[];
};

export class KeyParityError extends Error {
  readonly version: string;
  readonly diff: GoldenKeyDiff;

  constructor(version: string, diff: GoldenKeyDiff) {
    const parts: string[] = [`Golden key parity failed for Python ${version}`];
    if (diff.missingFromPyrt.length) {
      parts.push(`  missing from pyrt: ${diff.missingFromPyrt.join(", ")}`);
    }
    if (diff.extraOnPyrt.length) {
      parts.push(`  extra on pyrt: ${diff.extraOnPyrt.join(", ")}`);
    }
    super(parts.join("\n"));
    this.name = "KeyParityError";
    this.version = version;
    this.diff = diff;
  }
}

export function goldenKeysFromRecord(cases: Record<string, unknown>): string[] {
  return Object.keys(cases)
    .filter((key) => key !== "python")
    .sort();
}

export function goldenKeysForVersion(version: string): string[] {
  return goldenKeysFromRecord(buildPyrtCases(version));
}

export function diffGoldenKeySets(
  referenceKeys: string[],
  pyrtKeys: string[],
): GoldenKeyDiff {
  const ref = new Set(referenceKeys);
  const pyrt = new Set(pyrtKeys);
  return {
    missingFromPyrt: [...ref].filter((key) => !pyrt.has(key)).sort(),
    extraOnPyrt: [...pyrt].filter((key) => !ref.has(key)).sort(),
  };
}

export function assertGoldenKeyParity(
  referenceCases: Record<string, unknown>,
  version: string,
): void {
  const refKeys = goldenKeysFromRecord(referenceCases);
  const pyrtKeys = goldenKeysForVersion(version);
  const diff = diffGoldenKeySets(refKeys, pyrtKeys);
  if (diff.missingFromPyrt.length || diff.extraOnPyrt.length) {
    throw new KeyParityError(version, diff);
  }
}
