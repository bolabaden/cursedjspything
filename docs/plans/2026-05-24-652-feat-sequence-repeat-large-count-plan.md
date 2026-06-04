---
title: "feat: str/bytes large int repeat evidence (plan 652)"
type: feat
status: completed
date: 2026-05-24
origin: LIVING-PLAN §8.15; post plan 650 four-type matrix
---

# str and bytes large int repeat evidence

## Summary

List/tuple already evidence **150_000** int repeat in `sequence-repeat-bool.test.ts` (plan 045). Extend **str** and **bytes** sections with the same large-count length check. Evidence-only.

## Requirements

| ID | Requirement |
|----|-------------|
| R1 | `mul(str, pyInt(150_000))` length 150_000 |
| R2 | `mul(bytes, pyInt(150_000))` length 150_000 |
| R3 | Validation-ladder note updated |
| R4 | `npm run check && npm test && npm run golden:keys` green |

## Scope Boundaries

### Outside scope

- Wide-source bytes repeat (list-only spread guard).
- Runtime changes.

## Implementation Units

### U1. Extend `test/cpython-derived/sequence-repeat-bool.test.ts`

### U2. Docs sync

## Verification

```bash
npm run check && npm test && npm run golden:keys
```
