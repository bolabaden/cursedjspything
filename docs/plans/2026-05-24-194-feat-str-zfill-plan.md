---
title: "feat: str zfill"
type: feat
status: active
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md plan 193 next steps
---

# str zfill

## Summary

Add **`str.zfill(width)`** returning zero-padded `pyStr`, preserving a leading `+` or `-` sign when present, mirroring landed `bytes.zfill`.

---

## Problem Frame

Plan 193 next step lists `zfill`. `center` / `ljust` / `rjust` landed in plans 190–192; `zfill` completes the str padding parity slice.

---

## Requirements

- R1. `"abc".zfill(5)` → `"00abc"`; `"42".zfill(5)` → `"00042"`
- R2. Signed numeric str: `"-42".zfill(5)` → `"-0042"`; `"+42".zfill(5)` → `"+0042"`
- R3. `width <= len(text)` → original str unchanged (code-point length)
- R4. Empty str: `"".zfill(5)` → `"00000"`
- R5. Add `test/cpython-derived/str-zfill.test.ts`
- R6. validation-ladder + LIVING-PLAN delta
- R7. `npm run check`, `npm test`, `npm run golden:keys`

---

## Scope Boundaries

- No additional str methods beyond `zfill` in this slice

---

## Implementation Units

- U1. `zfillStr` helper + register on `strType`
- U2. Vitest evidence in `str-zfill.test.ts`
- U3. Docs + feature branch + PR

---

## Test Scenarios

- T1. Zero-pad unsigned str and empty str
- T2. Preserve sign; zeros after sign for `-` / `+` prefixes
- T3. Width not wider than data → unchanged
- T4. Unicode body with sign prefix

---

## Patterns

Reuse `splitMaxsplitArg` and `strCodePointLength`; mirror `zfillBytes` in `bytes.ts`.
