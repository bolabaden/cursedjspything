---
title: "feat: set algebra uses hash+eq membership (plan 592)"
type: feat
status: active
date: 2026-05-24
origin: plan 590 merge PR #309; exhaustive LFG pass
---

# Set algebra hash+eq membership

## Brainstorm

| Gap | Risk |
|-----|------|
| `unionItems` spreads `[...a, ...b]` | Relied on `pySet()` dedupe only; direct consumers could see duplicate equal keys |
| Algebra tests use `pyInt` only | Equal custom `__eq__`/`__hash__` keys not covered for `\|`, `&`, `-`, `^`, named methods |

Plan 590 wired mutation/contains; algebra **intersection/difference** already use `setMemberHas`. **Union** still concatenates arrays.

## Summary

Build `unionItems` with `setAddMember`, add cpython-derived algebra tests with equal-but-distinct keys, sync §8.5/8.15 and validation-ladder.

## Requirements

| ID | Requirement |
|----|-------------|
| R1 | `unionItems` accumulates via `setAddMember` (no duplicate equal keys in returned item list) |
| R2 | `bitwiseOr`, `bitwiseAnd`, `sub`, `bitwiseXor`, and named `union`/`intersection`/`difference`/`symmetric_difference` correct when operands hold equal-but-distinct keys |
| R3 | `set-algebra-membership.test.ts` (or extend `frozenset-set-algebra.test.ts`) with `Key` helper class |
| R4 | COMPATIBILITY §8.5 + validation-ladder; LIVING-PLAN delta after merge |
| R5 | `npm run check && npm test && npm run golden:keys` green |

## Scope Boundaries

### Outside scope

- PEP 3118; list/tuple multiset semantics; CPython set table internals.

## Implementation Units

### U1. `set-algebra.ts` + tests

`unionItems` uses temporary `Set` + `setAddMember`; tests for `|`, `&`, `-`, `^`, named methods.

### U2. Docs

`COMPATIBILITY_AND_GAPS.md`, `validation-ladder.md`

## Verification

```bash
npm run check && npm test && npm run golden:keys
```

## Review checklist

- [ ] Union of `{k1}` and `{k2}` (k1==k2) has len 1
- [ ] Intersection/difference/symmetric_difference with equal keys match CPython
