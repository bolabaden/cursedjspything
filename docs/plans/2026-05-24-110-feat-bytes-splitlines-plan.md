---
title: "feat: bytes splitlines"
type: feat
status: completed
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md plan 109 next steps
---

# Bytes splitlines

## Summary

Add **`bytes.splitlines(keepends=False)`** returning a `list` of `pyBytes` split on `\n`, `\r`, and `\r\n` line breaks.

---

## Problem Frame

Plan 109 next step lists further bytes methods. Split/rsplit/partition landed; `splitlines` is the line-oriented parser complement.

---

## Requirements

- R1. `b'a\nb\r\nc'.splitlines()` → `[b'a', b'b', b'c']`
- R2. `splitlines(keepends=True)` retains line break bytes on each line (except final segment without trailing break)
- R3. `b''.splitlines()` → `[]`; `b'\n'.splitlines()` → `[b'']`
- R4. `keepends` accepts bool or `pyBool`; default `False`
- R5. Add `test/cpython-derived/bytes-splitlines.test.ts`
- R6. COMPATIBILITY / validation-ladder / LIVING-PLAN delta
- R7. `npm run check`, `npm test`, `npm run golden:keys`

---

## Scope Boundaries

- No codec handlers or str methods
- Line breaks: `\n`, `\r`, `\r\n` only (CPython 3.14 bytes behavior)

---

## Implementation Units

- U1. `splitlinesBytes` + `splitlines` slot in `src/runtime/builtins/bytes.ts`
- U2. Vitest evidence
- U3. Docs + feature branch + PR

---

## Test Scenarios

- T1. Mixed `\n` / `\r\n` without keepends
- T2. `keepends=True` preserves breaks
- T3. Empty bytes → empty list; lone `\n` → `[b'']`
- T4. `b'a\n\n'` → `[b'a', b'']`
- T5. No line breaks → single-element list

---

## Patterns

Follow `test/cpython-derived/bytes-split.test.ts`; return `pyList` of `pyBytes`.
