---
title: "docs: bytes happy-path fold review (plan 924)"
type: docs
status: completed
date: 2026-06-12
origin: docs/knowledgebase/50-execution/operator-evidence-audit.md
---

# Bytes happy-path fold review (P2)

## Summary

Doc-only slice closing P2 backlog from plan 920 audit: review whether `operator-bytes-cross-type.test.ts` should fold into `operator-bytes-remaining-cross-type.test.ts`, record the **keep separate** decision, and add §8.15 **Bytes operator evidence** canonical-home bullets. No test moves or runtime changes.

## Problem Frame

Plan 920 overlap matrix flags `bytes*int` as shared-tuple across `operator-bytes-cross-type` and `operator-bytes-scalar-cross-type`, and proposes optionally folding the 30-line happy-path file into remaining. Plan 418 established the canonical+remaining-binary split for bytes (mirroring str/scalar). Readers need an explicit fold decision and canonical homes before any future dedupe.

## Requirements

| ID | Requirement | Origin |
|----|-------------|--------|
| R1 | Record fold decision: **keep** `operator-bytes-cross-type` as dedicated happy-path file | audit § Merge proposals #2 |
| R2 | Add §8.15 **Bytes operator evidence** bullets mapping concern → canonical Vitest file | audit overlap matrix |
| R3 | Disambiguate bytes*int (cross-type) vs int*bytes (scalar-cross-type shared-tuple) | audit bytes cluster |
| R4 | Trim redundant bytes operator inline repeats in §8.15 prose; retain behavioral summary | scope |
| R5 | Update LIVING-PLAN with plan 924 landed delta | convention |
| R6 | No test moves, no runtime changes | audit R8 |

## Key Technical Decisions

| Decision | Rationale |
|----------|-----------|
| Keep `operator-bytes-cross-type` separate | Matches plan 418 str/scalar happy+remaining pattern; remaining file is reject-heavy (~370 lines); fold adds noise |
| Canonical-home bullets in §8.15 evidence list | Same placement as plan 923 inplace index; bytes cluster is §8.15 scope |
| Branch from `main`; independent of plans 920–923 PRs | P2 doc sync only |

## Scope Boundaries

### In scope

- `docs/COMPATIBILITY_AND_GAPS.md` §8.15 bytes canonical-home bullets + fold decision
- `docs/knowledgebase/LIVING-PLAN.md`

### Deferred

- P3 complex pow dedupe merges
- Merging `operator-bytes-cross-type` into remaining (rejected this slice)

---

## Implementation Units

### U1. §8.15 bytes canonical-home bullets

**Goal:** Five bytes-cluster files have named canonical homes and explicit fold decision.

**Requirements:** R1–R4

**Files:** `docs/COMPATIBILITY_AND_GAPS.md`

**Verification:** Each audit bytes-cluster canonical file appears exactly once as a bullet primary cite; fold decision stated.

### U2. Living plan delta

**Goal:** Record P2 bytes fold review landed.

**Requirements:** R5

**Files:** `docs/knowledgebase/LIVING-PLAN.md`

## Verification

```bash
npm run check
```
