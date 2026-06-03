---
title: "feat: golden scalar non-coercion keys (plan 398)"
type: feat
status: completed
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md plan 397
---

# Golden scalar non-coercion keys

## Summary

Add three golden case keys that lock CPython §8.15-style **non-coercion** for str↔int and str↔bytes: equality is false (not error), and int+str raises `TypeError`.

## Requirements

| ID | Requirement |
|----|-------------|
| R1 | `str_int_eq_false`, `str_bytes_eq_false`, `str_int_add_raises` in `cases.py` and `pyrt-cases.ts` |
| R2 | `npm run golden` refreshes `scripts/golden/expected/{3.10,3.12,3.14}.json` |
| R3 | `npm run golden:keys` → 32 keys/profile; docs say 32 |
| R4 | `npm run check`, `npm test`, `npm run golden:keys` green |

## Scope Boundaries

### Outside scope

- Runtime changes; operator test dedupe; PEP 3118
