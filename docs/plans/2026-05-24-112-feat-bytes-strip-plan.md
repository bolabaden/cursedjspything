---
title: "feat: bytes strip lstrip rstrip"
type: feat
status: completed
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md plan 111 next steps
---

# Bytes strip / lstrip / rstrip

## Summary

Add **`bytes.strip([chars])`**, **`bytes.lstrip([chars])`**, and **`bytes.rstrip([chars])`** returning trimmed `pyBytes`.

---

## Problem Frame

Plan 111 next step lists further bytes API. Line-oriented split/partition landed; strip helpers complete common bytes trimming.

---

## Requirements

- R1. `b'  abc  '.strip()` → `b'abc'`; `lstrip()` / `rstrip()` trim one side
- R2. Optional `chars` bytes strips any listed byte values; default ASCII whitespace
- R3. `strip(b'')` leaves bytes unchanged
- R4. Non-bytes `chars` → `TypeError`
- R5. Add `test/cpython-derived/bytes-strip.test.ts`
- R6. COMPATIBILITY / validation-ladder / LIVING-PLAN delta
- R7. `npm run check`, `npm test`, `npm run golden:keys`

---

## Scope Boundaries

- No codec handlers or str methods

---

## Implementation Units

- U1. `stripBytes` helper + three slots in `src/runtime/builtins/bytes.ts`
- U2. Vitest evidence
- U3. Docs + feature branch + PR

---

## Test Scenarios

- T1. Default whitespace strip / lstrip / rstrip
- T2. Custom `chars` bytes: `b'xxabcxx'.strip(b'x')` → `b'abc'`
- T3. `strip(b'')` unchanged
- T4. Str chars → `TypeError`

---

## Patterns

Reuse `isAsciiWhitespace`; return `pyBytes`; unbound method tests like `bytes-split.test.ts`.
