---
title: "feat: Golden key-parity guard (rebase on main)"
type: feat
status: completed
date: 2026-05-23
origin: docs/brainstorms/2026-05-19-golden-key-parity-requirements.md
---

# Golden key-parity guard (rebase on main)

## Summary

Land the golden harness key-parity guard on current `main`, which now includes `rich_lt_both_not_impl_raises` and hash/bool tests from PR #2. Extract `buildPyrtCases`, wire runtime key checks, add offline Vitest snapshot, and document contributor workflow.

---

## Problem Frame

PR #3 implemented key parity on a stale base. `main` advanced with Tier-1 golden cases but still lacks structural key-set enforcement before value compare.

---

## Requirements

- R1–R6 from `docs/brainstorms/2026-05-19-golden-key-parity-requirements.md`

---

## Implementation Units

- U1. Extract `scripts/golden/pyrt-cases.ts` from current `run.ts` (include Incomparable + `PyTypeError` check from main)
- U2. Add `scripts/golden/keys.ts` and wire `assertGoldenKeyParity` in `run.ts` before value compare
- U3. Add `key-sets.json`, `golden:keys` script, `test/golden/key-parity.test.ts`
- U4. Update README and validation ladder

---

## Sources & References

- `origin/feat/golden-key-parity-guard` — prior implementation to port
- `docs/brainstorms/2026-05-19-golden-key-parity-requirements.md`
