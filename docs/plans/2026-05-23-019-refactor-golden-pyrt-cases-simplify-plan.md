---
title: "refactor: simplify golden pyrt-cases builder"
type: refactor
status: completed
date: 2026-05-23
origin: docs/knowledgebase/LIVING-PLAN.md
---

# Simplify golden pyrt-cases builder

## Summary

Reduce duplication in `scripts/golden/pyrt-cases.ts` via small local helpers (version gate, descriptor owner fixture) without changing golden output.

---

## Problem Frame

Golden harness grew to ~19 keys with repeated version-gating and descriptor-owner setup patterns. LIVING-PLAN next slice can include maintainability pass before more Tier B cherry-picks.

---

## Requirements

- R1. Extract `versionGte` helper for 3.10/3.12/3.14 gates
- R2. Extract descriptor owner helper for data/non-data precedence cases
- R3. Preserve identical `buildPyrtCases` output for all profile versions
- R4. Run `npm run check`, `npm test`, `npm run golden`, `npm run golden:keys`
- R5. Update LIVING-PLAN delta (refactor landed; next = Tier B golden)

---

## Scope Boundaries

- `scripts/golden/pyrt-cases.ts` only
- No `cases.py` or expected JSON changes
- No new golden keys

---

## Implementation Units

- U1. Helpers + refactor `buildPyrtCases`
- U2. LIVING-PLAN delta

---

## Test Scenarios

- T1. `test/golden/key-parity.test.ts` passes unchanged
- T2. `npm run golden` all checks pass
- T3. Output byte-identical to pre-refactor for 3.10/3.12/3.14 profiles

---

## Sources & References

- `scripts/golden/pyrt-cases.ts`
- ce-simplify-code / maintainability review
