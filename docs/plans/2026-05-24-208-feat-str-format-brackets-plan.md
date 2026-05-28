---
title: "feat: str format bracket index fields"
type: feat
status: active
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md plan 207 next steps
---

# str format bracket index fields

## Summary

Extend format field names with **`[index]`** subscript steps (`{0[name]}`, `{0[0]}`, nested `{0[1][0]}`) via `getItem`, complementing dot attributes.

---

## Problem Frame

Plan 207 landed dot-attribute fields. LIVING-PLAN next is bracket/index grammar before kwargs bridging.

---

## Requirements

- R1. `'{0[name]}'.format(dict)` → subscript with string/identifier key
- R2. `'{0[0]}'.format(list)` → integer index via `getItem`
- R3. Nested `{0[1][0]}` chains
- R4. Mix with dots where applicable (`{0[1][0].x}` deferred if complex — at least pure bracket chains)
- R5. Extend `test/cpython-derived/str-format.test.ts`
- R6. validation-ladder + LIVING-PLAN delta; full validation ladder

---

## Scope Boundaries

- Bracket index: integer literals and identifier keys only (no quoted strings or expressions)
- No `**kwargs` on `.format()` at JS call boundary

---

## Implementation Units

- U1. Replace dot-only `parseFieldName` with step parser (`.attr` | `[key]`)
- U2. `applyFormatSteps` using `getAttr` / `getItem`
- U3. Tests + docs + feature branch + PR

---

## Test Scenarios

- T1. `{0[name]}` on dict positional
- T2. `{0[0]}` on list
- T3. `{0[1][0]}` nested subscripts

---

## Patterns

Follow plan 206 attribute chain; use `getItem` from `protocols.ts`.
