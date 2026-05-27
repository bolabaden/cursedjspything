---
title: "feat: bytes ASCII predicate methods"
type: feat
status: active
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md plan 141 next steps
---

# Bytes ASCII predicate methods

## Summary

Add **`bytes.isalpha`**, **`isdigit`**, **`isalnum`**, **`islower`**, **`isupper`**, **`istitle`**, and **`isspace`** returning `pyTrue`/`pyFalse`.

---

## Problem Frame

Plan 141 next step lists further bytes/str API. These complete common ASCII classification methods on `bytes`.

---

## Requirements

- R1. `b'abc'.isalpha()` → true; `b'a1'.isalpha()` → false; empty → false
- R2. `b'123'.isdigit()` → true; `b'abc'.islower()` / `isupper()` follow CPython cased-byte rules
- R3. `b'Hello World'.istitle()` → true; reuse title-case equality check
- R4. `b' \\t\\n'.isspace()` → true
- R5. Add `test/cpython-derived/bytes-predicates.test.ts`
- R6. COMPATIBILITY / validation-ladder / LIVING-PLAN delta
- R7. `npm run check`, `npm test`, `npm run golden:keys`

---

## Scope Boundaries

- No translate/maketrans or codec handlers

---

## Implementation Units

- U1. Predicate helpers + seven instance slots
- U2. Vitest evidence
- U3. Docs + feature branch + PR

---

## Test Scenarios

- T1. isalpha / isdigit / isalnum on ASCII and empty
- T2. islower / isupper / istitle cased rules
- T3. isspace on whitespace vs non-whitespace

---

## Patterns

Return `pyTrue`/`pyFalse` singletons; ASCII-only checks matching existing case methods.
