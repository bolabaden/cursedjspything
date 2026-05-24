---
status: completed
date: 2026-05-19
origin: docs/brainstorms/2026-05-19-golden-key-parity-requirements.md
---

# Golden harness key-parity guard

## Summary

Add a structural check to the golden harness so `scripts/golden/cases.py` and `buildPyrtCases` in `scripts/golden/run.ts` expose the same case keys for each Python minor version, failing CI before value-level drift hides missing fixtures.

## Problem Frame

Golden parity today depends on manual duplication and `golden:` comments. `compareCases` only iterates expected keys, so extra pyrt-only keys never fail. Tier-1 added cases that proved the discipline is easy to break without automation. (see origin: `docs/brainstorms/2026-05-19-golden-key-parity-requirements.md`)

## Requirements traceability

| ID | Plan response |
|----|----------------|
| R1 | Symmetric diff per version profile in golden runner |
| R2 | Reuse existing 3.10 / 3.12 / 3.14 gate logic in both files; assert per profile |
| R3 | `KeyParityError` with missing/extra lists |
| R4 | Invoke from `npm run golden` (CI matrix unchanged) |
| R5 | No duplicate value compare |
| R6 | One paragraph in `README.md` + `docs/knowledgebase/50-execution/validation-ladder.md` |

## Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Where the check runs | Start of `scripts/golden/run.ts` `main()`, before `compareCases` | Single entry point contributors already use; satisfies R4 without new mental model |
| Source of truth for pyrt keys | Extract `goldenKeysForVersion(version: string): string[]` from the same branches as `buildPyrtCases` | Avoids a third manifest; gates stay in one TS function |
| Source of truth for CPython keys | `runCasesPy(bin)` JSON keys (minus `python`) | Authoritative; no fragile regex on `cases.py` |
| Offline / no-Python CI | Vitest asserts `goldenKeysForVersion` against committed snapshot per profile | `check-and-test` job has no Python; still catches pyrt-side drift and snapshot staleness |
| Snapshot update | `npm run golden:keys` writes `scripts/golden/expected/key-sets.json` | Explicit, reviewable diff when keys change intentionally |

## Implementation units

### U1 — Extract key collector (pyrt)

**Files:** `scripts/golden/run.ts` (or `scripts/golden/keys.ts` if `run.ts` grows)

- Refactor `buildPyrtCases` to call shared `goldenKeysForVersion(version)` and `buildPyrtCasesBody(...)`.
- `goldenKeysForVersion` returns sorted keys excluding `python`.
- Export for Vitest import.

**Test scenarios (Vitest `test/golden/key-parity.test.ts`):**

- T1. For versions `3.9`, `3.10`, `3.12`, `3.14`, key list matches `scripts/golden/expected/key-sets.json` entry.
- T2. `3.9` profile excludes `match_args` non-empty gate keys if gated off (expect empty or null-only keys per snapshot).
- T3. `3.14` profile includes `annotate_x`.

### U2 — Runtime parity assert (golden runner)

**Files:** `scripts/golden/run.ts`

- Add `assertGoldenKeyParity(pythonBin, version)`:
  - `refKeys` = keys from `runCasesPy(pythonBin)`
  - `pyrtKeys` = `goldenKeysForVersion(version)`
  - Diff; throw with labeled missing/extra sets (R3).
- Call inside the per-interpreter loop in `main()` before `compareCases`.

**Test scenarios (manual / CI golden job):**

- T4. With current fixtures, `npm run golden` exits 0 on matrix 3.10/3.12/3.14.
- T5. Temporarily drop one key from `buildPyrtCases` → failure names key before any value mismatch.

### U3 — Committed key snapshot + script

**Files:** `scripts/golden/expected/key-sets.json`, `package.json`, `scripts/golden/update-key-snapshot.ts` (thin wrapper)

- `golden:keys` regenerates snapshot from `goldenKeysForVersion` for profiles `3.9`–`3.14`.
- Document: run after intentional key changes.

**Test scenarios:**

- T6. Snapshot file is valid JSON; keys sorted; no `python` key.

### U4 — Documentation

**Files:** `README.md`, `docs/knowledgebase/50-execution/validation-ladder.md`

- State: new golden case → both `cases.py` and `buildPyrtCases`; run `npm run golden:keys` when key set changes.
- Link to brainstorm origin for rationale.

## Sequencing

1. U1 (extract + Vitest against snapshot)
2. U3 (generate initial `key-sets.json` from U1)
3. U2 (wire assert into golden loop)
4. U4 (docs)

## Risks

| Risk | Mitigation |
|------|------------|
| Gate logic duplicated between collector and builder | Single function builds keys then values, or keys derived from partial build |
| Snapshot drift annoyance | Only update via `golden:keys`; small file, PR-visible |
| Legacy `expected.json` path | Key check uses matrix versions only; legacy compare unchanged |

## Out of scope

- Merging `cases.py` and `run.ts` into one generator
- Protocol-family golden expansion
- Validating `golden:` comment text

## Validation ladder

1. `npm run check`
2. `npm test` (includes key-parity Vitest)
3. `npm run golden` (with Python 3.10+ on PATH locally; CI matrix)

## Execution posture

Test-first for U1: write Vitest expecting snapshot shape, then extract collector until green. U2 validated by intentional negative test locally before revert.
