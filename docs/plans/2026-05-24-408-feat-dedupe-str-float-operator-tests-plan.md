---
title: "feat: dedupe str↔float operator tests (plan 408)"
type: feat
status: completed
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md plan 407
---

# Dedupe str↔float operator test overlap

## Summary

Consolidate into `operator-float-str-remaining-binary.test.ts`; delete `operator-str-float-remaining-binary.test.ts`; keep `operator-str-float.test.ts` for eq/ne only.

## Requirements

| ID | Requirement |
|----|-------------|
| R1 | Canonical file adds mul + ordering both orders |
| R2 | Delete `operator-str-float-remaining-binary.test.ts` |
| R3 | `operator-str-float.test.ts` eq/ne only |
| R4 | validation-ladder + LIVING-PLAN; tests green |
