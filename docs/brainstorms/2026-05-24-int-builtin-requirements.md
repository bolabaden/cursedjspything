---
title: "feat: int() builtin constructor"
type: feat
status: active
date: 2026-05-24
origin: docs/knowledgebase/LIVING-PLAN.md; draft plan 885
---

## Summary

Add a CPython-compatible builtin `int()` to pyrt so embedders and tests can construct integers the same way as in Python: zero-arg, numeric conversion, and string/bytes parsing with optional base. The existing `__int__` protocol helper stays on the stable barrel under the name `intProtocol`, matching the `str` / `strProtocol` and `bytes` / `bytesProtocol` split from plans 882 and 884.

## Problem

pyrt exports `toInt` for `__int__` dispatch but has no builtin `int()`. Code and docs that expect `int()`, `int("0x10", 0)`, or `int(pyFloat(3.7))` cannot run without ad hoc helpers. The living plan lists this as the next builtin gap after `str` and `bytes`.

## Requirements

| ID | Requirement |
|----|-------------|
| R1 | `int()` with no arguments returns `pyInt(0)`. |
| R2 | `int(number)` converts int, float, and bool via `__int__` (same semantics as today’s `toInt` / future `intProtocol`). |
| R3 | `int(str)` parses base-10 literals with leading/trailing whitespace stripped and `_` digit separators allowed. |
| R4 | `int(bytes)` parses base-10 ASCII digit bytes (no explicit base argument). |
| R5 | `int(str \| bytes, base)` supports base `0` (auto-detect `0x` / `0o` / `0b` prefixes) and bases 2–36; invalid base raises CPython-aligned `ValueError` / `TypeError` messages. |
| R6 | Non-string/bytes with an explicit base argument raises `TypeError: int() can't convert non-string with explicit base`. |
| R7 | More than two positional arguments raises `TypeError: int expected at most 2 arguments, got N`. |
| R8 | Rename the stable protocol export from `toInt` to `intProtocol`; export builtin `int` from the builtins surface (barrel pattern matches 882/884). |
| R9 | Add `test/cpython-derived/int-builtin.test.ts`; update protocol/conversion tests and docs that reference `toInt`. |
| R10 | `npm run check`, `npm test`, and `npm run golden:keys` pass. |

## Success Criteria

- `int()`, `int(3.7)`, `int("42")`, `int(b"42")`, and `int("0xff", 0)` behave like CPython for normal embedder inputs.
- `intProtocol(pyFloat(3.7))` still works for protocol-style call sites; `toInt` is no longer the public stable name.
- No regressions in the full test suite; golden key export list includes `int` and `intProtocol` as appropriate.

## Key Decisions

| ID | Decision | Rationale |
|----|----------|-----------|
| K1 | Ship the full constructor surface in one slice (numeric + str/bytes + base), not a phased “numbers only” release. | Matches how `str` and `bytes` landed; plan 885 already enumerates forms; splitting would leave misleading gaps in COMPATIBILITY. |
| K2 | Follow the str/bytes barrel split: builtin `int` for construction, `intProtocol` for `__int__` dispatch. | Consistent embedder API; avoids overloading one export. |
| K3 | Values outside JS safe integer range are best-effort via `pyInt` truncation rules already used elsewhere; do not add arbitrary-precision parsing in this slice. | Documented parity limit; full bigint int parsing is deferred cost. |
| K4 | Migrate in-repo `toInt` imports in tests, examples, and docs to `intProtocol` in the same vertical slice. | Prevents two names for the same protocol helper after rename. |

## Scope Boundaries

**In scope**

- New `int` builtin constructor module and barrel exports.
- CPython-aligned errors for arity, base, and invalid literals.
- Tests, compatibility notes, living-plan delta, validation-ladder entry.

**Deferred**

- Arbitrary-precision int literal parsing beyond JS number limits.
- `float()` / `complex()` builtin constructors (separate plans if needed).
- PEP 3118 buffer protocol.

**Out of scope**

- Changes to `pyInt` arithmetic or `__int__` slot behavior on types other than conversion call paths.
- Keyword-only forms beyond what CPython accepts positionally for this embedder API.

## Dependencies and Assumptions

- Plans 882 (`str`) and 884 (`bytes`) constructor patterns are the implementation template.
- Existing `toInt` in `numeric.ts` remains the internal `__int__` dispatcher; the builtin wraps it for numeric inputs and adds literal parsing for str/bytes.
- Plan 886 is merged on `main`; work branches from current `main`.

## Outstanding Questions

None blocking planning; K3 documents the bigint boundary.
