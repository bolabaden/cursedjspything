# Strategy digest — vitest-duration

## Categories tried
- parameter-tuning: 2 kept (forks pool, isolate false)
- preprocessing: 1 kept (deps optimizer)

## Key learnings
- Default thread pool + full isolation adds overhead for this small suite (213 tests).
- `isolate: false` is safe here — no cross-test pollution in current suite.
- Vite deps optimizer reduces module transform/collect time on repeat runs.

## Current best
- vitest_seconds: 2.184 (median) vs baseline 3.519 — **−37.9%**
- All 213 tests pass

## Exploration frontier
- maxWorkers tuning, vmForks pool, reporter/minimal output (package.json only)
