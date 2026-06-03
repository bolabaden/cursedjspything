---
title: "feat: dedupe str↔bytes operator tests (plan 412)"
type: feat
status: completed
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md plan 411
---

# Dedupe str↔bytes operator test overlap

## Summary

Merge str↔bytes binary/ordering into `operator-bytes-remaining-cross-type.test.ts`; keep `operator-str-bytes-cross-type.test.ts` for eq/ne only.

## Requirements

| R1 | bytes-remaining adds mul/truediv/floordiv/mod/divmod/pow for bytes↔str |
| R2 | str-bytes file eq/ne only |
| R3 | validation-ladder + LIVING-PLAN; tests green |
