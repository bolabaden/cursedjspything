---
title: "feat: str.encode encoding/errors arg guards (plan 478)"
type: feat
status: active
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md plan 476
---

# str.encode argument guard parity

## Summary

Align `str-encode.test.ts` with `bytes-decode.test.ts` for **encoding** / **errors** `TypeError` messages and **errors** non-str guard; tighten unknown-errors `ValueError` message. Sync §8 str/bytes API prose.

## Requirements

| ID | Requirement |
|----|-------------|
| R1 | Vitest: non-str `errors` → `TypeError` with CPython-style message |
| R2 | Vitest: non-str `encoding` message regex matches runtime |
| R3 | Vitest: unknown errors handler message regex |
| R4 | COMPATIBILITY + validation-ladder note encode/decode arg parity |
| R5 | `npm run check`, `npm test`, `npm run golden:keys` green |

## Scope Boundaries

### Outside scope

- Runtime changes unless tests fail; PEP 3118.

## Implementation Units

### U1. Tests + docs

**Files:** `test/cpython-derived/str-encode.test.ts`, `docs/COMPATIBILITY_AND_GAPS.md`, `docs/knowledgebase/50-execution/validation-ladder.md`

## Verification

```bash
npm run check && npm test && npm run golden:keys
```
