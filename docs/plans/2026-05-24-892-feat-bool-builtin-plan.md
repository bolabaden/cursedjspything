---
title: "feat: bool builtin constructor (plan 892)"
type: feat
status: completed
date: 2026-05-24
origin: LIVING-PLAN after int/float builtins (885/889); complete constructor protocol naming
---

# `bool` builtin constructor

## Summary

Add CPython-compatible builtin `bool()` / `bool(x)` returning `pyTrue`/`pyFalse`. Rename stable truthiness export `bool` → `boolProtocol` (mirrors `intProtocol` / `floatProtocol`). Internal runtime keeps importing truthiness from `compare.ts`.

## Requirements

| ID | Requirement |
|----|-------------|
| R1 | `bool()` → `pyFalse` |
| R2 | `bool(x)` → `pyTrue`/`pyFalse` via truthiness (`boolProtocol` / `compare.bool`) |
| R3 | `bool(pyTrue|pyFalse)` preserves identity |
| R4 | `>1` args → `TypeError: bool expected at most 1 argument, got N` |
| R5 | Export `bool as boolProtocol` from operators barrel; export builtin `bool` from builtins |
| R6 | `bool-builtin.test.ts`; migrate test/example `bool` imports to `boolProtocol` |
| R7 | Update COMPATIBILITY, validation-ladder, LIVING-PLAN |
| R8 | `npm run check && npm test && npm run golden:keys` |

## Scope Boundaries

- PEP 3118 out of scope.
- `complex()` builtin deferred.

## Implementation Units

### U1. `bool` constructor

**Files:** `src/runtime/builtins/bool-constructor.ts`, `src/runtime/builtins/index.ts`, `src/barrel/stable.ts`

### U2. Tests and docs

**Files:** `test/cpython-derived/bool-builtin.test.ts`, `test/cpython-derived/*-bool.test.ts`, `test/dispatch/operators.test.ts`, `examples/python-vs-js.ts`, docs

## Verification

```bash
npm run check && npm test && npm run golden:keys
```
