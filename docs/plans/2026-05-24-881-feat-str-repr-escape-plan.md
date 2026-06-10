---
title: "feat: str __repr__ escape (plan 881)"
type: feat
status: completed
date: 2026-05-24
origin: plan 880 partial str repr control-char gap
---

# `str.__repr__` CPython escaping

## Summary

Replace naive `str.__repr__` (`'${text}'`) with CPython-compatible quoting: escape `'`, `\`, named whitespace controls, and non-printable code points (`\x`, `\u`, `\U`). Unblocks `ascii('\n')` parity noted in plan 880.

## Requirements

| ID | Requirement |
|----|-------------|
| R1 | Printable ASCII and Unicode (e.g. `é`, `Ā`) appear literally in single-quoted repr |
| R2 | `'` and `\` escaped; `\n`/`\t`/`\r` use named escapes |
| R3 | Non-printable BMP → `\xNN` (≤0xff) or `\uNNNN` (e.g. surrogate, BOM) |
| R4 | `str-repr.test.ts` + extend `ascii-builtin.test.ts` newline case |
| R5 | Update compatibility + living-plan + validation-ladder |
| R6 | `npm run check && npm test && npm run golden:keys` |

## Scope Boundaries

- `str.__str__` unchanged (returns raw text).
- PEP 3118 out of scope.

## Implementation Units

### U1. `strRepr` helper

**Files:** `src/runtime/builtins/str.ts`

**Approach:** Code-point walk with printable heuristic aligned to CPython `isprintable` (exclude Cc/Cf/Cs/Cn/Zl/Zp); wire into `Slot.repr`.

### U2. Tests and docs

**Files:** `test/cpython-derived/str-repr.test.ts`, `test/cpython-derived/ascii-builtin.test.ts`, docs

## Verification

```bash
npm run check && npm test && npm run golden:keys
```
