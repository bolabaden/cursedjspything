---
title: "feat: str/bytes and bytes/float cross-type TypeError evidence"
type: feat
status: completed
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md plan 365 next steps
---

# str/bytes and bytes/float cross-type evidence

## Summary

Close niche §8.15 bytes/str gaps: new **`operator-str-bytes-cross-type.test.ts`** for str↔bytes; extend **`operator-bytes-remaining-cross-type.test.ts`** with bytes↔float sub/div/mod/pow and ordering.

## Scope Boundaries

- Tests + docs only
