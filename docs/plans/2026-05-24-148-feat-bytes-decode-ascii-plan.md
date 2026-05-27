---
title: "feat: bytes decode ascii codec"
type: feat
status: active
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md plan 147 next steps
---

# Bytes decode ascii codec

## Summary

Add **`bytes.decode('ascii', errors=...)`** with strict, replace, and ignore handlers — the next codec gap after utf-8 and latin-1.

---

## Problem Frame

Plan 147 next step lists codec handlers. `bytes.decode` supports utf-8 and latin-1; `str.encode` already supports ascii — decode parity is missing.

---

## Requirements

- R1. `b'hello'.decode('ascii')` → `'hello'`
- R2. `b'\\xff'.decode('ascii', 'strict')` → `UnicodeDecodeError`; replace → `\\ufffd`; ignore skips high bytes
- R3. Unknown encoding / errors behavior unchanged
- R4. Extend `test/cpython-derived/bytes-decode.test.ts` with ascii cases
- R5. COMPATIBILITY / validation-ladder / LIVING-PLAN delta
- R6. `npm run check`, `npm test`, `npm run golden:keys`

---

## Scope Boundaries

- No surrogateescape / backslashreplace handlers
- No str-side codec changes

---

## Implementation Units

- U1. `decodeAscii` helper + `decodeBytesPayload` branch
- U2. Vitest evidence
- U3. Docs + feature branch + PR

---

## Test Scenarios

- T1. ascii strict success and failure
- T2. ascii replace and ignore
- T3. errors handler parity with utf-8 paths

---

## Patterns

Mirror `decodeUtf8` error strings; reuse `decodeErrorsArg`.
