---
title: "feat: bytes startswith and endswith"
type: feat
status: completed
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md plan 105 next steps
---

# Bytes startswith / endswith

## Summary

Add **`bytes.startswith(prefix, start=0, end=len)`** and **`bytes.endswith(suffix, start=0, end=len)`** returning `bool`, with bytes or tuple-of-bytes prefix/suffix and optional slice bounds.

---

## Problem Frame

Plan 105 next step lists `startswith` among further bytes methods. Split/rsplit landed; prefix/suffix checks are the next common bytes API surface.

---

## Requirements

- R1. `b'hello'.startswith(b'he')` → `True`; `b'hello'.endswith(b'lo')` → `True`
- R2. Prefix/suffix may be `bytes` or `tuple` of `bytes` (any match)
- R3. Optional `start` / `end` slice bounds (negative indices, clamped)
- R4. Empty prefix/suffix matches any slice (including empty)
- R5. Non-bytes prefix → `TypeError`
- R6. Add `test/cpython-derived/bytes-startswith-endswith.test.ts`
- R7. COMPATIBILITY / validation-ladder / LIVING-PLAN delta
- R8. `npm run check`, `npm test`, `npm run golden:keys`

---

## Scope Boundaries

- No `partition`, `splitlines`, or str methods
- No new codec error handlers

---

## Implementation Units

- U1. Helpers + `startswith` / `endswith` slots in `src/runtime/builtins/bytes.ts`
- U2. Vitest evidence
- U3. Docs + feature branch + PR

---

## Test Scenarios

- T1. `b'hello'.startswith(b'he')` / `endswith(b'lo')` → `True`
- T2. `b'hello'.startswith((b'xx', b'he'))` → `True`
- T3. `b'hello'.startswith(b'he', 1)` → `False`
- T4. `b'hello'.startswith(b'he', 0, 2)` → `True`
- T5. `b'hello'.startswith(b'')` → `True`
- T6. `b'hello'.startswith(pyStr('h'))` → `TypeError`

---

## Patterns

Follow unbound method tests in `test/cpython-derived/bytes-split.test.ts`; return `pyBool` from methods.
