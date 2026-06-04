---
title: "feat: bytes.__contains__ on empty input (plan 552)"
type: feat
status: completed
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md plan 550
---

# bytes.__contains__ on empty haystack

## Summary

CPython: `b""` contains non-empty subbytes → `False`; contains empty subbytes or (via protocol) empty member edge cases on empty haystack. Add explicit derived evidence for empty `bytes` membership and validation-ladder note.

## Requirements

| ID | Requirement |
|----|-------------|
| R1 | `b"".__contains__(b"a")` → `False` |
| R2 | `b"".__contains__(b"")` → `True` |
| R3 | `b"".__contains__(97)` (int in range) → `False` |
| R4 | validation-ladder notes plan 552 on bytes-isascii-contains row |
| R5 | `npm run check && npm test && npm run golden:keys` green |

## Scope Boundaries

### Outside scope

- Runtime unless tests fail; PEP 3118; str `__contains__` (str-scalar / operator tests).

## Implementation Units

### U1. Tests + docs

**Files:** `test/cpython-derived/bytes-isascii-contains.test.ts`, `docs/knowledgebase/50-execution/validation-ladder.md`

## Verification

```bash
npm run check && npm test && npm run golden:keys
```
