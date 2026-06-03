---
title: "feat: §8.15 one-way operator test audit (plan 396)"
type: feat
status: completed
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md plan 395
deepened: 2026-05-24
---

# §8.15 one-way operator test audit

## Summary

Repo-wide audit of legacy **split** operator test files: upgrade remaining single-order `TypeError` cases to **both operand orders** where `*-remaining-*` files already cover the pair but the dedicated file still asserts lhs-only.

## Problem Frame

Plans 384–394 symmetricized consolidated files. Older files (`operator-float-str-binary`, `operator-int-str-binary`, `operator-float-str-floordiv-mod`, `operator-str-bytes-cross-type`) still document one-way rejects — drift risk and inconsistent evidence story.

## Requirements

| ID | Requirement |
|----|-------------|
| R1 | `operator-float-str-binary.test.ts`: sub, truediv both orders |
| R2 | `operator-int-str-binary.test.ts`: truediv, floordiv, mod both orders |
| R3 | `operator-float-str-floordiv-mod.test.ts`: floordiv, mod both orders |
| R4 | `operator-str-bytes-cross-type.test.ts`: truediv, floordiv, mod both orders |
| R5 | validation-ladder rows + LIVING-PLAN 3-delta |
| R6 | `npm run check`, `npm test`, `npm run golden:keys` green |

## Scope Boundaries

### Outside scope

- Deleting duplicate split files (keep for ladder traceability); runtime changes; golden new keys

---

## Implementation Units

### U1–U4. Bidirectional upgrades per file (R1–R4)

### U5. Documentation (R5)

**Files:** `docs/knowledgebase/50-execution/validation-ladder.md`, `docs/knowledgebase/LIVING-PLAN.md`
