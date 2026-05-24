---
title: "docs: validation-ladder sync for version-gate regression tests"
type: docs
status: completed
date: 2026-05-24
origin: docs/plans/2026-05-24-022-feat-golden-version-gate-tests-plan.md
---

# Validation-ladder sync for version-gate tests

## Summary

Document `test/golden/pyrt-cases-version-gates.test.ts` in the validation ladder so plan 022 / PR #20 has KB traceability beyond LIVING-PLAN.

---

## Problem Frame

Plan 022 added offline Vitest coverage for `buildPyrtCases` version gates. `validation-ladder.md` lists `key-parity.test.ts` but omits the new gate-semantics test; L5 still implies manual-only version gate checks.

---

## Requirements

- R1. Add `test/golden/pyrt-cases-version-gates.test.ts` to L2 unit-test table with focus description
- R2. L3b golden section: note offline gate-semantics test complements key-parity (no Python required)
- R3. L5: cite offline version-gate test as narrowest gate check before full golden matrix
- R4. LIVING-PLAN delta for plan 028
- R5. `npm run check`, `npm test`, `npm run golden:keys`

---

## Scope Boundaries

- Docs only (`validation-ladder.md`, LIVING-PLAN)
- No runtime or test code changes
- No golden JSON changes

---

## Implementation Units

- U1. Update `docs/knowledgebase/50-execution/validation-ladder.md`
- U2. LIVING-PLAN delta

---

## Test Scenarios

- N/A (docs-only); verify existing 181 tests still pass

---

## Sources & References

- `test/golden/pyrt-cases-version-gates.test.ts`
- `docs/plans/2026-05-24-022-feat-golden-version-gate-tests-plan.md`
