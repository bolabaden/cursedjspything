---
title: "feat: bytes __format__"
type: feat
status: completed
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md plan 233 next steps
---

# bytes __format__

## Summary

Add **`bytes.__format__`**: empty spec returns **`bytes` repr string**; non-empty spec raises **`TypeError`** (CPython parity).

---

## Problem Frame

Int/str/float/bool format stacks are on `main`. `bytes` has repr/str but no `Hook.format`; `format(pyBytes(...), '')` currently falls back via `str()` while non-empty specs already raise `TypeError` from missing hook.

---

## Requirements

- R1. `format(b'hi', '')` → `"b'hi'"`
- R2. `format(b'hi', '10')` → `TypeError: unsupported format string passed to bytes.__format__`
- R3. Extend `test/cpython-derived/operator-format-evidence.test.ts`
- R4. LIVING-PLAN delta; validation ladder

---

## Scope Boundaries

- Empty spec only; no width/alignment on bytes
- PEP 3118 out of scope

---

## Implementation Units

- U1. `formatBytesSpec` + `Hook.format` on `bytesType` in `src/runtime/builtins/bytes.ts`
- U2. Vitest + docs + feature branch + PR

---

## Test Scenarios

- T1. Empty spec returns repr string
- T2. Non-empty spec TypeError with CPython message

---

## Patterns

Reuse `bytesRepr`; mirror bool empty-spec special case with TypeError on non-empty.
