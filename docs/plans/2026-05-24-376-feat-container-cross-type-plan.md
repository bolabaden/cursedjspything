---
title: "feat: dict/list/slice container cross-type operator evidence"
type: feat
status: completed
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md plan 375 next steps
---

# Container cross-type operator evidence

## Summary

Close niche §8.15 gaps for **dict**, **list**, **tuple**, and **slice** with unrelated containers and scalars: equality, ordering TypeErrors, and binary `add` rejects.

## Scope Boundaries

- Tests + docs only
- No CPython-specific concat error string parity

---

### U1. Vitest evidence

**Files:** `test/cpython-derived/operator-container-cross-type.test.ts`

**Test scenarios:**
- dict↔list and dict↔tuple `add` TypeError both orders
- dict↔list and dict↔tuple `eq` false; ordering TypeError
- slice↔int/list `add` TypeError; slice↔list `eq` false; ordering TypeError
- tuple+int `add` TypeError

### U2. Docs

**Files:** `docs/COMPATIBILITY_AND_GAPS.md`, `docs/knowledgebase/LIVING-PLAN.md`
