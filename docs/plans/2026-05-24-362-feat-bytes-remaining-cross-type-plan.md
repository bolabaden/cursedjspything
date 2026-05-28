---
title: "feat: bytes remaining cross-type TypeError evidence"
type: feat
status: completed
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md plan 361 next steps (§8.15 bytes)
---

# bytes remaining cross-type TypeError evidence

## Summary

Extend §8.15 bytes cross-type coverage beyond `operator-bytes-cross-type.test.ts` (add/mul): prove **`sub`**, **`truediv`**, **`floordiv`**, **`mod`**, **`divmod`**, **`pow`**, and ordering **`lt`/`le`/`gt`/`ge`** reject incompatible bytes/scalar pairs with **`PyTypeError`**.

## Requirements

- R1. Add `test/cpython-derived/operator-bytes-remaining-cross-type.test.ts`
- R2. Update COMPATIBILITY §8.15 evidence; trim outdated bytes remaining-gap prose
- R3. validation-ladder row; LIVING-PLAN delta
- R4. `npm run check`, `npm test`, `npm run golden:keys`

## Scope Boundaries

- Tests + docs only
- No runtime changes
