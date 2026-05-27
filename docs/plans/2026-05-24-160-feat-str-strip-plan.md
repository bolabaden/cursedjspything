---
title: "feat: str.strip lstrip rstrip"
type: feat
status: active
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md plan 159 next steps
---

# str.strip / lstrip / rstrip

## Summary

Add **`str.strip()`**, **`str.lstrip()`**, and **`str.rstrip()`** with default Unicode whitespace trimming and optional custom str `chars`.

---

## Problem Frame

Bytes strip landed in plan 112; str whitespace methods are the next str API slice.

---

## Requirements

- R1. `"  abc  ".strip()` → `"abc"`; lstrip/rstrip one-sided
- R2. `"xxabcxx".strip("x")` → `"abc"`; `"".strip()` → `""`; `"abc".strip("")` unchanged
- R3. Non-str `chars` → `TypeError` (`strip arg must be None or str`)
- R4. `test/cpython-derived/str-strip.test.ts`
- R5. validation-ladder + LIVING-PLAN delta
- R6. `npm run check`, `npm test`, `npm run golden:keys`

---

## Scope Boundaries

- Default whitespace via engine trim (matches CPython on tested samples)

---

## Implementation Units

- U1. `stripStr` helper + three methods on `strType`
- U2. Vitest evidence
- U3. Docs + feature branch + PR
