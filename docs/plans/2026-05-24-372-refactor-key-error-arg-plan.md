---
title: "refactor: shared keyErrorArg for dict and set"
type: refactor
status: completed
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md plan 371 next steps
---

# Shared keyErrorArg helper (plan 372)

## Summary

Extract duplicated **`keyErrorArg`** from `dict.ts` and `set.ts` into `key-error-arg.ts`. No behavior change; existing Vitest covers messages.

## Scope Boundaries

- Refactor only; no new tests required unless regression found
