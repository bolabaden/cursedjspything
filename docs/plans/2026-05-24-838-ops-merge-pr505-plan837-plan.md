---
title: "ops: merge PR #505 plan 837 LIVING-PLAN handoff (plan 838)"
type: ops
status: completed
date: 2026-05-24
origin: plan 837; open PR #505
---

# Ops: plan 837 merged + LIVING-PLAN handoff

## Summary

Squash-merge PR #505 (plan 836 merge record, plan 837) onto `main`, then **LIVING-PLAN** merge delta for plan 837 via PR #505. **1202** Vitest / **163** files.

---

## Requirements

| ID | Requirement |
|----|-------------|
| R1 | Merge PR #505 when checks pass |
| R2 | `docs/knowledgebase/LIVING-PLAN.md` 3-delta: plan 837 merged via PR #505 |
| R3 | Mark plan 837 and this plan `status: completed` |
| R4 | `npm run check && npm test && npm run golden:keys` |

---

## Implementation Units

- U1. Merge PR #505
- U2. `docs/knowledgebase/LIVING-PLAN.md`
- U3. Plan status fields

---

## Verification

```bash
npm run check && npm test && npm run golden:keys
```
