---
title: "feat: str.split"
type: feat
status: active
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md plan 161 next steps
---

# str.split

## Summary

Add **`str.split(sep=None, maxsplit=-1)`** returning a list of str segments, mirroring bytes.split patterns.

---

## Problem Frame

Bytes split landed in plan 102; str still lacks split. Next str API slice from LIVING-PLAN.

---

## Requirements

- R1. `"a,b,c".split(",")` → `["a","b","c"]`; `"a  b".split()` → `["a","b"]`
- R2. `maxsplit=1` limits splits; empty sep → `ValueError`
- R3. Non-str sep → `TypeError` (`must be str or None, not ...`)
- R4. `test/cpython-derived/str-split.test.ts`
- R5. validation-ladder + LIVING-PLAN delta
- R6. `npm run check`, `npm test`, `npm run golden:keys`

---

## Scope Boundaries

- No rsplit in this slice

---

## Implementation Units

- U1. Split helpers + method on `strType`
- U2. Vitest evidence
- U3. Docs + feature branch + PR
