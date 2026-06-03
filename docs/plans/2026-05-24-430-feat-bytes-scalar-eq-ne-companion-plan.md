---
title: "feat: bytes↔scalar eq/ne companion (plan 430)"
type: feat
status: completed
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md plan 429
---

# Bytes↔scalar eq/ne companion

## Summary

Add `operator-bytes-scalar-cross-type.test.ts` for bytes↔int/float/bool eq/ne non-coercion (mirrors `operator-str-bytes-cross-type` / `operator-str-float`). Remove partial int-only eq case from `bytes-getitem-compare.test.ts`.

## Requirements

| ID | Requirement |
|----|-------------|
| R1 | New file: eq/ne false/true both orders for bytes↔int, float, bool |
| R2 | Slim bytes-getitem-compare (no duplicate eq int) |
| R3 | validation-ladder + COMPATIBILITY evidence |
| R4 | `npm run check`, `npm test`, `npm run golden:keys` green |

## Scope Boundaries

### Outside scope

- str↔bytes file move; runtime; golden; PEP 3118
