---
title: "feat: PyRuntimeError for methodType bootstrap (plan 460)"
type: feat
status: completed
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md plan 458
---

# PyRuntimeError for methodType bootstrap

## Summary

Replace plain `Error` in `getMethodType()` with `PyRuntimeError`; add Vitest evidence; narrow COMPATIBILITY §8.17 remaining-gap note.

## Requirements

| ID | Requirement |
|----|-------------|
| R1 | `PyRuntimeError` in `src/runtime/core/errors.ts` with `name === "RuntimeError"` |
| R2 | `getMethodType()` throws `PyRuntimeError` when `methodType` unset |
| R3 | Re-export `PyRuntimeError` via `lookup.ts` and `stable.ts` barrel |
| R4 | `test/core/method.test.ts` covers pre-init `getMethodType()` |
| R5 | §8.17 prose updated; `npm run check`, `npm test`, `npm run golden:keys` green |

## Scope Boundaries

### Outside scope

- Other test `throw new Error` stubs; scripts/golden; PEP 3118.

## Implementation Units

### U1. Runtime error type + method bootstrap

**Files:** `src/runtime/core/errors.ts`, `src/runtime/class/method.ts`, `src/runtime/core/lookup.ts`, `src/barrel/stable.ts`

### U2. Test + docs

**Files:** `test/core/method.test.ts`, `docs/COMPATIBILITY_AND_GAPS.md`

## Verification

```bash
npm run check && npm test && npm run golden:keys
```
