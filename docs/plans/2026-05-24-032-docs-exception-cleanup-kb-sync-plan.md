---
title: "docs: KB sync for builtin exception cleanup"
type: docs
status: completed
date: 2026-05-24
origin: docs/plans/2026-05-24-031-fix-sequence-indexerror-plan.md
---

# KB sync for builtin exception cleanup

## Summary

Sync COMPATIBILITY, runtime-overview, and repo-signals with plans 029–031 (`PyTypeError`/`PyIndexError` on str/list/tuple) and current Vitest inventory (196 tests, 24 files).

---

## Problem Frame

Runtime exception typing landed in plans 029–031 but KB still lists 174 tests and omits `PyIndexError` from the exported exception subset table.

---

## Requirements

- R1. COMPATIBILITY appendix: add `PyIndexError` to exception export table
- R2. COMPATIBILITY §8: brief note on sequence subscript exception types + test evidence
- R3. `runtime-overview.md`: 196 tests, 24 test files
- R4. `repo-signals.md`: 196 tests, 24 files; extend test map for new cpython-derived files
- R5. `npm run check`, `npm test`
- R6. LIVING-PLAN delta

---

## Scope Boundaries

- Docs only
- No runtime or test changes

---

## Implementation Units

- U1. COMPATIBILITY_AND_GAPS.md
- U2. runtime-overview.md, repo-signals.md
- U3. LIVING-PLAN delta

---

## Test Scenarios

- N/A (docs); L1/L2 unchanged green

---

## Sources & References

- `docs/plans/2026-05-24-029-fix-str-contains-pytypeerror-plan.md`
- `docs/plans/2026-05-24-030-fix-list-tuple-pytypeerror-plan.md`
- `docs/plans/2026-05-24-031-fix-sequence-indexerror-plan.md`
