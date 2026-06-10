---
title: "feat: ascii builtin export (plan 880)"
type: feat
status: completed
date: 2026-05-24
origin: LIVING-PLAN export ascii builtin after plan 879
---

# `ascii` builtin

## Summary

Expose CPython-compatible builtin `ascii(obj)` on the stable barrel. Core logic already lives in `numeric.ts` (`repr` + non-ASCII escaping); this slice adds arity-checked builtin dispatch and tests.

## Requirements

| ID | Requirement |
|----|-------------|
| R1 | `ascii(obj)` — exactly one `PyObject` arg → `str` with non-ASCII code points escaped in `repr` output |
| R2 | ASCII-only repr passes through (e.g. `'A'` → `"'A'"`) |
| R3 | `bytes` uses `repr` shape (e.g. `b'hi'` → `"b'hi'"`) |
| R4 | Zero/extra args → `TypeError: ascii() takes exactly one argument (N given)` |
| R5 | `ascii-builtin.test.ts`; update compatibility + living-plan + validation-ladder |
| R6 | `npm run check && npm test && npm run golden:keys` |

## Scope Boundaries

- `!a` format conversion already covered (plan 228); no str-format changes.
- PEP 3118 out of scope.

## Implementation Units

### U1. Builtin wrapper

**Files:** `src/runtime/builtins/ascii-builtin.ts`, `src/runtime/builtins/index.ts`, `src/barrel/stable.ts`

**Approach:** Thin wrapper calling existing `ascii()` from `numeric.ts`; return `pyStr`; arity guards match CPython.

### U2. Tests and docs

**Files:** `test/cpython-derived/ascii-builtin.test.ts`, compatibility + living-plan + validation-ladder

## Verification

```bash
npm run check && npm test && npm run golden:keys
```
