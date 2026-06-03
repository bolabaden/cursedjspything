---
title: "feat: bool↔str bidirectional binary TypeError evidence (plan 392)"
type: feat
status: completed
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md plan 391; follows plans 384–390
deepened: 2026-05-24
---

# bool↔str bidirectional binary TypeError evidence

## Summary

Symmetric §8.15 coverage for **bool↔str**: bidirectional **`sub`** and **`truediv`** in `operator-bool-str-binary.test.ts`; bidirectional **`floordiv`** and **`mod`** in `operator-bool-str-remaining-binary.test.ts` (`divmod`/`pow` and `add` already both-order). Tests and docs only.

## Problem Frame

After plans 384–390, bool↔str is the remaining scalar pair with one-way sub/truediv/floordiv/mod tests. CPython reports operand types in both orders; reflected paths need characterization.

## Requirements

| ID | Requirement |
|----|-------------|
| R1 | `operator-bool-str-binary.test.ts`: sub, truediv both orders |
| R2 | `operator-bool-str-remaining-binary.test.ts`: floordiv, mod both orders |
| R3 | validation-ladder + LIVING-PLAN 3-delta |
| R4 | `npm run check`, `npm test`, `npm run golden:keys` green |

## Scope Boundaries

### Outside scope

- Runtime changes; PEP 3118; bool↔int/float (other files)

---

## Implementation Units

### U1. bool-str-binary bidirectional sub/truediv

**Files:** `test/cpython-derived/operator-bool-str-binary.test.ts`

### U2. bool-str-remaining bidirectional floordiv/mod

**Files:** `test/cpython-derived/operator-bool-str-remaining-binary.test.ts`

### U3. Documentation

**Files:** `docs/knowledgebase/50-execution/validation-ladder.md`, `docs/knowledgebase/LIVING-PLAN.md`
