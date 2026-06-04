/** Typed errors for the CPython golden harness (not user-facing Py* exceptions). */

export type GoldenHarnessFailureKind = "cases-py-failed" | "no-python";

export class GoldenHarnessError extends Error {
  readonly kind: GoldenHarnessFailureKind;
  readonly pythonBin?: string;

  constructor(kind: GoldenHarnessFailureKind, message: string, pythonBin?: string) {
    super(message);
    this.name = "GoldenHarnessError";
    this.kind = kind;
    this.pythonBin = pythonBin;
  }

  static casesPyFailed(pythonBin: string, detail?: string): GoldenHarnessError {
    const suffix = detail?.trim() ? `: ${detail.trim()}` : "";
    return new GoldenHarnessError(
      "cases-py-failed",
      `cases.py failed for ${pythonBin}${suffix}`,
      pythonBin,
    );
  }

  static noPython(): GoldenHarnessError {
    return new GoldenHarnessError(
      "no-python",
      "No Python interpreter found for golden tests",
    );
  }
}
