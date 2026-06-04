---
title: "feat: strip empty str/bytes input (plan 506)"
type: feat
status: active
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md plan 504
---

# strip/lstrip/rstrip on empty input

## Summary

Add CPython evidence for `strip`/`lstrip`/`rstrip` on empty `str` and `bytes`, and extend `bytes` empty-`chars` to `lstrip`/`rstrip` (str done in plan 502). Update validation-ladder.

## Requirements

| ID | Requirement |
|----|-------------|
| R1 | `"".strip()`, `lstrip`, `rstrip` return `""` |
| R2 | `b"".strip()`, `lstrip`, `rstrip` return empty bytes |
| R3 | `bytes.lstrip`/`rstrip` with empty `chars` leave data unchanged |
| R4 | validation-ladder updated |
| R5 | `npm run check && npm test && npm run golden:keys` green |

## Scope Boundaries

### Outside scope

- Runtime; PEP 3118.

## Implementation Units

### U1. Tests + docs

**Files:** `test/cpython-derived/str-strip.test.ts`, `test/cpython-derived/bytes-strip.test.ts`, `docs/knowledgebase/50-execution/validation-ladder.md`

## Verification

```bash
npm run check && npm test && npm run golden:keys
```
