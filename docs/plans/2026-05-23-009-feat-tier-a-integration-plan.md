---
title: "feat: Tier A integration branch (stack PRs #3–#8)"
type: feat
status: completed
date: 2026-05-23
origin: docs/knowledgebase/LIVING-PLAN.md
---

# Tier A integration branch

## Summary

Integrate open parity PRs into one merge-ready branch: golden key-parity (#3), richcmp fixtures (#5), operator int/float (#6), contains (#7), isinstance (#8). Close superseded PR #4.

---

## Problem Frame

LIVING-PLAN next step is merging stacked PRs. Tier A cpython-derived ports and golden key guard live on separate branches from `main`; a single integration branch reduces merge friction and validates the combined stack.

---

## Requirements

- R1. Merge `feat/golden-key-parity-guard` → richcmp → operator-int-float → contains → isinstance in order
- R2. Resolve doc conflicts; unified LIVING-PLAN delta
- R3. `npm run check`, `npm test`, `npm run golden` green on integration branch
- R4. Close PR #4 as superseded
- R5. Open integration PR (or document merge order)

---

## Scope Boundaries

- No new feature work beyond conflict resolution
- Do not force-merge conflicting PR #4
- Keep individual PR branches intact on remote

---

## Implementation Units

- U1. `feat/tier-a-integration` branch with sequential merges
- U2. `docs/knowledgebase/LIVING-PLAN.md` — consolidated delta
- U3. `gh pr close 4` with superseded note

---

## Test Scenarios

- T1. All Vitest files pass including golden key-parity + cpython-derived suite
- T2. `npm run golden` exits 0 (or documents env requirement)
- T3. No duplicate test files or broken imports after merge

---

## Sources & References

- Open PRs #3, #5, #6, #7, #8 on `bolabaden/cursedjspything`
- `docs/knowledgebase/LIVING-PLAN.md`
