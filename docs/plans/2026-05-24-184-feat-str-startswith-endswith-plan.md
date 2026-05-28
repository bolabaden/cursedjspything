---
title: "feat: str startswith and endswith"
type: feat
status: active
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md plan 183 next steps
---

# str startswith and endswith

## Summary

Add **`str.startswith`** and **`str.endswith`** with optional `start`/`end` bounds and tuple-of-str prefixes, mirroring `bytes.startswith` / `bytes.endswith`.

---

## Problem Frame

Search slice (find/index/count) landed in plans 178–182. Affix checks are next from LIVING-PLAN.

---

## Requirements

- R1. `"hello".startswith("he")` → True; `"hello".endswith("lo")` → True
- R2. Tuple of str prefixes; empty affix → True
- R3. Respects `start`/`end` bounds
- R4. Wrong types → `PyTypeError` with CPython-style messages
- R5. `test/cpython-derived/str-startswith-endswith.test.ts`
- R6. validation-ladder + LIVING-PLAN delta
- R7. `npm run check`, `npm test`, `npm run golden:keys`

---

## Scope Boundaries

- No replace/removeprefix in this slice

---

## Implementation Units

- U1. Affix helpers + `strStartswith`/`strEndswith` + register on `strType`
- U2. Vitest evidence mirroring `bytes-startswith-endswith.test.ts`
- U3. Docs + feature branch + PR
