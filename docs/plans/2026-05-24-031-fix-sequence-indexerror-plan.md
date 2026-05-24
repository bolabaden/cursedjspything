---
title: "fix: sequence IndexError raises PyIndexError"
type: fix
status: completed
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md
---

# Sequence IndexError PyIndexError parity

## Summary

Add `PyIndexError` and use it for str/list/tuple out-of-range subscript errors, completing builtin exception typing for sequence access (plans 029–030 covered TypeError guards).

---

## Problem Frame

LIVING-PLAN plan 030 partial: IndexError out-of-range still throws plain `Error` with `IndexError:` prefix in str/list/tuple slots.

---

## Requirements

- R1. Add `PyIndexError` to `src/runtime/core/errors.ts`
- R2. str/list/tuple out-of-range throws use `PyIndexError` with CPython message text
- R3. Extend `sequence-index-type.test.ts` with out-of-range getItem cases
- R4. Sync `parity-gaps-priorities.md` Vitest count to 193+ after new tests
- R5. `npm run check`, `npm test`, `npm run golden:keys`
- R6. LIVING-PLAN delta

---

## Scope Boundaries

- errors.ts + str/list/tuple only
- No golden changes
- Export PyIndexError from barrel if other modules need it (check stable.ts)

---

## Implementation Units

- U1. PyIndexError class + exports
- U2. str/list/tuple slot updates
- U3. Tests + parity-gaps + LIVING-PLAN

---

## Test Scenarios

- T1. `getItem(pyList([]), 0)` throws `PyIndexError`
- T2. `getItem(pyTuple([pyInt(1)]), 5)` throws `PyIndexError`
- T3. `getItem(pyStr("a"), 9)` throws `PyIndexError`
- T4. TypeError guards from plan 030 still pass

---

## Sources & References

- `docs/plans/2026-05-24-030-fix-list-tuple-pytypeerror-plan.md`
- CPython IndexError messages
