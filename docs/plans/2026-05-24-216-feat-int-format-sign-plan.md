---
title: "feat: int format sign variants"
type: feat
status: completed
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md plan 215 partial / plan 214 deferred
---

# int format sign variants

## Summary

Extend **`int.__format__`** with CPython sign options (`+`, `-`, space-before-positive) combined with width padding (`+04d`, ` d`, ` 4d`).

---

## Problem Frame

Plan 214 landed width padding; LIVING-PLAN partial deferred sign/`+` fill variants.

---

## Requirements

- R1. `format(pyInt(1), "+04d")` → `"+001"`; `format(pyInt(-1), "+04d")` → `"-001"`
- R2. `format(pyInt(1), "+4d")` → space-padded with sign
- R3. `format(pyInt(1), " d")` → `" 1"`; negative unchanged minus form
- R4. `format(pyInt(1), "-04d")` → `"0001"` (no plus on positive)
- R5. Sign with typed width e.g. `+04x` on positive
- R6. Extend format evidence tests + LIVING-PLAN delta; full validation ladder

---

## Scope Boundaries

- No float-style `f` on int; PEP 3118 out of scope

---

## Implementation Units

- U1. `parseIntFormatSign` + signed padding in `formatIntSpec`
- U2. Tests + feature branch + PR

---

## Test Scenarios

- T1. `+04d` / `+4d` positive and negative
- T2. ` d` and ` 4d` space-sign decimal
- T3. `-04d` and `+04x`

---

## Patterns

Extend plan 214 `formatIntSpec` / `padIntFormat` in `int.ts`.
