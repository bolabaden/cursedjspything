---
title: "feat: str/float remaining binary TypeError evidence"
type: feat
status: completed
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md plan 359 next steps (§8.15 float↔str)
---

# str/float remaining binary TypeError evidence

## Summary

Complete str↔float §8.15 coverage beyond `operator-str-float.test.ts` (add/sub/mul/eq/ne): prove **`truediv`**, **`floordiv`**, **`mod`**, **`divmod`**, **`pow`**, and ordering **`lt`/`le`/`gt`/`ge`** reject incompatible pairs with **`PyTypeError`**.

## Requirements

- R1. Add `test/cpython-derived/operator-str-float-remaining-binary.test.ts`
- R2. Update COMPATIBILITY §8.15 evidence; validation-ladder row
- R3. LIVING-PLAN delta
- R4. `npm run check`, `npm test`, `npm run golden:keys`

## Scope Boundaries

- Tests + docs only
- No runtime changes
