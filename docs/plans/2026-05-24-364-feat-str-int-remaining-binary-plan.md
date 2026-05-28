---
title: "feat: str/int remaining binary TypeError evidence"
type: feat
status: completed
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md plan 363 next steps
---

# str/int remaining binary TypeError evidence

## Summary

Complete str↔int §8.15 coverage beyond `operator-str-scalar.test.ts` and `operator-int-str-remaining-binary.test.ts`: prove str-forward **`sub`**, **`truediv`**, **`floordiv`**, **`mod`**, and ordering **`lt`/`le`/`gt`/`ge`** reject incompatible pairs with **`PyTypeError`**.

## Scope Boundaries

- Tests + docs only
- Skip `mul` (int * str valid via str `__rmul__`)
