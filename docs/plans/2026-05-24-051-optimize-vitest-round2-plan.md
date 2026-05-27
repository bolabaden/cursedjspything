---
title: "optimize: vitest duration round 2 (maxWorkers / vmForks)"
type: perf
status: completed
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md; ce-optimize/vitest-duration hypothesis backlog
---

# Vitest duration round 2

## Summary

Run a second ce-optimize pass on `npm test` wall time using backlog hypotheses from round 1 (`maxWorkers`, `pool: vmForks`). Keep only changes that improve or match median duration with full suite green.

---

## Problem Frame

Round 1 landed `isolate: false` + deps optimizer (~38% faster, 213 tests). Test count is now ~221+. Backlog lists `maxWorkers` and `vmForks` as untried. LIVING-PLAN lists round 2 as optional next work.

---

## Requirements

- R1. Baseline: median of 3× `npm run test:measure` on current `vitest.config.ts`
- R2. Experiment A: `pool: "vmForks"` (keep `isolate: false`, deps optimizer)
- R3. Experiment B: explicit `maxWorkers` (only if A inconclusive or as second kept tweak)
- R4. Keep config change only if median vitest_seconds improves ≥5% vs baseline OR matches within noise with zero flakes across 3 runs
- R5. Append results to `.context/compound-engineering/ce-optimize/vitest-duration/experiment-log.yaml` round-2 section
- R6. If config changes: note in `validation-ladder.md` L2; LIVING-PLAN delta
- R7. `npm run check`, `npm test`, `npm run golden:keys`

---

## Scope Boundaries

- `vitest.config.ts` + ce-optimize artifacts + docs only
- No test logic changes unless pollution discovered (revert isolate change instead)

---

## Implementation Units

- U1. Measure baseline + experiments
- U2. Apply winning vitest config (if any)
- U3. experiment-log + validation-ladder + LIVING-PLAN

---

## Test Scenarios

- T1. Full Vitest suite passes after any config change
- T2. `test:measure` JSON shows pass gates and non-zero test_count
- T3. Median duration recorded for baseline vs candidate

---

## Sources & References

- `.context/compound-engineering/ce-optimize/vitest-duration/experiment-log.yaml`
- `scripts/measure-vitest-duration.sh`
- PR #26 / plan vitest-duration round 1
