# Strategy digest — vitest-duration

## Categories tried
- parameter-tuning: 2 kept (forks pool, isolate false)
- preprocessing: 1 kept (deps optimizer)

## Key learnings
- Default thread pool + full isolation adds overhead for this small suite (213 tests).
- `isolate: false` is safe here — no cross-test pollution in current suite.
- Vite deps optimizer reduces module transform/collect time on repeat runs.

## Current best
- vitest_seconds: ~2.07 (round 2 median) vs round-2 baseline 4.087 — **−49%** on top of round 1
- All 220 tests pass with `singleFork: true` + `isolate: false`

## Exploration frontier
- maxWorkers tuning (package.json only), reporter/minimal output
- vmForks ruled out (slower)
