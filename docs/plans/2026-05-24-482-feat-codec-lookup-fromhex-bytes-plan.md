---
title: "feat: codec LookupError + fromhex bytes arg (plan 482)"
type: feat
status: active
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md plan 480
---

# Codec LookupError and fromhex bytes arg

## Summary

Complete codec parity: `str.encode` unknown encoding message regex; `bytes.fromhex` accepts **bytes** argument (documented niche API). Sync §8.15.

## Requirements

| ID | Requirement |
|----|-------------|
| R1 | str-encode: unknown encoding → `LookupError` with `/unknown encoding: nope/` |
| R2 | bytes-hex: fromhex(pyBytes(...)) decodes like str |
| R3 | §8.15 + validation-ladder updated |
| R4 | `npm run check`, `npm test`, `npm run golden:keys` green |

## Scope Boundaries

### Outside scope

- Runtime; PEP 3118.

## Implementation Units

### U1. Tests + docs

**Files:** `test/cpython-derived/str-encode.test.ts`, `test/cpython-derived/bytes-hex-fromhex.test.ts`, `docs/COMPATIBILITY_AND_GAPS.md`, `docs/knowledgebase/50-execution/validation-ladder.md`

## Verification

```bash
npm run check && npm test && npm run golden:keys
```
