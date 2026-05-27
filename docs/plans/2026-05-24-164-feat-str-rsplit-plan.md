---
title: "feat: str.rsplit"
type: feat
status: active
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md plan 163 next steps
---

# str.rsplit

## Summary

Add **`str.rsplit(sep=None, maxsplit=-1)`** returning a list of str segments from the right, mirroring `bytes.rsplit` and reusing str split arg helpers.

---

## Problem Frame

Plan 162 landed `str.split`; bytes already has `rsplit`. Natural next str API slice from LIVING-PLAN.

---

## Requirements

- R1. `"a,b,c".rsplit(",")` → `["a","b","c"]`; `"a  b  c".rsplit(None, 1)` splits from the right on whitespace
- R2. `maxsplit=1` limits splits from the right; empty sep → `ValueError`
- R3. Non-str sep → `TypeError` (`must be str or None, not ...`)
- R4. `test/cpython-derived/str-rsplit.test.ts`
- R5. validation-ladder + LIVING-PLAN delta
- R6. `npm run check`, `npm test`, `npm run golden:keys`

---

## Scope Boundaries

- No partition/splitlines in this slice

---

## Implementation Units

- U1. rsplit helpers + method on `strType` (reuse `splitMaxsplitArg`, `splitStrSepArg`)
- U2. Vitest evidence mirroring `bytes-rsplit.test.ts`
- U3. Docs + feature branch + PR
