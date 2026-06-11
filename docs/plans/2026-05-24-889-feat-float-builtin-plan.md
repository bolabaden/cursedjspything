---
title: "feat: float builtin constructor (plan 889)"
type: feat
status: completed
date: 2026-05-24
origin: LIVING-PLAN after int builtin (885); natural follow-on to int/str/bytes constructors
---

# `float` builtin constructor

## Summary

Add CPython-compatible builtin `float()` / `float(x)` for zero-arg, numeric `__float__` conversion, and str/bytes literal parsing. Rename stable protocol export `toFloat` → `floatProtocol` (mirror `intProtocol` from plan 885).

## Requirements

| ID | Requirement |
|----|-------------|
| R1 | `float()` → `pyFloat(0.0)` |
| R2 | `float(number)` → `pyFloat` via `__float__` (`floatProtocol`) for int/float/bool |
| R3 | `float(str)` → parse with whitespace strip, `_` separators, scientific notation, `inf`/`infinity`/`nan` |
| R4 | `float(bytes)` → ASCII float parse (same rules as str) |
| R5 | Invalid literal → `ValueError: could not convert string to float: '...'` |
| R6 | Non-str/bytes/non-numeric → `TypeError: float() argument must be a string or a real number, not 'typename'` |
| R7 | `>1` args → `TypeError: float expected at most 1 argument, got N` |
| R8 | Rename stable protocol export to `floatProtocol`; export builtin `float` from builtins barrel |
| R9 | `float-builtin.test.ts`; migrate `toFloat` imports to `floatProtocol` in tests/examples/docs |
| R10 | `npm run check && npm test && npm run golden:keys` |

## Scope Boundaries

- No `float(str, base)` — CPython has no base argument.
- PEP 3118 out of scope.
- Align `intProtocol` infinity/`PyOverflowError` residuals deferred (plan 885).

## Implementation Units

### U1. `float` constructor + literal parser

**Files:** `src/runtime/builtins/float-constructor.ts`, `src/runtime/builtins/index.ts`, `src/barrel/stable.ts`

### U2. Tests and docs

**Files:** `test/cpython-derived/float-builtin.test.ts`, `test/cpython-derived/operator-numeric-conversion-evidence.test.ts`, `test/dispatch/operators.test.ts`, `examples/python-vs-js.ts`, `docs/COMPATIBILITY_AND_GAPS.md`, `docs/knowledgebase/LIVING-PLAN.md`, `docs/knowledgebase/50-execution/validation-ladder.md`

## Verification

```bash
npm run check && npm test && npm run golden:keys
```
