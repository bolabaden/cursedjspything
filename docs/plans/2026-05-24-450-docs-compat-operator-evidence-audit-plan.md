---
title: "docs: §8.15 operator evidence consolidation audit (plan 450)"
type: docs
status: completed
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md plan 449
---

# COMPATIBILITY §8.15 operator evidence audit

## Summary

Sync `docs/COMPATIBILITY_AND_GAPS.md` §8.15 prose and evidence list with consolidated operator test files (plans 428–448): fix stale path prefix, add missing `operator-*` entries, retire deleted-file references.

## Requirements

| ID | Requirement |
|----|-------------|
| R1 | Fix duplicate `test/cpython-derived/test/cpython-derived/` prefix on `str-encode` evidence path |
| R2 | §8.15 prose cites canonical files: `operator-list-tuple-cross-type`, `operator-container-scalar-cross-type`, `operator-inplace-cross-type`, consolidated bool/str/bytes paths |
| R3 | Evidence list includes `operator-container-scalar-cross-type`, `operator-int-bitwise-float`, `operator-zerodivision`, `operator-pow-mod`, `operator-int-shift` |
| R4 | No references to deleted operator files (`operator-*-binary` splits, `operator-sequence-cross-type-add`, `operator-str-int-remaining-binary`) |

## Scope Boundaries

### Outside scope

- Runtime; test changes; golden; PEP 3118.

## Verification

```bash
npm run check && npm test && npm run golden:keys
```
