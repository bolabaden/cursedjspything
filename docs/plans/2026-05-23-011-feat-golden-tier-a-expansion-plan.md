---
title: "feat: expand golden harness with Tier A protocol cases"
type: feat
status: completed
date: 2026-05-23
origin: docs/knowledgebase/LIVING-PLAN.md
---

# Golden harness Tier A expansion

## Summary

Add four golden cases exercising Tier A parity evidence now guarded by key-parity: str/list `contains`, int/float `eq`, and int/float `add` promotion.

---

## Problem Frame

LIVING-PLAN next step is golden expansion beyond ~11 keys/version. Key-parity guard (merged in #9) makes adding symmetric cases safe. Tier A cpython-derived tests cover these behaviors in Vitest but not in cross-Python JSON golden.

---

## Requirements

- R1. Add `contains_str`, `contains_list`, `int_float_eq`, `int_float_add` to `cases.py` and `pyrt-cases.ts`
- R2. Update `scripts/golden/expected/{3.10,3.12,3.14}.json` and legacy `expected.json`
- R3. Regenerate `scripts/golden/expected/key-sets.json` via `npm run golden:keys`
- R4. Update LIVING-PLAN delta

---

## Scope Boundaries

- Four cases only (no version gates on new keys)
- No runtime code changes unless golden reveals a mismatch

---

## Implementation Units

- U1. `scripts/golden/cases.py`
- U2. `scripts/golden/pyrt-cases.ts`
- U3. Expected fixtures + key snapshot
- U4. LIVING-PLAN

---

## Test Scenarios

| Key | CPython | pyrt |
|-----|---------|------|
| contains_str | `'c' in 'abc'` → true | `contains(pyStr(...))` |
| contains_list | `1 in [0,1,2]` → true | list contains |
| int_float_eq | `1 == 1.0` → true | `eq(pyInt, pyFloat)` |
| int_float_add | `1 + 1.0` → 2.0 | `add` → float |

- T5. `npm run golden` passes
- T6. `npm test` including key-parity snapshot

---

## Sources & References

- `test/cpython-derived/contains-protocol.test.ts`
- `test/cpython-derived/operator-int-float.test.ts`
- `scripts/golden/keys.ts`
