---
title: "feat: bytes.splitlines non-newline breaks (plan 492)"
type: feat
status: active
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md plan 490
---

# bytes.splitlines does not split on vt / UTF-8 separators

## Summary

CPython `bytes.splitlines` only treats `\n` and `\r` as line breaks (unlike `str.splitlines`, plan 490). Extend `bytes-splitlines.test.ts` with vertical tab and UTF-8 line/paragraph separator evidence; sync validation-ladder.

## Requirements

| ID | Requirement |
|----|-------------|
| R1 | `bytes` with `0x0b` between `a` and `b` stays one segment |
| R2 | UTF-8 bytes for U+2028 / U+2029 between `a` and `b` stay one segment |
| R3 | validation-ladder updated |
| R4 | `npm run check && npm test && npm run golden:keys` green |

## Scope Boundaries

### Outside scope

- Runtime changes; str.splitlines; PEP 3118.

## Implementation Units

### U1. Tests + docs

**Files:** `test/cpython-derived/bytes-splitlines.test.ts`, `docs/knowledgebase/50-execution/validation-ladder.md`

## Verification

```bash
npm run check && npm test && npm run golden:keys
```
