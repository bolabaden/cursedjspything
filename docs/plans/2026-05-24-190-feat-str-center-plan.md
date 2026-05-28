---
title: "feat: str center"
type: feat
status: active
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md plan 189 next steps
---

# str center

## Summary

Add **`str.center(width[, fillchar])`** returning centered `pyStr` padded to `width`, mirroring landed `bytes.center`.

---

## Problem Frame

Plan 189 next step lists `center`. Bytes padding landed in plan 128; str parity closes the affix/search/replace/removeprefix slice.

---

## Requirements

- R1. `"abc".center(5)` → `" abc "`; `center(5, "-")` → `"-abc-"`
- R2. `width <= len(text)` → original str unchanged (including `width=0`)
- R3. Default fill `" "`; fill must be length-1 str or `TypeError`
- R4. `width` parsed via `splitMaxsplitArg`
- R5. Add `test/cpython-derived/str-center.test.ts`
- R6. validation-ladder + LIVING-PLAN delta
- R7. `npm run check`, `npm test`, `npm run golden:keys`

---

## Scope Boundaries

- No `ljust`/`rjust`/`zfill` in this slice

---

## Implementation Units

- U1. `strCodePointLength`, `requireStrPadFill`, `centerStr` + register on `strType`
- U2. Vitest evidence in `str-center.test.ts`
- U3. Docs + feature branch + PR

---

## Test Scenarios

- T1. Space and custom fill padding
- T2. Width not wider than data
- T3. Empty str centered
- T4. Invalid fill length / non-str fill → `TypeError`
- T5. Unicode code-point width

---

## Patterns

Mirror `centerBytes` in `bytes.ts`; count str length by code points for width comparison.
