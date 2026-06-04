---
title: "ops: merge PR #385 plan 717 list imul (plan 718)"
type: ops
status: completed
date: 2026-05-24
origin: plan 717; open PR #385
---

# Ops: plan 717 merged + LIVING-PLAN handoff

## Summary

Squash-merge PR #385 (`list.__imul__` in-place int repeat, plan 717) onto `main`, then **LIVING-PLAN** merge delta for plan 717 via PR #385. **1201** Vitest / **163** files.

---

## Requirements

| ID | Requirement |
|----|-------------|
| R1 | Merge PR #385 when checks pass |
| R2 | `LIVING-PLAN.md` 3-delta: plan 717 merged via PR #385 |
| R3 | Mark plan 717 and this plan `status: completed` |
| R4 | `npm run check && npm test && npm run golden:keys` |

---

## Implementation Units

- U1. Merge PR #385
- U2. `docs/knowledgebase/LIVING-PLAN.md`
- U3. Plan status fields

---

## Verification

```bash
npm run check && npm test && npm run golden:keys
```
