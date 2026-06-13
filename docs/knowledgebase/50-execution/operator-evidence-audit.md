# Operator evidence audit

**Plan:** 920 · **Date:** 2026-05-24 · **Branch snapshot:** `docs/operator-consolidation-audit-920`  
**Scope:** Read-only inventory of `operator-*.test.ts` and §8.6 sequence operator evidence. No test moves in this slice.

## Executive summary

| # | Finding |
|---|---------|
| 1 | **Complex cluster doc drift:** Ten `operator-complex-*` / `operator-scalar-complex-*` files are cited in `validation-ladder.md` and §8.17 prose but **absent from §8.15 operator bullet list** (line ~416). |
| 2 | **Inverse doc drift:** `operator-int-shift`, `operator-pow-mod`, and `operator-int-bitwise-float` appear in §8.15 bullets and §8.17 evidence but have **no validation-ladder rows**. |
| 3 | **Fragmentation pain:** Complex parity evidence spans ~10 files by operator facet (arithmetic, eq/pow, div/unary, inplace, cross-type binary, scalar-complex pow/div). Highest-value follow-up is doc sync, then a complex-cluster dedupe plan. |

**Top backlog items:** (1) §8.15 + validation-ladder doc sync for complex and inverse-drift files; (2) complex eq/pow canonical-home proposal; (3) bytes happy-path vs remaining-binary overlap review.

---

## Inventory

### Operator files (`operator-*.test.ts`) — 35 files

| File | Purpose (one line) | Operand families | Primary operators | Plans (from headers/ladder) |
|------|-------------------|------------------|-------------------|----------------------------|
| `operator-bool-float.test.ts` | bool↔float comparisons and arithmetic | bool, float | eq, ne, add, sub, mul, truediv | 384 |
| `operator-bool-str-remaining-binary.test.ts` | bool↔str sub/div/mod/pow rejects (add in str-scalar) | bool, str | sub, truediv, floordiv, mod, divmod, pow | 404, 474 |
| `operator-bytes-conversion.test.ts` | `bytesProtocol()` on str vs int/float TypeError | bytes, str, int, float | conversion | — |
| `operator-bytes-cross-type.test.ts` | bytes+bytes add and bytes*int mul happy paths only | bytes, int | add, mul | 418 |
| `operator-bytes-remaining-cross-type.test.ts` | bytes↔scalar full binary + bytes↔scalar ordering | bytes, int, float, str, bool | add, sub, mul, div, mod, eq, ordering | 412, 426 |
| `operator-bytes-scalar-cross-type.test.ts` | bytes↔int/float/bool eq/ne; int*bytes mul | bytes, int, float, bool | eq, ne, mul | 430, 707, 845 |
| `operator-complex-cross-type-binary.test.ts` | complex↔str/list/bytes binary TypeError; floor on complex-left | complex, str, list, bytes | add, sub, mul, floordiv, mod | 904 |
| `operator-complex-div-unary.test.ts` | complex truediv and unary neg/pos/abs | complex, int, float | truediv, neg, pos, abs | 896 |
| `operator-complex-eq-pow.test.ts` | complex eq/ne, bool eq, int pow, ordering TypeError | complex, int, bool | eq, ne, pow, lt | 897, 919 |
| `operator-complex-inplace-cross-type.test.ts` | complex inplace rejects; scalar/bool //= %= complex | complex, int, float, bool, str, bytes | iadd, isub, imul, itruediv, ifloordiv, imod | 910, 914 |
| `operator-complex-pow-complex.test.ts` | complex ** complex via exp(log) | complex | pow | 899 |
| `operator-complex-pow-floordiv.test.ts` | complex float pow, floordiv/mod rejection, ordering vs int | complex, float, int | pow, floordiv, mod, ordering | 898 |
| `operator-complex-scalar.test.ts` | complex +/-/* with int/float/bool and complex | complex, int, float, bool | add, sub, mul | 895, 916 |
| `operator-container-cross-type.test.ts` | dict/list/tuple/set/slice/frozenset cross-type ops | containers, bytes, int | add, eq, ordering, mul | 434–444 |
| `operator-container-scalar-cross-type.test.ts` | dict↔bytes/int/slice eq/ne non-coercion | dict, bytes, int, slice | eq, ne | 436–438 |
| `operator-float-str-remaining-binary.test.ts` | float↔str remaining binary TypeError both orders | float, str | sub, mul, truediv, floordiv, mod, divmod, pow | 408, 476 |
| `operator-format-evidence.test.ts` | `__format__` on builtins; empty spec repr; non-empty TypeError | many builtins | format | 228–252, 900 |
| `operator-inplace-cross-type.test.ts` | In-place cross-type TypeError (scalar↔str/bytes, container iadd) | scalar, str, bytes, containers | iadd, isub, imul, … | 432 |
| `operator-int-bitwise-float.test.ts` | int bitwise/shift vs float TypeError | int, float | lshift, rshift, and, or, xor | — |
| `operator-int-bool.test.ts` | int↔bool comparisons and arithmetic | int, bool | eq, ne, add, sub, mul, truediv | 384 |
| `operator-int-float.test.ts` | int↔float comparisons and arithmetic | int, float | eq, ne, add, sub, mul, truediv, floordiv, mod | 384 |
| `operator-int-shift.test.ts` | int shift operators | int | lshift, rshift | — |
| `operator-int-str-remaining-binary.test.ts` | int↔str remaining binary; int*str repeat | int, str | sub, truediv, floordiv, mod, divmod, pow, mul | 406, 468, 705, 845 |
| `operator-matmul-evidence.test.ts` | matmul `@` rejects builtins without `__matmul__` | builtins | matmul | — |
| `operator-numeric-conversion-evidence.test.ts` | int/float/index/complex protocol rejects on list | list | conversion protocols | — |
| `operator-pow-mod.test.ts` | int pow with mod (three-arg pow) | int | pow | — |
| `operator-rounding-evidence.test.ts` | round/trunc/floor/ceil reject list | list | round, trunc, floor, ceil | — |
| `operator-scalar-complex-pow-edges.test.ts` | scalar ** complex edges: bool, 0**0j, negative base | int, float, bool, complex | pow | 909 |
| `operator-scalar-complex-pow-floordiv.test.ts` | int/float ** complex via `__rpow__`; scalar // % complex reject | int, float, complex | pow, floordiv, mod | 901 |
| `operator-scalar-complex-truediv-pow-modulo.test.ts` | scalar / complex; divmod reject; pow modulo guard | int, float, complex | truediv, divmod, pow | 902 |
| `operator-str-bytes-cross-type.test.ts` | str↔bytes eq/ne, contains, ordering | str, bytes | eq, ne, contains, ordering | 458, 462, 464 |
| `operator-str-float.test.ts` | str↔float eq/ne/add/contains/ordering | str, float | eq, ne, add, contains, ordering | 466, 476 |
| `operator-str-scalar.test.ts` | str↔int/bool eq/ne/add/contains/ordering; str bool repeat | str, int, bool | eq, ne, add, contains, ordering, mul | 384, 406, 468, 470, 474, 554 |
| `operator-unary-evidence.test.ts` | neg/pos/invert/abs reject list | list | unary | — |
| `operator-zerodivision.test.ts` | int/float division by zero ZeroDivisionError | int, float | truediv, floordiv, mod | — |

**Glob verification:** `test/cpython-derived/operator-*.test.ts` → **35 files** (matches table row count).

### Sequence operator evidence (§8.6) — 7 canonical files

| File | Purpose (one line) | Operand families | Primary operators | Plans |
|------|-------------------|------------------|-------------------|-------|
| `sequence-add.test.ts` | list/tuple `__add__` + cross-type rejects | list, tuple, scalar | add | 634, 660–662, 674, 678 |
| `sequence-eq-cross-type.test.ts` | list/tuple/bytes cross-type eq/ne | list, tuple, bytes | eq, ne | 682 |
| `sequence-mul-cross-type.test.ts` | list/tuple mul heterogeneous + int*list repeat | list, tuple, int | mul | 664–670, 680, 845 |
| `sequence-sub.test.ts` | list/tuple `__sub__` + list `__isub__` rejects | list, tuple | sub, isub | 680, 694–701 |
| `sequence-ordering-cross-type.test.ts` | list/tuple cross-type ordering rejects | list, tuple | lt, le, gt, ge | 684 |
| `sequence-iadd.test.ts` | list `__iadd__` extend + scalar rejects | list, tuple, scalar | iadd | 636, 656–658, 672, 686 |
| `sequence-imul.test.ts` | list `__imul__` in-place repeat + cross-type rejects | list, int, bool | imul | 717, 719, 676 |

**Note:** Additional `sequence-*.test.ts` files exist (`sequence-repeat-bool`, `sequence-repeat-index`, `sequence-index-type`, `sequence-repeat-nonint`) but are indexed under repeat/subscript slices in validation-ladder, not §8.6 operator bullets. Out of R2 inventory scope unless cited as operator-adjacent.

### Shared helpers

| Helper | Consumers |
|--------|-----------|
| `test/cpython-derived/helpers/cross-type-ordering.ts` | `operator-container-cross-type`, `operator-bytes-remaining-cross-type`, `operator-str-bytes-cross-type`, `operator-str-scalar`, `operator-str-float` (5 operator files); `sequence-ordering-cross-type` (1 sequence file) — **6 total** |

---

## Documentation parity

Columns: **§8.15 bullet** (COMPATIBILITY ~line 416 list), **§8.17 prose** (operator narrative elsewhere in §8), **validation-ladder row**.

### Complex cluster — filesystem exists, §8.15 bullet missing

| File | §8.15 | §8.17 | Ladder | Gap |
|------|-------|-------|--------|-----|
| `operator-complex-scalar.test.ts` | ✗ | ✓ (prose) | ✓ | Add §8.15 bullet |
| `operator-complex-div-unary.test.ts` | ✗ | ✓ | ✓ | Add §8.15 bullet |
| `operator-complex-eq-pow.test.ts` | ✗ | ✓ | ✓ | Add §8.15 bullet |
| `operator-complex-pow-floordiv.test.ts` | ✗ | ✓ | ✓ | Add §8.15 bullet |
| `operator-complex-pow-complex.test.ts` | ✗ | ✓ | ✓ | Add §8.15 bullet |
| `operator-complex-cross-type-binary.test.ts` | ✗ | ✓ | ✓ | Add §8.15 bullet |
| `operator-complex-inplace-cross-type.test.ts` | ✗ | ✓ | ✓ | Add §8.15 bullet |
| `operator-scalar-complex-pow-floordiv.test.ts` | ✗ | ✓ | ✓ | Add §8.15 bullet |
| `operator-scalar-complex-pow-edges.test.ts` | ✗ | ✓ | ✓ | Add §8.15 bullet |
| `operator-scalar-complex-truediv-pow-modulo.test.ts` | ✗ | ✓ | ✓ | Add §8.15 bullet |

**Fix surface:** `docs/COMPATIBILITY_AND_GAPS.md` §8.15 operator cross-type bullet list.

### Inverse drift — §8.15 bullet present, validation-ladder row missing

| File | §8.15 | §8.17 evidence | Ladder | Gap |
|------|-------|----------------|--------|-----|
| `operator-int-shift.test.ts` | ✓ | ✓ (line ~445) | ✗ | Add ladder row |
| `operator-pow-mod.test.ts` | ✓ | ✓ | ✗ | Add ladder row |
| `operator-int-bitwise-float.test.ts` | ✓ | ✗ | ✗ | Add ladder row; optional §8.17 cite |

**Fix surface:** `docs/knowledgebase/50-execution/validation-ladder.md`.

### Aligned files (sample)

Most §8.15-listed scalar/bytes/str/container files have matching validation-ladder rows. Sequence §8.6 files are cited in both §8.15 (line ~417) and validation-ladder.

### Stale / deleted references

- `operator-list-tuple-cross-type.test.ts` — correctly absent (deleted plan 690); docs cite `sequence-*` supersession.
- No duplicate `test/cpython-derived/test/cpython-derived/` path prefix observed (plan 450 fix held).

### Duplicate citations (R3 flag d)

No erroneous **duplicate path citations** found: each inventoried file appears at most once per doc surface in spot checks. Intentional **multi-surface** cites (e.g. `operator-str-scalar` in §8.15 bullets, §8.17 prose, and validation-ladder) are expected, not drift.

---

## Overlap matrix

**Severity tiers:**

- `duplicate-assertion` — same or near-identical case in two files
- `shared-tuple` — same `(left family, right family, operator)` but different aspects (e.g. eq vs arithmetic)

### Complex cluster

| Left | Right | Operator | Canonical file | Also in | Severity |
|------|-------|----------|----------------|---------|----------|
| complex | bool | `==` / `!=` | `operator-complex-eq-pow` | — | — |
| complex | bool | `+` `-` `*` | `operator-complex-scalar` | — | — |
| complex | int | `==` (imag=0) | `operator-complex-eq-pow` | — | — |
| complex | int | `**` | `operator-complex-eq-pow` | — | — |
| complex | float | `**` | `operator-complex-pow-floordiv` | — | — |
| complex | complex | `**` | `operator-complex-pow-complex` | — | — |
| int | complex | `**` | `operator-scalar-complex-pow-floordiv` | `operator-scalar-complex-pow-edges`, `operator-scalar-complex-truediv-pow-modulo` | shared-tuple |
| float | complex | `/` | `operator-scalar-complex-truediv-pow-modulo` | — | — |
| complex | str/list/bytes | binary | `operator-complex-cross-type-binary` | — | — |
| complex | * | inplace | `operator-complex-inplace-cross-type` | — | — |

**FAQ:** *Which file owns bool↔complex `==`?* → **`operator-complex-eq-pow.test.ts`** (plan 919 block `complex scalar equality with bool subclass operands`).

**R9 sample (`rg`):** `pyTrue` appears in `operator-complex-eq-pow` (eq) and `operator-complex-scalar` (arithmetic) — confirmed **shared-tuple**, not duplicate-assertion.

### Bytes cluster

| Left | Right | Operator | Canonical file | Also in | Severity |
|------|-------|----------|----------------|---------|----------|
| bytes | bytes | `+` | `operator-bytes-cross-type` | — | — |
| bytes | int | `*` | `operator-bytes-cross-type` | `operator-bytes-scalar-cross-type` | shared-tuple |
| bytes | int/float/str/bool | binary rejects | `operator-bytes-remaining-cross-type` | — | — |
| bytes | int/float/bool | eq/ne | `operator-bytes-scalar-cross-type` | — | — |
| bytes | int/float/str/bool | ordering | `operator-bytes-remaining-cross-type` | — | — |

### Scalar str / int / bool / float cluster

Established **canonical + remaining-binary** pattern (plans 404–408):

| Pair | Happy / eq / add / ordering | Remaining binary rejects |
|------|---------------------------|--------------------------|
| str↔int/bool | `operator-str-scalar` | `operator-int-str-remaining-binary`, `operator-bool-str-remaining-binary` |
| str↔float | `operator-str-float` | `operator-float-str-remaining-binary` |
| str↔bytes | `operator-str-bytes-cross-type` | `operator-bytes-remaining-cross-type` (binary) |

No `duplicate-assertion` flagged in sample review; splits are intentional per dedupe plans.

### Sequence vs operator

| Tuple | Canonical | Superseded |
|-------|-----------|------------|
| list/tuple cross-type ops | `sequence-*` (7 files) | `operator-list-tuple-cross-type` (deleted, plan 690) |

---

## Merge proposals (proposals only — no execution)

### 1. Complex cluster (~10 files)

| Proposal | Canonical target | Fold candidates | Risk | Est. case delta |
|----------|------------------|-----------------|------|-----------------|
| Complex eq/pow/ordering | `operator-complex-eq-pow` | None — int `**` only in eq-pow; float `**` in pow-floordiv | Low — no int/float pow overlap | 0 |
| Complex arithmetic + unary + div | `operator-complex-scalar` + `operator-complex-div-unary` | Keep split (unary/div distinct) | Low | 0 (document homes only) |
| Scalar ** complex | `operator-scalar-complex-pow-floordiv` | `pow-edges`, `truediv-pow-modulo` (pow sections) | High — edge cases | −10 to −20 if aggressive |
| Complex inplace | `operator-complex-inplace-cross-type` | None short-term | Low | 0 |

**Recommendation:** Doc-only sync first (§8.15 bullets). Defer file merges until a dedicated plan per sub-cluster with full `npm test` + golden.

### 2. Bytes cluster

| Proposal | Canonical | Fold | Risk |
|----------|-----------|------|------|
| Happy-path bytes+bytes, bytes*int | `operator-bytes-cross-type` OR fold into `operator-bytes-remaining-cross-type` | `operator-bytes-cross-type` (30 lines) | Low case count |

### 3. Scalar cross-type (already consolidated)

Pattern is stable. Future work: verify one-way leftovers per plan 396 style audit — no merge proposed.

### 4. Inplace cross-type

`operator-inplace-cross-type.test.ts` (676 lines) is intentionally monolithic. Proposal: **index in audit only**; split is deferred (high merge conflict risk).

### 5. Format / unary / misc

Single-purpose files (`format-evidence`, `unary-evidence`, `rounding-evidence`, `matmul-evidence`, `zerodivision`, `numeric-conversion-evidence`) — **no merge**; add missing ladder rows for int-shift/pow-mod/bitwise-float only.

---

## Prioritized backlog

| Priority | Slice | Scope | Canonical pattern | Verification |
|----------|-------|-------|-------------------|--------------|
| **P1** | §8.15 complex bullet sync | Doc-only: add 10 complex/scalar-complex files to §8.15 list | Plan 450 | `npm run check` |
| **P1** | Validation-ladder inverse drift | Add rows for `operator-int-shift`, `operator-pow-mod`, `operator-int-bitwise-float` | Plan 919 row format | `npm run check` |
| **P2** | Complex eq/pow doc canonical homes | Audit cross-links in §8.17 prose pointing to eq-pow vs pow-floordiv | This audit § Overlap | `npm run check` |
| **P2** | Bytes happy-path fold review | Decide keep `operator-bytes-cross-type` vs merge into remaining | Plan 418/412 | `npm test` if merge |
| **P3** | Complex scalar-complex pow dedupe | Merge pow edge cases into `operator-scalar-complex-pow-floordiv` | Plans 901/909/902 | full ladder |
| **P3** | Inplace index doc | Add §8.15 subsection pointer for inplace file families | Plan 432 | doc only |

Each P1 item is plannable via `/ce-plan` without re-auditing.

---

## Appendix: CPython `test_operator.py` mapping

**Source:** `vendor/cpython/Lib/test/test_operator.py` (present in repo).

| CPython area | pyrt evidence | Gap |
|--------------|---------------|-----|
| `test_operator` int/float/bool cross-type | `operator-int-float`, `operator-int-bool`, `operator-bool-float` | Aligned |
| str↔numeric | `operator-str-scalar`, `*-remaining-binary` | Aligned (split pattern) |
| bytes | `operator-bytes-*` cluster | Aligned |
| complex | `operator-complex-*`, `operator-scalar-complex-*` | Fragmented across many files; no single `test_operator` port |
| list/tuple seq ops | `sequence-*` (not `operator-*`) | Intentional §8.6 split post plan 690 |
| `@` matmul | `operator-matmul-evidence` | Spot check only |
| User-defined / pure Python classes | Partial via `operator-format-evidence` fallback class | No wholesale class matrix |

**Non-goal:** Line-by-line port of `test_operator.py`.

---

## Verification log (plan 920 R9)

| Check | Result |
|-------|--------|
| Operator glob count = inventory rows | 35 = 35 ✓ |
| Sequence R2 count = 7 rows | 7 = 7 ✓ |
| bool↔complex `==` canonical answer | `operator-complex-eq-pow.test.ts` ✓ |
| `rg pyTrue` complex overlap sample | eq vs arithmetic = shared-tuple ✓ |
