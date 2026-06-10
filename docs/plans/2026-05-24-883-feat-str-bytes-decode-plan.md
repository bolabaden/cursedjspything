---
title: "feat: str(bytes, encoding) decode form (plan 883)"
type: feat
status: completed
date: 2026-05-24
origin: plan 882 deferred str(bytes, encoding)
---

# `str(bytes, encoding[, errors])`

## Summary

Complete plan 882 partial: support CPython `str(bytes, encoding)` / optional `errors` by reusing existing `bytes.decode` payload logic.

## Requirements

| ID | Requirement |
|----|-------------|
| R1 | `str(b, encoding)` decodes bytes with named codec (utf-8, ascii, latin-1) |
| R2 | Optional third `errors` arg forwarded to decode path |
| R3 | Non-bytes first arg with 2+ args → `TypeError: decoding str is not supported` |
| R4 | Bad encoding/errors types → CPython-shaped `TypeError` messages |
| R5 | `>3` args → `TypeError: str expected at most 3 arguments, got N` |
| R6 | Extend `str-builtin.test.ts`; update docs |
| R7 | `npm run check && npm test && npm run golden:keys` |

## Scope Boundaries

- Buffer/memoryview decode deferred.
- PEP 3118 out of scope.

## Implementation Units

### U1. Shared decode helper + str constructor

**Files:** `src/runtime/builtins/bytes.ts`, `src/runtime/builtins/str-constructor.ts`

**Approach:** Export `pyBytesDecode`; wire `bytes.decode` and `str(...)` 2–3 arg form through it.

### U2. Tests and docs

**Files:** `test/cpython-derived/str-builtin.test.ts`, compatibility + living-plan + validation-ladder

## Verification

```bash
npm run check && npm test && npm run golden:keys
```
