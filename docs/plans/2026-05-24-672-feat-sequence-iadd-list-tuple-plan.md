---
title: "feat: list __iadd__ tuple extend evidence (plan 672)"
type: feat
status: completed
date: 2026-05-24
origin: LIVING-PLAN §8.6; post plan 670 sequence-mul matrix
---

# list __iadd__ tuple extend evidence

## Summary

Extend **`sequence-iadd.test.ts`** with CPython **`list += tuple`** in-place extend evidence (returns `self`, mutates length). Cross-type **`+=`** rejects remain from plans 656–658. Evidence-only.

---

## Problem Frame

Plan 636 documented `list += list`. Plan 374 implemented tuple extend, but the happy path is only named in `operator-list-tuple-cross-type.test.ts`, not the §8.6 `sequence-iadd` evidence file.

---

## Requirements

| ID | Requirement |
|----|-------------|
| R1 | `iadd(list, tuple)` extends list in place like CPython `list += tuple` |
| R2 | `iadd` returns the same list instance |
| R3 | §8.6 COMPATIBILITY and validation-ladder updated for plan 672 |
| R4 | `npm run check && npm test && npm run golden:keys` green |

---

## Scope Boundaries

### Outside scope

- Runtime changes unless tests expose a bug.
- Removing duplicate tests from `operator-list-tuple-cross-type.test.ts`.

---

## Implementation Units

### U1. Vitest — `test/cpython-derived/sequence-iadd.test.ts`

### U2. Docs sync

---

## Verification

```bash
npm run check && npm test && npm run golden:keys
```
