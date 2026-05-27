---
title: "feat: bytes replace"
type: feat
status: active
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md plan 119 next steps
---

# Bytes replace

## Summary

Add **`bytes.replace(old, new[, count])`** returning new `pyBytes` with non-overlapping substitutions.

---

## Problem Frame

Plan 119 next step lists further bytes/str API. `replace` completes the search/replace cluster with find/count.

---

## Requirements

- R1. `b'abcabc'.replace(b'bc', b'x')` → `b'axax'`; `count=1` → `b'axabc'`
- R2. `count=0` → unchanged; `count=-1` → all replacements
- R3. Empty `old`: insert `new` at first `count` boundary slots (CPython empty-old rules)
- R4. Both args bytes-like; `TypeError: a bytes-like object is required, not 'str'`
- R5. Reuse `splitMaxsplitArg` for `count`, `findSepIndex`, `concatBytes`
- R6. Add `test/cpython-derived/bytes-replace.test.ts`
- R7. COMPATIBILITY / validation-ladder / LIVING-PLAN delta
- R8. `npm run check`, `npm test`, `npm run golden:keys`

---

## Scope Boundaries

- No codec handlers or translate/maketrans

---

## Implementation Units

- U1. `replaceBytes` + slot in `bytes.ts`
- U2. Vitest evidence
- U3. Docs + feature branch + PR

---

## Test Scenarios

- T1. Full and limited count replacement
- T2. Non-overlapping `aaa` / `aa`
- T3. Empty old insertion
- T4. Remove sub (`new` empty)
- T5. Str old/new → `TypeError`

---

## Patterns

Return `pyBytes`; unbound method tests; `requireReplaceBytes` mirrors `splitSepArg` errors.
