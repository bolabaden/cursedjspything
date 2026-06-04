---
title: "docs: §8.15 sequence evidence sync after plan 690"
type: feat
status: completed
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md plan 690 merge
---

# §8.15 sequence evidence sync after plan 690

## Summary

Remove stale **`operator-list-tuple-cross-type.test.ts`** references from §8.15 prose and cross-type ordering consumer lists; point list/tuple operator evidence at canonical **`sequence-*`** files (plan 690). Refresh KB Vitest counts (1170 tests / 163 files).

---

## Problem Frame

Plan 690 deleted `operator-list-tuple-cross-type.test.ts`, but §8.15 paragraph prose (line ~409) still names it as canonical for list↔tuple cross-type ops and ordering helper consumers. `repo-signals.md` and `runtime-overview.md` still cite **223 tests / 28 files**.

---

## Requirements

| ID | Requirement |
|----|-------------|
| R1 | `docs/COMPATIBILITY_AND_GAPS.md` §8.15: replace `operator-list-tuple-cross-type` prose with `sequence-*` file mapping (add/iadd/imul/mul/eq/ordering/sub) |
| R2 | §8.15 ordering-helper consumer list: use `sequence-ordering-cross-type.test.ts` instead of removed file |
| R3 | `docs/knowledgebase/90-meta/repo-signals.md` and `docs/knowledgebase/10-architecture-runtime/runtime-overview.md` — Vitest **1170 / 163** |
| R4 | `docs/knowledgebase/LIVING-PLAN.md` 3-delta prepended |
| R5 | `npm run check && npm test && npm run golden:keys` green (no test changes) |

---

## Scope Boundaries

### In scope

- Documentation only

### Outside scope

- Runtime or Vitest changes
- Historical plan file edits under `docs/plans/`
- PEP 3118

---

## Implementation Units

### U1. `docs/COMPATIBILITY_AND_GAPS.md` — §8.15 prose + evidence cross-refs

### U2. KB counts — `repo-signals.md`, `runtime-overview.md`

### U3. `docs/knowledgebase/LIVING-PLAN.md` — delta

---

## Verification

```bash
npm run check && npm test && npm run golden:keys
```

---

## Sources

- `docs/plans/2026-05-24-690-feat-dedupe-operator-list-tuple-plan.md`
- `docs/COMPATIBILITY_AND_GAPS.md` §8.6 canonical table (plans 688, 690)
