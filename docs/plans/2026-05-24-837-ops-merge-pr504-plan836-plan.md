---
title: "ops: merge PR #504 plan 836 LIVING-PLAN handoff (plan 837)"
type: ops
status: completed
date: 2026-05-24
origin: plan 836; open PR #504
---

# Ops: plan 836 merged + LIVING-PLAN handoff

## Summary

Squash-merge PR #504 (plan 835 merge record, plan 836) onto `main`, then **LIVING-PLAN** merge delta for plan 836 via PR #504. **1202** Vitest / **163** files.

---

## Requirements

| ID | Requirement |
|----|-------------|
| R1 | Merge PR #504 when checks pass |
| R2 | `docs/knowledgebase/LIVING-PLAN.md` 3-delta: plan 836 merged via PR #504 |
| R3 | Mark plan 836 and this plan `status: completed` |
| R4 | `npm run check && npm test && npm run golden:keys` |

---

## Implementation Units

- U1. Merge PR #504
- U2. `docs/knowledgebase/LIVING-PLAN.md`
- U3. Plan status fields

---

## Verification

```bash
npm run check && npm test && npm run golden:keys
```
