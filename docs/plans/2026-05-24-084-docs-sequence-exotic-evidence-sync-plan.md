---
title: "docs: sync §8.15 evidence with sequence exotic tests"
type: docs
status: completed
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md plan 083 next steps (sequence exotic §8.15)
---

# Sync §8.15 evidence with sequence exotic tests

## Summary

`sequence-cross-type.test.ts` and `sequence-repeat-nonint.test.ts` are in the validation ladder but omitted from COMPATIBILITY §8.15 **Evidence** inventory. Add them to close the documentation gap for sequence-vs-unrelated-scalar coverage.

---

## Problem Frame

Plan 083 next step calls out sequence exotic §8.15. Tests landed in plans 054–055 but the consolidated §8.15 evidence paragraph (plan 081/054 dedupe) does not list these two files, understating coverage.

---

## Requirements

- R1. Add `sequence-cross-type.test.ts` and `sequence-repeat-nonint.test.ts` to COMPATIBILITY §8.15 evidence list (alphabetized)
- R2. Tighten **Remaining gap** bullet to reflect sequence add/mul/repeat float coverage (bytes objects still open)
- R3. Prepend LIVING-PLAN delta for plan 084
- R4. `npm test` unchanged (309 tests)

---

## Scope Boundaries

- Docs only — tests already exist and pass
- No validation-ladder changes (rows already present)

---

## Implementation Units

- U1. **COMPATIBILITY** — §8.15 evidence + remaining gap
- U2. **LIVING-PLAN** — plan 084 delta
- U3. **Verification** — `npm test`; feature branch + PR

---

## Test Scenarios

- T1. COMPATIBILITY §8.15 mentions both sequence test files
- T2. `npm test` passes
