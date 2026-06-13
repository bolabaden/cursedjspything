---
title: "docs: complex §8.17 canonical-home cross-links (plan 922)"
type: docs
status: completed
date: 2026-06-12
origin: docs/knowledgebase/50-execution/operator-evidence-audit.md
---

# Complex operator canonical-home cross-links (P2)

## Summary

Doc-only slice closing P2 backlog from plan 920 audit: add explicit **canonical evidence homes** in COMPATIBILITY §8.17 for the ten-file complex/scalar-complex operator cluster, disambiguating eq/pow vs pow-floordiv vs scalar-complex pow homes. No test or runtime changes.

## Problem Frame

Plan 920 overlap matrix shows intentional **shared-tuple** splits (e.g. bool↔complex `==` in `operator-complex-eq-pow` vs `+`/`-`/`*` in `operator-complex-scalar`). §8.17 prose cites all files inline but does not name canonical homes, making eq/pow vs pow-floordiv ownership unclear for readers and future dedupe plans.

## Requirements

| ID | Requirement | Origin |
|----|-------------|--------|
| R1 | Add §8.17 bullet list mapping complex operator concern → canonical Vitest file | audit P2, overlap matrix |
| R2 | Disambiguate `operator-complex-eq-pow` (eq, int `**`, ordering) vs `operator-complex-pow-floordiv` (float `**`, floordiv/mod) | audit FAQ |
| R3 | Note shared-tuple secondary cites for int/float `**` complex (`pow-edges`, `truediv-pow-modulo`) | audit overlap |
| R4 | Trim redundant inline file repeats in §8.17 complex prose; retain behavioral summary | scope |
| R5 | Update LIVING-PLAN with plan 922 landed delta | convention |
| R6 | No test moves, no runtime changes | audit R8 |

## Key Technical Decisions

| Decision | Rationale |
|----------|-----------|
| Canonical-home bullets after complex behavioral paragraph | Matches str/scalar canonical+remaining pattern in audit |
| Keep hash/format/ordering in prose, not per-file bullets | Single-file concerns outside overlap matrix |
| Branch from `main`; independent of plan 921 §8.15 merge | P2 touches §8.17 only |

## Scope Boundaries

### In scope

- `docs/COMPATIBILITY_AND_GAPS.md` §8.17 complex canonical-home bullets
- `docs/knowledgebase/LIVING-PLAN.md`

### Deferred

- P3 complex pow dedupe merges
- P2 bytes happy-path fold review
- Plan 921 §8.15 bullet sync (separate PR #589)

---

## Implementation Units

### U1. §8.17 canonical-home bullets

**Goal:** Ten complex cluster files have named canonical homes in §8.17.

**Requirements:** R1–R4

**Files:** `docs/COMPATIBILITY_AND_GAPS.md`

**Verification:** Each audit overlap-matrix canonical file appears exactly once as a bullet primary cite.

### U2. Living plan delta

**Goal:** Record P2 doc sync landed.

**Requirements:** R5

**Files:** `docs/knowledgebase/LIVING-PLAN.md`

## Verification

```bash
npm run check
```
