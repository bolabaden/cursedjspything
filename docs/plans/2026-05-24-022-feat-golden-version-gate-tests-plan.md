---
title: "test: golden builder version-gate regression coverage"
type: feat
status: completed
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md
---

# Golden builder version-gate regression tests

## Summary

Add focused Vitest coverage for `buildPyrtCases` version-gated keys after plans 019/020 helper refactors, so 3.9 vs 3.10/3.12/3.14 profile behavior cannot regress silently.

---

## Problem Frame

Golden harness relies on `versionGte` gates for `match_args`, buffer fields, and `annotate_x`. Key-parity tests check key names but not gate semantics across profiles. A helper bug could pass key snapshot tests while returning wrong gated values.

---

## Requirements

- R1. Test `buildPyrtCases("3.9")` — `match_args` empty, buffer fields null, `annotate_x` null
- R2. Test `buildPyrtCases("3.10")` — `match_args` non-empty array
- R3. Test `buildPyrtCases("3.12")` — buffer fields numeric/boolean (not null)
- R4. Test `buildPyrtCases("3.14")` — `annotate_x` is `"int"`
- R5. Descriptor precedence keys unchanged on all profiles (`descriptor_data_wins`, `descriptor_nodata_loses`)
- R6. Run `npm run check`, `npm test`, `npm run golden:keys`
- R7. Update LIVING-PLAN delta

---

## Scope Boundaries

- `test/golden/` only (new test file)
- No golden JSON or runtime source changes
- No new golden keys

---

## Implementation Units

- U1. Add `pyrt-cases-version-gates.test.ts`
- U2. LIVING-PLAN delta

---

## Test Scenarios

- T1. 3.9 profile gated values are empty/null
- T2. 3.10 enables match_args only
- T3. 3.12 enables buffer fields
- T4. 3.14 enables annotate_x
- T5. Descriptor cases stable across 3.9 and 3.14

---

## Sources & References

- `scripts/golden/pyrt-cases.ts`
- `test/golden/key-parity.test.ts`
