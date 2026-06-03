---
title: "feat: inplace bytes↔str remaining ops (plan 416)"
type: feat
status: completed
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md plan 415
---

# Inplace bytes↔str remaining ops

## Summary

Extend `operator-inplace-cross-type.test.ts` with full inplace reject set for bytes↔str (`+=` through `**=`, both orders). pyrt uses unified `unsupported operand type(s)` messages.
