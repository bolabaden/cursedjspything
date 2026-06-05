---
title: "ops: merge PR #485 plan 817 LIVING-PLAN handoff (plan 818)"
type: ops
status: completed
date: 2026-05-24
origin: plan 817; open PR #485
---

# Ops: plan 817 merged + LIVING-PLAN handoff

## Summary

Squash-merge PR #485 (plan 816 merge record, plan 817) onto `main`, then **LIVING-PLAN** merge delta for plan 817 via PR #485. **1202** Vitest / **163** files.

---

## Requirements

| ID | Requirement |
|----|-------------|
| R1 | Merge PR #485 when checks pass |
| R2 | `docs/knowledgebase/LIVING-PLAN.md` 3-delta: plan 817 merged via PR #485 |
| R3 | Mark plan 817 and this plan `status: completed` |
| R4 | `npm run check && npm test && npm run golden:keys` |

---

## Implementation Units

- U1. Merge PR #485
- U2. `docs/knowledgebase/LIVING-PLAN.md`
- U3. Plan status fields

---

## Verification

```bash
npm run check && npm test && npm run golden:keys
```
