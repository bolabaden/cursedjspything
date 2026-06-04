---
title: "feat: tuple __sub__ scalar reject evidence (plan 698)"
type: feat
status: completed
date: 2026-05-24
origin: plan 697 merge; mirror sequence-add tuple scalar rejects
---

# tuple `-` scalar operand rejects

## Summary

Extend **`sequence-sub.test.ts`** with tuple↔**str/bytes/float/bool** `-` rejects (plan 697 covered tuple↔tuple/int). Sync KB counts to **1183** Vitest. Record plan 697 merge (PR #365).

---

## Problem Frame

`sequence-add.test.ts` documents tuple `+` rejects for str/bytes/float/bool; `sequence-sub.test.ts` lacks the matching `-` evidence for §8.6 parity. `repo-signals.md` still cites **1177** tests.

---

## Requirements

| ID | Requirement |
|----|-------------|
| R1 | `sub(tuple, str/bytes/float/bool)` both orders each → `PyTypeError` |
| R2 | §8.6 COMPATIBILITY + validation-ladder updated |
| R3 | `repo-signals.md` and `runtime-overview.md` → 1183 / 163 |
| R4 | LIVING-PLAN: plan 697 merge PR #365; plan 698 delta |
| R5 | `npm run check && npm test && npm run golden:keys` green |

---

## Scope Boundaries

- Tests + docs only

---

## Implementation Units

- U1. `test/cpython-derived/sequence-sub.test.ts`
- U2. `docs/COMPATIBILITY_AND_GAPS.md`, `validation-ladder.md`, `repo-signals.md`, `runtime-overview.md`
- U3. `docs/knowledgebase/LIVING-PLAN.md`

---

## Verification

```bash
npm run check && npm test && npm run golden:keys
```
