---
title: "feat: str __contains__ on empty haystack (plan 554)"
type: feat
status: completed
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md plan 552
---

# str __contains__ on empty haystack

## Summary

CPython: empty `str` contains non-empty substring → `False`; contains empty substring → `True`; `int`/`bool` left operands raise `TypeError`. Mirror plan 552 bytes evidence in `operator-str-scalar.test.ts` and validation-ladder.

## Requirements

| ID | Requirement |
|----|-------------|
| R1 | `"".__contains__("a")` → `False` via `contains(pyStr(""), pyStr("a"))` |
| R2 | `"".__contains__("")` → `True` |
| R3 | `"".__contains__(97)` via int left operand → `TypeError` (message matches existing str-scalar guard) |
| R4 | validation-ladder notes plan 554 on `operator-str-scalar` row |
| R5 | `npm run check && npm test && npm run golden:keys` green |

## Scope Boundaries

### Outside scope

- Runtime unless tests fail; PEP 3118; bytes `__contains__` (plan 552).

## Implementation Units

### U1. Tests + docs

**Files:** `test/cpython-derived/operator-str-scalar.test.ts`, `docs/knowledgebase/50-execution/validation-ladder.md`

**Test scenarios:**

- Empty haystack, non-empty str member → false
- Empty haystack, empty str member → true
- Empty haystack, int member → TypeError with `'in <string>' requires string as left operand, not int`

## Verification

```bash
npm run check && npm test && npm run golden:keys
```
