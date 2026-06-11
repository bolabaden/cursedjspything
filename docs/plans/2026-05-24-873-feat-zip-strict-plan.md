---
title: "feat: zip strict mode (plan 873)"
type: feat
status: completed
date: 2026-05-24
origin: plan 866 deferred zip(strict=True)
---

# `zip` `strict=True`

## Summary

pyrt `zip` (plan 866) stops at the shortest iterable. Add optional trailing `strict` bool (embedder positional API) raising `ValueError` when input lengths differ.

## Requirements

| ID | Requirement |
|----|-------------|
| R1 | `zip(*iterables, strict=False)` default — unchanged shortest-wins |
| R2 | `zip(*iterables, pyTrue)` — `ValueError` if any iterable shorter/longer |
| R3 | Messages: `zip() argument N is shorter/longer than argument M` (CPython parity) |
| R4 | Trailing arg must be bool/`pyBool`; otherwise treated as iterable |
| R5 | Extend `zip-builtin.test.ts` + docs |
| R6 | `npm run check && npm test && npm run golden:keys` |

## Scope Boundaries

- Python keyword-only `strict` syntax deferred.
- PEP 3118 out of scope.

## Verification

```bash
npm run check && npm test && npm run golden:keys
```
