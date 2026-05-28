---
title: "feat: str ljust and rjust"
type: feat
status: active
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md plan 191 next steps
---

# str ljust / rjust

## Summary

Add **`str.ljust(width[, fillchar])`** and **`str.rjust(width[, fillchar])`** returning padded `pyStr`, mirroring landed `bytes.ljust` / `bytes.rjust`.

---

## Problem Frame

Plan 191 next step lists ljust/rjust/zfill. `center` landed in plan 190; left/right padding completes the str padding trio before `zfill`.

---

## Requirements

- R1. `"abc".ljust(5)` → `"abc  "`; `rjust(5)` → `"  abc"`
- R2. Custom fill character; default `" "`
- R3. `width <= len(text)` → original str unchanged
- R4. Fill length ≠ 1 → `TypeError` (`The fill character must be exactly one character long`)
- R5. Add `test/cpython-derived/str-ljust-rjust.test.ts`
- R6. validation-ladder + LIVING-PLAN delta
- R7. `npm run check`, `npm test`, `npm run golden:keys`

---

## Scope Boundaries

- No `zfill` in this slice

---

## Implementation Units

- U1. `ljustStr` / `rjustStr` reusing `strCodePointLength` + `requireStrPadFill` + register on `strType`
- U2. Vitest evidence in `str-ljust-rjust.test.ts`
- U3. Docs + feature branch + PR

---

## Test Scenarios

- T1. Left and right padding with space and custom fill
- T2. Width not wider than data
- T3. Invalid fill length / non-str fill → `TypeError`
- T4. Unicode code-point width

---

## Patterns

Mirror `ljustBytes` / `rjustBytes` in `bytes.ts`; reuse pad helpers from plan 190 `centerStr`.
