---
title: "feat: bytes title"
type: feat
status: completed
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md plan 133 next steps
---

# Bytes title

## Summary

Add **`bytes.title()`** returning title-cased `pyBytes` (ASCII letters only): uppercase the first letter of each word, lowercase the rest.

---

## Problem Frame

Plan 133 next step lists further bytes/str API. Plan 132 deferred `title`; it extends landed case methods (`upper`, `lower`, `capitalize`, `swapcase`).

---

## Requirements

- R1. `b'hello world'.title()` → `b'Hello World'`
- R2. Word boundaries at non-ASCII-letter bytes; `b'hello-world'.title()` → `b'Hello-World'`
- R3. `b'49abc'.title()` → `b'49Abc'`; empty bytes unchanged
- R4. Non-ASCII bytes pass through; following ASCII letters still title-cased (`b'\xffab'.title()` → `b'\xffAb'`)
- R5. Add `test/cpython-derived/bytes-title.test.ts`
- R6. COMPATIBILITY / validation-ladder / LIVING-PLAN delta
- R7. `npm run check`, `npm test`, `npm run golden:keys`

---

## Scope Boundaries

- No codec handlers or str parity in this slice

---

## Implementation Units

- U1. `bytesTitle` helper + slot on `bytesType`
- U2. Vitest evidence
- U3. Docs + feature branch + PR

---

## Test Scenarios

- T1. Space- and hyphen-delimited words
- T2. Digit prefix and non-letter boundaries
- T3. Empty bytes and non-ASCII prefix

---

## Patterns

Mirror `bytesCapitalize` / `bytesUpper` in `bytes.ts`; return `pyBytes`.
