---
title: "feat: minimal bytes PyObject and cross-type operator evidence"
type: feat
status: completed
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md plan 087 next steps
---

# Minimal bytes PyObject and cross-type operator evidence

## Summary

Introduce a minimal **`bytes`** builtin (`pyBytes` / `bytesType`) so `bytes(str)` returns a PyObject, and add §8.15 evidence for bytes↔unrelated-scalar operator rejection.

---

## Problem Frame

`bytes()` currently returns raw `Uint8Array`; there is no `bytes` PyObject type, blocking cross-type operator tests and understating §8.15 gaps.

---

## Requirements

- R1. Add `src/runtime/builtins/bytes.ts` — `bytesType`, `pyBytes`; slots: repr, len, eq, add (bytes+bytes), mul/rmul (int repeat via `sequenceRepeatCount`)
- R2. `str.__bytes__` and exported `bytes()` return `pyBytes`
- R3. Add `test/cpython-derived/operator-bytes-cross-type.test.ts` (add/mul TypeError vs int/str/float; happy bytes+bytes, bytes*int)
- R4. Update `operator-bytes-conversion.test.ts` for PyObject return
- R5. Export from builtins barrel and `stable.ts`
- R6. COMPATIBILITY §8.15 evidence + validation-ladder row; LIVING-PLAN delta
- R7. `npm run check`, `npm test`, `npm run golden:keys`

---

## Scope Boundaries

- No PEP 3118 / buffer protocol expansion
- No bytesgetitem, decode, or full CPython bytes API
- Cross-type rejection via `NotImplemented` + dispatch TypeError (existing pattern)

---

## Implementation Units

- U1. **Runtime** — `bytes.ts`, wire str hook + `bytes()` helper
- U2. **Tests** — conversion update + cross-type evidence
- U3. **Docs** — COMPATIBILITY, validation-ladder, LIVING-PLAN
- U4. Feature branch + PR

---

## Test Scenarios

- T1. `bytes(pyStr("ab"))` returns `bytesType` PyObject with UTF-8 payload
- T2. `add(bytes, int)` and `add(int, bytes)` → `PyTypeError`
- T3. `mul(bytes, str)` and `mul(bytes, float)` → `PyTypeError`
- T4. `add(b1, b2)` concatenates; `mul(b, int)` repeats
